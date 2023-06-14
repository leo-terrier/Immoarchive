type StrObj = {
    [key: string]: string
}

describe('Query params are working at initiation stage and on update', () => {
    it('Updates filterBanner on filter change', () => {
        cy.visit('/')
        const values: StrObj = {
            minPricePerMeterSquare: '1000',
            maxPricePerMeterSquare: '',
            minSurface: '100',
            maxSurface: '',
            minSurfaceLand: '10',
            maxSurfaceLand: '',
            minNbOfRooms: '2',
            maxNbOfRooms: ''
        }
        cy.get('[data-cy=searchFilterButtonLg]').click()
        Object.entries(values).forEach(([key, value]) => {
            if (value) cy.get('#' + key).type(value)
            else cy.get('#' + key).clear()
        })
        cy.get('[data-cy=submit]').click()
        cy.contains('Pièces > 2')
        cy.contains('Prix (€) / m² > 1 000')
        cy.contains('Surface (m²) > 100')
        cy.contains('Terrain (m²) > 10')

        /*Failing in cypress (see below) :
        Object.entries(values).forEach(([key, value]) => {
            cy.url().should('include', `${key}=${value}`)
            cy.get('#clipboardInput').should('include', `${key}=${value}`) */
    })
    it('Clears filters and filter banner on clicking restore button', () => {
        cy.visit('/')
        const values: StrObj = {
            minPricePerMeterSquare: '1000',
            maxPricePerMeterSquare: '',
            minSurface: '100',
            maxSurface: '',
            minSurfaceLand: '10',
            maxSurfaceLand: '',
            minNbOfRooms: '2',
            maxNbOfRooms: ''
        }
        cy.get('[data-cy=searchFilterButtonLg]').click()
        Object.entries(values).forEach(([key, value]) => {
            if (value) cy.get('#' + key).type(value)
            else cy.get('#' + key).clear()
        })
        cy.get('[data-cy=submit]').click()
        cy.get('[data-cy=restore]').click()
        cy.get('[data-cy=searchFilterButtonLg]').click()

        Object.keys(values).forEach((key) => {
            cy.get('#' + key).should('have.value', '')
            /* Failing in cypress (see below) :
            cy.url().should('have.value', 'http://localhost:3000'}`)
            cy.get('#clipboardInput').should('have.value', 'http://localhost:3000'}`) */
        })
        cy.get('[data-cy=filterBannerBox]').should('not.exist')
    })
    it('When page loads with url query params, url query params should be reflected in the current filterBanner, on the map, in the filterForm, and in the clipboardButton.', () => {
        const urlQueries =
            '/?lats=49.44201&latn=49.44445&lngw=1.10018&lnge=1.10769&isMobile=false&lat=49.44323&lng=1.10394&zoom=18&minNbOfRooms=2&minPricePerMeterSquare=1000&minSurface=100&minSurfaceLand=10&minYear=2019'
        const values: StrObj = {
            minPricePerMeterSquare: '1000',
            maxPricePerMeterSquare: '',
            minSurface: '100',
            maxSurface: '',
            minSurfaceLand: '10',
            maxSurfaceLand: '',
            minNbOfRooms: '2',
            maxNbOfRooms: ''
        }
        cy.visit(urlQueries)
        cy.get('[data-cy=filterBannerBox]')
        cy.contains('Pièces > 2')
        cy.contains('Prix (€) / m² > 1 000')
        cy.contains('Surface (m²) > 100')
        cy.contains('Terrain (m²) > 10')
        cy.contains('Après le 01/01/2019')
        cy.contains('76000 Rouen')
        cy.get('[data-cy=searchFilterButtonLg]').click()
        Object.entries(values).forEach(([key, value]) => {
            cy.get('#' + key).should('have.value', value)
        })
        cy.get('#clipboardInput').should(
            'have.value',
            'http://localhost:3000' + urlQueries
        )
    })
})

// Failing in cypress : URLSearchParams methods do not work
