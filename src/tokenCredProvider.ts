import {WebResourceLike} from '@azure/ms-rest-js'

import {BaseCredentialProvider} from './baseCredProvider'

export class TokenCredentialProvider extends BaseCredentialProvider {
    constructor(readonly token: string) {
        super()
    }

    async signRequest(webResource: WebResourceLike) {
        await super.signRequest(webResource)
        webResource.headers.set('X-Rundeck-Auth-Token', this.token)
        return webResource
    }
}
