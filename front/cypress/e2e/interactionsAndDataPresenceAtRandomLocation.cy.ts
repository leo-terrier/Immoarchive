import * as data from '../fixtures/randomTown.json'

const getRandItem = (length: number) => {
    return Math.floor(Math.random() * length)
}

describe('Testing data presence and interaction at different locations', () => {
    it('Shows data at a random town location: after inputing random location, it displays markers, mapTooltip on marker click, charts (4 histograms, one scatter chart, one line chart), and dealTable', () => {
        cy.visit('/')
        cy.get('#addressFormInput').type(
            data.towns[Math.floor(Math.random() * data.towns.length)]
        )
        cy.get('[data-cy="suggestion"]').first().click()
        cy.checkUiElements()
    })
    it('Allows displaying mapTooltip from scatter chart and from deal table', () => {
        cy.visit('/')
        cy.get('#addressFormInput').type(
            data.towns[Math.floor(Math.random() * data.towns.length)]
        )
        cy.get('[data-cy=nextNavCarroussel]').click()
        cy.get('[data-cy=nextNavCarroussel]').click()
        cy.get('[data-cy=nextNavCarroussel]').click()
        cy.get('[data-cy=nextNavCarroussel]').click()
        cy.get('.recharts-scatter-symbol').then((list) => {
            cy.get('.recharts-scatter-symbol')
                .eq(getRandItem(list.length))
                .click()
        })
        cy.get('[data-cy=seeOnMapButton]').click()
        cy.wait(2000)
        cy.window().then((window) => {
            expect(window.scrollY).eq(0)
        })
        cy.get('[data-cy=mapTooltip]').click()
        cy.get('[data-cy=dealTableRow').then((list) => {
            cy.get('[data-cy=dealTableRow').eq(getRandItem(list.length)).click()
        })
        cy.wait(2000)
        cy.window().then((window) => {
            expect(window.scrollY).eq(0)
        })
        cy.get('[data-cy=mapTooltip]').click()
    })
})
