import { mount } from 'cypress/react'

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
