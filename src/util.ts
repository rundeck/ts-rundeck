import { isArray } from "util"

type CookieSet = string|string[]|undefined
/** Combines two sets of cookies in either string or array form */
export function combineCookies(...cookieSets: CookieSet[]): Array<string> {
    let combinedCookies = [] as string[]

    for (const set of cookieSets) {
        combinedCookies = combinedCookies.concat(normCookieSet(set))
    }

    return combinedCookies
}

/** Converts undefined, string, or array of cookies to a cookie array */
export function normCookieSet(set: CookieSet): Array<string> {
    if (isArray(set))
        return set
    if (set)
        return set.split(';')
    else
        return []
}
