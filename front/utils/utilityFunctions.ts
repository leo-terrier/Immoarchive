import { QueryParamsType, UrlQueryParamsType } from '@/app/types'

export function buildQueryString(params: QueryParamsType) {
    const queryStrings = []
    for (const key in params) {
        const value = params[key as keyof QueryParamsType]
        if (value !== '') {
            queryStrings.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
        }
    }

    return queryStrings.join('&')
}

export function getUrlQueryParams() {
    if (typeof window !== 'undefined') {
        const urlQueryParams = Object.fromEntries(
            new URLSearchParams(window.location.search).entries()
        )
        return urlQueryParams as UrlQueryParamsType
    } else return {} as UrlQueryParamsType
}

export function setUrlQueryParams(params: UrlQueryParamsType) {
    const urlSearchParams = new URLSearchParams(window.location.search)
    Object.entries(params).forEach(([key, value]) => {
        if (value !== '') {
            if (urlSearchParams.has(key)) {
                urlSearchParams.set(key, String(value))
            } else {
                urlSearchParams.append(key, String(value))
            }
        } else {
            urlSearchParams.delete(key)
        }
    })

    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual'
    }
    window.history.replaceState(null, '', newUrl)
}

export const roundNumber = (number: number, decimals = 0) => {
    const factor = 10 ** decimals
    return Math.round(number * factor) / factor
}

export const stripArrondissement = (str: string): string => {
    if (str.includes('Arrondissement')) {
        //arr.splice(arr.length - 2, 2);
        return str.split(' ')[0]
    } else {
        return str
    }
}
