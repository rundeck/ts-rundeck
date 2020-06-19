import { RundeckOptions } from "./lib/models"
import { RundeckClient } from "./RundeckClient"
import { TokenCredentialProvider } from "./tokenCredProvider"

/**
 * Create Rundeck client configured for password authentication
 */
export function rundeckTokenAuth(token: string, opts: RundeckOptions): RundeckClient {
    if (!opts.baseUri)
        throw new Error('Must supplie opts.baseUri')

    return new RundeckClient(new TokenCredentialProvider(token), opts)
}