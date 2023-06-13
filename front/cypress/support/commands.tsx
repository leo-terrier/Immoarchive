/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { mount } from 'cypress/react18'

Cypress.Commands.add('mount', (component, options) => {
    return mount(component, options)
})

Cypress.Commands.add('checkUiElements', () => {
    //marker
    cy.get(
        '[data-cy="mapCard"] div[role="button"][style*="width: 14px; height: 14px"]'
    )
        .eq(1)
        .click('center', { force: true })
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
