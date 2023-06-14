// in order to use the theme in styled components
declare module '@emotion/react' {
    export interface Theme {
        palette: {
            [key: string]: string
        }
    }
}
