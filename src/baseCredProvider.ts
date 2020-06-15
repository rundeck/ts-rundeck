import { ServiceClientCredentials, WebResourceLike } from '@azure/ms-rest-js'

export class BaseCredentialProvider implements ServiceClientCredentials {
    signRequest(webResource: WebResourceLike) {
        webResource.headers.set('Accept', 'application/json; charset=utf-8')
        return Promise.resolve(webResource)
    }
}