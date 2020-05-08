import { Rundeck } from "./lib/rundeck"
import { RequestPrepareOptions, HttpOperationResponse } from "@azure/ms-rest-js"


export class RundeckClient extends Rundeck {
    apiRequest(options: RequestPrepareOptions): Promise<HttpOperationResponse> {
        options.baseUrl = this.baseUri
        return super.sendRequest(options)
    }
}