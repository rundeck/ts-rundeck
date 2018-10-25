import {WebResource, HttpOperationResponse, RequestPrepareOptions, ServiceClientOptions} from 'ms-rest-js'

import {BaseCredentialProvider} from './baseCredProvider'

import {Rundeck} from './index'

import Queue from 'promise-queue'

/**
 * Client for use in Rundeck UI
 */
export class RundeckBrowser extends Rundeck {
    token: string | null
    uri: string | null
    queue: Queue

    constructor(token: string | null, uri: string, baseUri?: string, options?: ServiceClientOptions) {
        super(new BaseCredentialProvider(), baseUri, options)
        this.token = token
        this.uri = uri
        this.queue = new Queue(1, Infinity)
    }

    sendRequest(options: RequestPrepareOptions | WebResource): Promise<HttpOperationResponse> {
        console.log(this.requestContentType)
        /** We must run one request at a time in order to ensure tokens are valid */
        return this.queue.add( () => {
            if (options instanceof WebResource) {
                options.headers.set('X-RUNDECK-TOKEN-URI', this.uri!)
                options.headers.set('X-RUNDECK-TOKEN-KEY', this.token!)
                const accept = options.headers.get('Accept')
                if (!accept) {
                    options.headers.set('Accept', 'application/json; charset=utf-8')
                    options.headers.set('Content-Type', 'application/json; charset=utf-8')
                }
            }

            const respProm = super.sendRequest(options)

            return new Promise((res, rej) => {
                respProm.then( resp => {
                    this.token = resp.headers.get('X-RUNDECK-TOKEN-KEY') || null
                    this.uri = resp.headers.get('X-RUNDECK-TOKEN-URI') || null
                    console.log(this.token)
                    res(resp)
                }).catch( (e) => {
                    rej(e)
                })
            })
        })
    }
}