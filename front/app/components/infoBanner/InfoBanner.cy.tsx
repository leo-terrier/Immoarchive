import { AppContext, ContextValueType } from '@/app/context/Context'
import { ThemeProvider } from '@mui/material'
import theme from '@/app/context/theme/Theme'
import { mockContext } from '@/cypress/mockContext'
import { InfoBanner } from './InfoBanner'

const getRandomCoordinatesInCenterFrance = () => {
    const latBounds = [43.62164, 49.08959]
    const lngBounds = [-0.2774, 5.12787]
    const lat = Math.random() * (latBounds[1] - latBounds[0] + 1) + latBounds[0]
    const lng = Math.random() * (lngBounds[1] - lngBounds[0] + 1) + lngBounds[0]
    return { lat, lng }
}

const context: ContextValueType = {
    ...mockContext,
    mapParams: {
        center: getRandomCoordinatesInCenterFrance(),
        zoom: 0
    }
}

describe('<InfoBanner/>', () => {
    it(`Mounts and displays 'no results' when length = 0 and town name and postal code for random location`, () => {
        cy.mount(
            <AppContext.Provider
                value={{
                    ...context,
                    isClustered: false,
                    isLoading: false,
                    length: 0
                }}
            >
                <ThemeProvider theme={theme}>
                    <InfoBanner />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.contains('Aucun résultat')
        cy.wait(4000)
        cy.get('[data-cy=centerLocationName')
            .invoke('text')
            .then((text) => {
                const decodedValue = decodeURIComponent(text)
                // look for zipcode and town name
                const pattern = /^[A-Za-zÀ-ú -]+\d{5}$|^\d{5}[A-Za-zÀ-ú -]+$/
                expect(pattern.test(decodedValue)).to.be.true
            })
    })
    it(`Displays 'too many results' when length = 1500 (graph limit)`, () => {
        cy.mount(
            <AppContext.Provider
                value={{ ...context, isClustered: true, length: 1500 }}
            >
                <ThemeProvider theme={theme}>
                    <InfoBanner />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.contains('Trop de résultat')
    })
    it(`Displays 'too many results for the map' when isClustered = true and 0 < length < 1500`, () => {
        cy.mount(
            <AppContext.Provider
                value={{ ...context, isClustered: true, length: 1499 }}
            >
                <ThemeProvider theme={theme}>
                    <InfoBanner />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.contains('carte')
    })
    it(`Displays number of transaction when the map is not clustered and 0 < length < 1500`, () => {
        cy.mount(
            <AppContext.Provider
                value={{ ...context, length: 1499, isClustered: false }}
            >
                <ThemeProvider theme={theme}>
                    <InfoBanner />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.contains('Nombre de transactions: ')
    })
})
