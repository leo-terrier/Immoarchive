import { AppContext } from '@/app/context/Context'
import { ThemeProvider } from '@mui/material'

import theme from '@/app/context/theme/Theme'
import { mockContext } from '@/cypress/mockContext'
import data from '@/cypress/fixtures/dataLengthFixture.json'

import { ListedDealType } from '@/app/types'
import { DealTable } from './DealTable'

describe('<DealTable/>', () => {
    it(`Mounts with lines when map is not clustered`, () => {
        cy.mount(
            <AppContext.Provider
                value={{
                    ...mockContext,
                    length: 1,
                    isClustered: false,
                    listedDeals: data.listedDeals as ListedDealType[]
                }}
            >
                <ThemeProvider theme={theme}>
                    <DealTable />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.get('[data-cy=dealTableRow]')
    })
    it(`Mounts with placeholder 'no transaction' and no lines when length = 0`, () => {
        cy.mount(
            <AppContext.Provider
                value={{
                    ...mockContext,
                    length: 0,
                    listedDeals: data.listedDeals as ListedDealType[]
                }}
            >
                <ThemeProvider theme={theme}>
                    <DealTable />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.get('[data-cy=dealTableRow]').should('not.exist')
        cy.contains('Aucune transaction')
    })
    it(`Mounts with placeholder 'trop de transactions' and no lines when isClustered = true`, () => {
        cy.mount(
            <AppContext.Provider
                value={{
                    ...mockContext,
                    isClustered: true,
                    listedDeals: data.listedDeals as ListedDealType[]
                }}
            >
                <ThemeProvider theme={theme}>
                    <DealTable />
                </ThemeProvider>
            </AppContext.Provider>
        )
        cy.get('[data-cy=dealTableRow]').should('not.exist')
        cy.contains('Trop de transaction')
    })
})
