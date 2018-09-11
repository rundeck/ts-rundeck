import fs from 'fs'

import {Rundeck} from './lib/rundeck'
import { ServiceClientCredentials, WebResource } from 'ms-rest-js'

import Axios from 'axios'

const TOKEN='QH35qTPQzGRGFzH55KxaDJotzPe2URxt'
const BASE_URI = 'http://127.0.0.1:4440'
const BASE_API_URI = `${BASE_URI}`

async function main() {
    const credProvider = new PasswordCredentialProvider(BASE_URI, 'admin', 'admin')
    const tokenProvider = new TokenCredentialProvider(TOKEN)
    const client = new Rundeck(credProvider, BASE_API_URI, {withCredentials: true})

    const resp = await client.listUsers()
    console.log([...resp])

    const res = await client.importProjectArchive('New', fs.readFileSync('/home/greg/Downloads/Sleep-20180911-140313.rdproject.jar'))
    
}


class TokenCredentialProvider implements ServiceClientCredentials {
    constructor(readonly token: string) {}

    signRequest(webResource: WebResource) {
        webResource.headers.set('X-Rundeck-Auth-Token', this.token)
        // webResource.headers.set('accept', 'application/json')
        return Promise.resolve(webResource)
    }
}

class PasswordCredentialProvider implements ServiceClientCredentials {
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

main()