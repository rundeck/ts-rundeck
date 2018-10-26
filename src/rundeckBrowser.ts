import {WebResource, HttpOperationResponse, RequestPrepareOptions, ServiceClientOptions, RestError} from 'ms-rest-js'

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
        let reqAction = () => {
            if (options instanceof WebResource) {
                options.headers.set('X-RUNDECK-AJAX', 'true')
                options.headers.set('X-RUNDECK-TOKEN-URI', this.uri!)
                options.headers.set('X-RUNDECK-TOKEN-KEY', this.token!)
                const accept = options.headers.get('Accept')
                if (!accept) {
                    options.headers.set('Accept', 'application/json; charset=utf-8')
                }
            }

            const respProm = super.sendRequest(options)

            return new Promise<HttpOperationResponse>((res, rej) => {
                respProm.then( resp => {
                    this.updateTokensFromResponse(resp)
                    res(resp)
                }).catch( (e) => {
                    const ex = e as RestError
                    if (ex.response)
                        this.updateTokensFromResponse(ex.response)

                    rej(e)
                })
            })
        }

        if (options.method == 'GET')
            return reqAction()
        else
            return this.queue.add(reqAction)
    }

    private updateTokensFromResponse(resp: HttpOperationResponse) {
        this.token = resp.headers.get('X-RUNDECK-TOKEN-KEY') || this.token
        this.uri = resp.headers.get('X-RUNDECK-TOKEN-URI') || this.token
    }
}