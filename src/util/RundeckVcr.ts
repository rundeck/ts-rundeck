import {Request as NodeRequest} from 'node-fetch'

import {FS} from './node'

const NodeReq = NodeRequest as any as new(input: RequestInfo, init?: RequestInit) => Request
const Request = NodeReq

export interface ResponseRecord {
    headers: Array<[string,string]>
    ok: boolean
    redirected: boolean
    status: number
    statusText: string
    type?: ResponseType
    url: string
    body: string
    delay: number
}

export interface RequestRecord {
    url: string
    method: string
    headers: Array<[string,string]>
    body?: string
}

export class RundeckVcr {
    realFetch: typeof global.fetch
    cassette?: Cassette

    constructor() {
        this.realFetch = global.fetch
    }

    record(cassette: Cassette) {
        this.cassette = cassette
        global.fetch = this.recordIntercept
    }

    async play(cassette: Cassette, fetchMock?: typeof import('fetch-mock')) {
        if (!fetchMock) {
            fetchMock = (await import('fetch-mock')).default
            console.log(fetchMock)
        }

        const respMap = new Map<string, CassetteRecord[]>()

        for (let rec of cassette.records) {
            const key = `${rec.request.method} ${rec.request.url}`
            if (!respMap.has(key))
                respMap.set(key, [])
            
            let records = respMap.get(key)!
            records.push(rec)
        }

        for (let [key, recs] of respMap.entries()) {
            const rawUrl = new URL(recs[0].request.url)
            const matchUrl = `${rawUrl.pathname}${rawUrl.search}`
            fetchMock.mock({
                url: matchUrl,
                method: recs[0].request.method
            }, async (url, opts) => {
                const {response} = recs.shift()!

                await new Promise((res, rej) => setTimeout(res, response.delay))

                return {
                    body: response.body,
                    status: response.status,
                    headers: response.headers
                }
            })
        }
    }

    stop() {
        global.fetch = this.realFetch
    }

    eject() {
        const {cassette} = this
        this.cassette = undefined
        return cassette
    }

    recordIntercept = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const request = new Request(input, init)

        if (! this.cassette!.matches(request.url))
            return this.realFetch(input, init)

        const start = Date.now()
        const resp = await this.realFetch(input, init)
        const delay = Date.now() - start

        this.processCall(request.clone(), resp.clone(), delay)

        return resp
    }

    processCall(request: Request, response: Response, delay: number) {
        this.cassette!.record(request, response, delay)
    }
}

interface CassetteRecord {
    response: ResponseRecord
    request: RequestRecord
}

export class Cassette {
    urls: Array<string | RegExp>
    file: string
    records: Array<CassetteRecord> = []
    pendingRecords: Array<Promise<CassetteRecord>> = []

    constructor(urls: Array<string | RegExp>, file: string) {
        this.urls = urls
        this.file = file
    }

    static async Load(file: string) {
        console.log(FS.readFile)
        const rawRecords = await FS.readFile(file)
        const cassette = new Cassette([], file)
        cassette.records = JSON.parse(rawRecords.toString())
        return cassette
    }

    matches(testUrl: string) {
        for (let url of this.urls) {
            if (typeof url == 'string')
                if (testUrl == url)
                    return true
                else
                    continue
            else
                if (url.test(testUrl))
                    return true
                else
                    continue
        }
        return false
    }

    record(request: Request, response: Response, delay: number) {
        const processor = async () => ({
            request: {
                url: request.url,
                method: request.method,
                headers: Array.from(request.headers),
                body: await request.text(),
            },
            response: {
                url: response.url,
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                type: response.type,
                redirected: response.redirected,
                body: await response.text(),
                headers: Array.from(response.headers),
                delay
            }
        })

        this.pendingRecords.push(processor())
    }

    async store() {
        await FS.writeFile(this.file, JSON.stringify(await Promise.all(this.pendingRecords), null, '  '))
    }
}