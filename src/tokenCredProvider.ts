import {WebResource} from '@azure/ms-rest-js'

import {BaseCredentialProvider} from './baseCredProvider'

export class TokenCredentialProvider extends BaseCredentialProvider {
    constructor(readonly token: string) {
        super()
    }

    async signRequest(webResource: WebResource) {
        await super.signRequest(webResource)
        webResource.headers.set('X-Rundeck-Auth-Token', this.token)
        webResource.headers.set('Accept', 'application/json; charset=utf-8')
        return webResource
    }
}
