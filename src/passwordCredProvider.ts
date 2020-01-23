import {WebResource} from '@azure/ms-rest-js'

import {BaseCredentialProvider} from './baseCredProvider'

import Axios, { AxiosResponse } from 'axios'

export class PasswordCredentialProvider extends BaseCredentialProvider {
    loginRequest?: Promise<AxiosResponse<any>>

    constructor(readonly baseUri: string, readonly username: string, readonly password: string) {
        super()
    }

    async signRequest(webResource: WebResource) {
        await super.signRequest(webResource)
        
        if (! this.loginRequest)
            this.loginRequest = this.login()

        const resp = await this.loginRequest

        webResource.headers.set('cookie', resp.headers['set-cookie'].join(';'))
        return webResource
    }

    async login() {
        const {username, password} = this
        return await Axios.post(`${this.baseUri}/j_security_check`, null, {
            params: {
                'j_username': username,
                'j_password': password,
            },
            maxRedirects: 0,
            validateStatus: c => c >= 300 && c < 400
        })
    }
}