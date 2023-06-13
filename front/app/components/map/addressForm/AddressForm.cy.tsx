import { AddressForm } from './AddressForm'
import { AppContextProvider } from '@/app/context/Context'

const props = {
    setMapCenter: () => {},
    changeZoom: () => {}
}

describe('<AddressForm>', () => {
    it('Mounts', () => {
        cy.mount(<AddressForm {...props} />)
    })
    it('Mounts with map api', () => {
        cy.mount(
            <AppContextProvider>
                <AddressForm {...props} />
            </AppContextProvider>
        )
    })
    it('Outputs user input on typing', () => {
        cy.mount(
            <AppContextProvider>
                <AddressForm {...props} />
            </AppContextProvider>
        )
        const typedText = 'Champs Ellysées'
        cy.get('input').type(typedText)
        cy.get('input').should('have.value', typedText)
    })
    it('Renders suggestions', () => {
        cy.mount(
            <AppContextProvider>
                <AddressForm {...props} />
            </AppContextProvider>
        )
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy="suggestions"]')
            .find('[data-cy="suggestion"]')
            .should('have.length.above', 1)
    })
    it('Applies selected suggestion to text input and calls zoom and center function', () => {
        const setMapCenter = cy.spy().as('setMapCenter')
        const changeZoom = cy.spy().as('changeZoom')
        cy.mount(
            <AppContextProvider>
                <AddressForm
                    setMapCenter={setMapCenter}
                    changeZoom={changeZoom}
                />
            </AppContextProvider>
        )
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy="suggestion"]')
            .first()
            .invoke('text')
            .then((suggestionText) => {
                cy.get('[data-cy="suggestion"]').first().click()
                cy.get('input').should('have.value', suggestionText)
            })
        cy.get('@changeZoom').should(
            'have.been.calledWith',
            Cypress.sinon.match.string
        )
        cy.get('@setMapCenter').should(
            'have.been.calledWith',
            Cypress.sinon.match({
                lat: Cypress.sinon.match.number,
                lng: Cypress.sinon.match.number
            })
        )
    })
    // Breakpoint Sm & up
    it('Clears suggestions on close button click - breakpointSm', () => {
        cy.viewport(605, 800)
        cy.mount(
            <AppContextProvider>
                <AddressForm {...props} />
            </AppContextProvider>
        )
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy="suggestion"]')
        cy.get('[data-cy=close]').click()
        cy.get('[data-cy="suggestion"]').should('not.exist')
    })
    it('Clears input on close button click', () => {
        cy.viewport(605, 800)
        cy.mount(
            <AppContextProvider>
                <AddressForm {...props} />
            </AppContextProvider>
        )
        const typedText = 'Champs Elysées'
        cy.get('input').type(typedText)
        cy.get('[data-cy=close]').click()
        cy.get('input').should('have.value', '')
    })

    //BreakPoint Xs & up
    it('Clears suggestions on erase', () => {
        cy.mount(
            <AppContextProvider>
                <AddressForm {...props} />
            </AppContextProvider>
        )
        const typedText = 'Champs Elysées'
        cy.get('input').as('addressInput').type(typedText)
        cy.get('[data-cy="suggestion"]')
        cy.get('@addressInput').clear()
        cy.get('[data-cy="suggestion"]').should('not.exist')
    })
})
