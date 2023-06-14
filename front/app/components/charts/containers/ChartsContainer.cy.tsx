import { AppContext } from '@/app/context/Context'
import { ThemeProvider } from '@mui/material'

import theme from '@/app/context/theme/Theme'
import { mockContext } from '@/cypress/mockContext'
import { ChartsContainer } from './ChartsContainer'
import data from '@/cypress/fixtures/dataLengthFixture.json'
import { GraphDataType } from '@/app/types'

describe('<ChartsContainer/>', () => {
    it(`Mounts with carroussel when 0 < length < 1500 (graph limit)`, () => {
        cy.mount(
            <AppContext.Provider
                value={{
                    ...mockContext,
                    length: 1499,
                    graphData: data.graphData as GraphDataType
                }}
            >
                <ThemeProvider theme={theme}>
                    <ChartsContainer />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.get('[data-cy=nextNavCarroussel]')
    })
    it(`Mounts without carroussel and with placeholder when length = 0 `, () => {
        cy.mount(
            <AppContext.Provider
                value={{
                    ...mockContext,
                    length: 0,
                    graphData: data.graphData as GraphDataType
                }}
            >
                <ThemeProvider theme={theme}>
                    <ChartsContainer />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.get('[data-cy=nextNavCarroussel]').should('not.exist')
        cy.contains('Pas de transactions')
    })
    it(`Mounts with carroussel and placeholder instead of scatter chart when map is clustered`, () => {
        cy.mount(
            <AppContext.Provider
                value={{
                    ...mockContext,
                    length: 1,
                    isClustered: true,
                    graphData: data.graphData as GraphDataType
                }}
            >
                <ThemeProvider theme={theme}>
                    <ChartsContainer />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.get('[data-cy=nextNavCarroussel]').click().click().click().click()
        cy.contains('Trop de transactions')
    })
})
