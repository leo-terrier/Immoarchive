import * as data from '../fixtures/randomTown.json'

describe('Testing data presence and interaction at different locations', () => {
    it('Shows data at a random location: after inputing random location, it displays markers, mapTooltip on marker click, charts (4 histograms, one scatter chart, one line chart), and dealTable', () => {
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
        cy.get('.recharts-scatter-symbol').first().click()
        cy.get('[data-cy=seeOnMapButton]').click()
        cy.wait(2000)
        cy.window().then((window) => {
            expect(window.scrollY).eq(0)
        })
        cy.get('[data-cy=mapTooltip]').click()
        cy.get('[data-cy=dealTableRow').first().click()
        cy.wait(2000)
        cy.window().then((window) => {
            expect(window.scrollY).eq(0)
        })
        cy.get('[data-cy=mapTooltip]').click()
    })
})
