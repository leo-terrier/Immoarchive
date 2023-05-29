import { AppContextProvider } from '@/app/context/Context'
import { AddressForm } from './AddressForm'

describe('<AddressForm>', () => {
    it('Mounts', () => {
        cy.mount(<AddressForm />)
    })
    it('Mounts with map api', () => {
        cy.mountWithWrapper(<AddressForm />, AppContextProvider)
    })
    it('Outputs user input on typing', () => {
        cy.mount(<AddressForm />)
        const typedText = 'Champs Ellysées'
        cy.get('input').type(typedText)
        cy.get('input').should('have.value', typedText)
    })
    it('Renders suggestions', () => {
        cy.mountWithWrapper(<AddressForm />, AppContextProvider)
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy="suggestions"]')
            .find('[data-cy="suggestion"]')
            .should('have.length.above', 1)
    })
    it('Applies selected suggestion', () => {
        //const addGeoCenterStub = cy.spy().as('addGeoCenter')
        cy.mountWithWrapper(
            <AddressForm /* addGeoCenter={addGeoCenterStub} */ />,
            AppContextProvider
        )
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy="suggestion"]')
            .first()
            .invoke('text')
            .then((suggestionText) => {
                cy.get('[data-cy="suggestion"]').first().click()
                cy.get('input').should('have.value', suggestionText)

                /*  cy.get('@addGeoCenter').should('be.calledWith', {
                    lat: Cypress.sinon.match.number,
                    lng: Cypress.sinon.match.number
                }) */
            })
    })
    it('Clears suggestions on close button click', () => {
        cy.mountWithWrapper(<AddressForm />, AppContextProvider)
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy="suggestion"]')
        cy.get('[data-cy=close]').click()
        cy.get('[data-cy="suggestion"]').should('not.exist')
    })
    it('Clears input on close button click', () => {
        cy.mountWithWrapper(<AddressForm />, AppContextProvider)
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy=close]').click()
        cy.get('input').should('have.value', '')
    })
})
