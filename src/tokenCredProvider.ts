import { ServiceClientCredentials, WebResource } from 'ms-rest-js'

export class TokenCredentialProvider implements ServiceClientCredentials {
    constructor(readonly token: string) {}

    signRequest(webResource: WebResource) {
        webResource.headers.set('X-Rundeck-Auth-Token', this.token)
        // webResource.headers.set('accept', 'application/json')
        return Promise.resolve(webResource)
    }
}