/// <reference types="cypress" />
import { mount } from 'cypress/react18'
import { getRandItem } from '../../utils/utilityFunctions'

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount
        }
        interface Chainable<Subject = any> {
            checkUiElements(): Chainable<Subject>
        }
    }
}

Cypress.Commands.add('checkUiElements', () => {
    const markerSelector =
        '[data-cy="mapCard"] div[role="button"][style*="width: 14px; height: 14px"]'
    cy.get(markerSelector).then((list) => {
        cy.get(markerSelector)
            .eq(getRandItem(list.length))
            .click('center', { force: true })
    })
    cy.get('[data-cy=mapTooltip]')

    cy.contains('Répartition du prix au mètre carré')
    cy.get('.recharts-bar-rectangle')

    cy.get('[data-cy=nextNavCarroussel]').click()
    cy.get('.recharts-bar-rectangle')

    cy.get('[data-cy=nextNavCarroussel]').click()
    cy.get('.recharts-bar-rectangle')

    cy.get('[data-cy=nextNavCarroussel]').click()
    cy.get('.recharts-bar-rectangle')

    cy.get('[data-cy=nextNavCarroussel]').click()
    cy.get('.recharts-scatter-symbol')
    cy.get('.recharts-reference-line-line')

    cy.get('[data-cy=nextNavCarroussel]').click()
    cy.get('.recharts-line')
})

Cypress.Commands.add('mount', (component, options) => {
    return mount(component, options)
})
