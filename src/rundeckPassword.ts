import { BaseCredentialProvider } from "./baseCredProvider"
import { Rundeck } from "."
import { RundeckOptions } from "./lib/models"
import { passwordAuthPolicy } from "./passwordCredPolicy"
import { isArray } from "util"

/**
 * Create Rundeck client configured for password authentication
 */
export function rundeckPasswordAuth(username: string, password: string, opts: RundeckOptions): Rundeck {
    if (!opts.baseUri)
        throw new Error('Must supplie opts.baseUri')

    const passwordPolicy = passwordAuthPolicy(opts.baseUri, username, password)

    let policies = [passwordPolicy]

    if (isArray(opts.requestPolicyFactories))
        policies = [...opts.requestPolicyFactories, ...policies]

    opts.requestPolicyFactories = (def) => {
        return [...policies, ...def]
    }

    return new Rundeck(
        new BaseCredentialProvider(),
        opts
    )
}