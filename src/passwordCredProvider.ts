import Axios, { AxiosResponse } from 'axios'
import {WebResource, RequestPrepareOptions, HttpOperationResponse} from '@azure/ms-rest-js'

import {BaseCredentialProvider} from './baseCredProvider'
import {combineCookies} from './util'

export class PasswordCredentialProvider extends BaseCredentialProvider {
    loginRequest?: Promise<AxiosResponse<any>>

    constructor(readonly baseUri: string, readonly username: string, readonly password: string) {
        super()
    }

    async signRequest(webResource: WebResource) {
        await super.signRequest(webResource)

        const webResCookies = webResource.headers.get('cookie')

        if (! this.loginRequest)
            this.loginRequest = this.login({cookie: combineCookies(webResCookies, []).join(';')})

        try {
            const resp = await this.loginRequest
            const loginCookies = resp.headers['set-cookie']
            const cookieHeader = combineCookies(webResCookies, loginCookies).join(';')
            webResource.headers.set('cookie', cookieHeader)
            return webResource
        } catch(e) {
            const ex = e as Error
            this.loginRequest = undefined
            throw ex
        }
    }

    async login(headers: any) {
        const {username, password} = this
        return await Axios.post(`${this.baseUri}/j_security_check`, null, {
            params: {
                'j_username': username,
                'j_password': password,
            },
            headers,
            maxRedirects: 0,
            validateStatus: c => c >= 300 && c < 400
        })
    }

    handleResponse(response?: HttpOperationResponse) {
        if (! response || response.status == 403)
            this.loginRequest = undefined
    }
}