// TODO => export types from theme
declare module '@emotion/react' {
    export interface Theme {
        palette: {
            [key: string]: string
        }
    }
}
