import { ServiceClientCredentials, WebResource } from 'ms-rest-js'

export class BaseCredentialProvider implements ServiceClientCredentials {
    signRequest(webResource: WebResource) {
        return Promise.resolve(webResource)
    }
}