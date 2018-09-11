import { ServiceClientCredentials, WebResource } from 'ms-rest-js'

import Axios from 'axios'

export class PasswordCredentialProvider implements ServiceClientCredentials {
    constructor(readonly baseUri: string, readonly username: string, readonly password: string) {}

    async signRequest(webResource: WebResource) {
        const {username, password} = this
        const resp = await Axios.post(`${this.baseUri}/j_security_check?j_username=${username}&j_password=${password}`, null, {
            maxRedirects: 0,
            validateStatus: c => c >= 300 && c < 400
        })
        webResource.headers.set('cookie', resp.headers['set-cookie'])
        webResource.headers.set('accept', 'application/json')
        return webResource
    }
}