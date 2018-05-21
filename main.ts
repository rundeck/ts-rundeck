import {Rundeck} from './lib/rundeck'
import { ServiceClientCredentials, WebResource } from 'ms-rest-js'

import Axios from 'axios'

const TOKEN='QH35qTPQzGRGFzH55KxaDJotzPe2URxt'
const BASE_URI = 'http://localhost:8080'
const BASE_API_URI = `${BASE_URI}/api/21`

async function main() {
    const credProvider = new PasswordCredentialProvider(BASE_URI, 'admin', 'password')
    const client = new Rundeck(credProvider, BASE_API_URI)

    console.log(await client.listUsers())
}


class TokenCredentialProvider implements ServiceClientCredentials {
    constructor(readonly token: string) {}

    signRequest(webResource: WebResource) {
        webResource.headers['X-Rundeck-Auth-Token'] = this.token
        webResource.headers['accept'] = 'application/json'
        return Promise.resolve(webResource)
    }
}

class PasswordCredentialProvider implements ServiceClientCredentials {
    constructor(readonly baseUri: string, readonly username: string, readonly password: string) {}

    async signRequest(webResource: WebResource) {
        const {username, password} = this
        const resp = await Axios.get(`${this.baseUri}/j_security_check?j_username=${username}&j_password=${password}`,{
            maxRedirects: 0,
            validateStatus: c => c >= 300 && c < 400
        })
        console.log(resp.headers)
        webResource.headers['cookie'] = resp.headers['set-cookie'][0]
        webResource.headers['accept'] = 'application/json'
        console.log(webResource.headers)
        return webResource
    }
}

main()