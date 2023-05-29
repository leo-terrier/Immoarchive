import { QueryParamsType, UrlQueryParamsType } from '@/app/types'

export function buildQueryString(params: QueryParamsType): string {
    const queryStrings = []

    for (const key in params) {
        const value = params[key as keyof QueryParamsType]
        if (value) {
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    queryStrings.push(
                        `${encodeURIComponent(key)}[]=${encodeURIComponent(
                            item
                        )}`
                    )
                })
            } else {
                queryStrings.push(
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                )
            }
        }
    }

    return queryStrings.join('&')
}

export function getUrlQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search)
    return Object.fromEntries(
        urlSearchParams.entries()
    ) as Partial<UrlQueryParamsType>
}

export function useSetUrlQueryParams() {
    return (params: Partial<UrlQueryParamsType>) => {
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

        const newUrl = `${
            window.location.pathname
        }?${urlSearchParams.toString()}`
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual'
        }
        window.history.replaceState(null, '', newUrl)
    }
}
