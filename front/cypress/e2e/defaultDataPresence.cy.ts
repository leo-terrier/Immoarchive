describe('Default location data is present', () => {
    it('App mounts with data from default location : it displays markers, mapTooltip on marker click, charts (4 histograms, one scatter chart, one line chart), dealTable, and clipBoard button', () => {
        cy.visit('/')
        cy.checkUiElements()
        cy.get('#clipboardInput').should('have.value', 'http://localhost:3000/')
    })
})
