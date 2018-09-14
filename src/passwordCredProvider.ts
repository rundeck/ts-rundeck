import {WebResource} from 'ms-rest-js'

import {BaseCredentialProvider} from './baseCredProvider'

import Axios from 'axios'

export class PasswordCredentialProvider extends BaseCredentialProvider {
    constructor(readonly baseUri: string, readonly username: string, readonly password: string) {
        super()
    }

    async signRequest(webResource: WebResource) {
        await super.signRequest(webResource)
        const {username, password} = this
        const resp = await Axios.post(`${this.baseUri}/j_security_check?j_username=${username}&j_password=${password}`, null, {
            maxRedirects: 0,
            validateStatus: c => c >= 300 && c < 400
        })
        webResource.headers.set('cookie', resp.headers['set-cookie'])
        return webResource
    }
}