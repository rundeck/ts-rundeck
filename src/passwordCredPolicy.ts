import Axios, { AxiosResponse } from 'axios'
import {WebResource, HttpOperationResponse, RequestPolicyFactory, BaseRequestPolicy, RequestPolicy, RequestPolicyOptions} from '@azure/ms-rest-js'


import {combineCookies} from './util'

export function passwordAuthPolicy(baseUri: string, username: string, password: string): RequestPolicyFactory {
    const context = {baseUri, username, password}

    return {
        create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
            return new PasswordAuthPolicy(nextPolicy, options, context)
        }
    }
}

interface IContext {
    loginRequest?: Promise<AxiosResponse<any>>
    username: string
    password: string
    baseUri: string
}

export class PasswordAuthPolicy extends BaseRequestPolicy {
    constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, readonly context: IContext) {
        super(nextPolicy, options)
    }

    async sendRequest(webResource: WebResource) {
        const {context} = this

        const webResCookies = webResource.headers.get('cookie')

        if (! context.loginRequest)
            context.loginRequest = this.login({cookie: combineCookies(webResCookies, []).join(';')})

        try {
            const loginResp = await context.loginRequest
            const loginCookies = loginResp.headers['set-cookie']
            const cookieHeader = combineCookies(webResCookies, loginCookies).join(';')
            webResource.headers.set('cookie', cookieHeader)
            const resp = await this._nextPolicy.sendRequest(webResource)
            this.handleResponse(resp)
            return resp
        } catch(e) {
            const ex = e as Error
            context.loginRequest = undefined
            throw ex
        }
    }

    async login(headers: any) {
        const {username, password, baseUri} = this.context
        return await Axios.post(`${baseUri}/j_security_check`, null, {
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
            this.context.loginRequest = undefined
    }
}