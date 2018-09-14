import {WebResource} from 'ms-rest-js'

import {BaseCredentialProvider} from './baseCredProvider'

export class TokenCredentialProvider extends BaseCredentialProvider {
    constructor(readonly token: string) {
        super()
    }

    async signRequest(webResource: WebResource) {
        await super.signRequest(webResource)
        webResource.headers.set('X-Rundeck-Auth-Token', this.token)
        return webResource
    }
}
