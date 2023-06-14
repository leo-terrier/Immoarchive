import { AppContext, ContextValueType } from '@/app/context/Context'
import { ThemeProvider } from '@mui/material'

import { SearchFilterForm } from './SearchFilterForm'
import theme from '@/app/context/theme/Theme'
import { mockContext } from '@/cypress/mockContext'

const context: ContextValueType = {
    ...mockContext,
    handleChangeFilters: () => {}
}

type StrObj = {
    [key: string]: string
}
const maxValues: StrObj = {
    minPricePerMeterSquare: '20000',
    maxPricePerMeterSquare: '20000',
    minSurface: '2000',
    maxSurface: '2000',
    minSurfaceLand: '20000',
    maxSurfaceLand: '20000',
    minNbOfRooms: '20',
    maxNbOfRooms: '20'
}
const emptyObj: StrObj = {
    minPricePerMeterSquare: '',
    maxPricePerMeterSquare: '',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    minSurfaceLand: '',
    maxSurfaceLand: '',
    minNbOfRooms: '',
    maxNbOfRooms: '',
    minYear: '',
    maxYear: ''
}

const maxValuesKeys = Object.keys(maxValues)

let rand = 0
const randomize = (nb = 8) => {
    rand = Math.floor(Math.random() * nb)
}

describe('<SearchFilterForm/>', () => {
    beforeEach(() => {
        cy.spy(context, 'handleChangeFilters').as('handleChangeFilters')
        cy.mount(
            <AppContext.Provider value={context}>
                <ThemeProvider theme={theme}>
                    <SearchFilterForm />
                </ThemeProvider>
            </AppContext.Provider>
        )
    })
    it('Mounts with default price per meter selected', () => {
        cy.get('#minPrice').should('not.exist')
        cy.get('#minPricePerMeterSquare')
    })
    it('Applies input validation on user input', () => {
        cy.get('#minNbOfRooms').type('-.K').should('have.value', '')

        randomize()
        cy.get('input').eq(rand).type('19203')
        cy.get('input').eq(rand).should('have.value', '19203')
        cy.get('input').eq(rand).clear()

        randomize()
        cy.get('input').eq(rand).type('-')
        cy.get('input').eq(rand).should('have.value', '')
    })
    it('Submits the form when input values are all compliant (all values = maxValue allowed)', () => {
        maxValuesKeys.forEach((key) => {
            cy.get('#' + key).type(maxValues[key])
        })
        cy.get('[data-cy=submit]').click()
        cy.get('@handleChangeFilters').should('be.calledWith', {
            ...maxValues,
            minYear: '',
            maxYear: '',
            minPrice: '',
            maxPrice: ''
        })
    })

    it('Applies validation on submit (no submit if above min values) ', () => {
        randomize(4)
        const minField = maxValuesKeys.filter((key) => key.includes('min'))[
            rand
        ]
        cy.get('#' + minField).type(
            (parseInt(maxValues[minField], 10) + 1).toString()
        )
        cy.get('[data-cy=submit]').click()
        cy.get('@handleChangeFilters').should('not.be.called')
    })

    it(`Replaces min value with 0 and submit minValue = '' if submitting with min > max `, () => {
        randomize(4)
        const min = '6'
        const max = '5'
        const minField = maxValuesKeys.filter((key) => key.includes('min'))[
            rand
        ]
        const maxField = minField.replace('min', 'max')
        cy.get('#' + minField).type(min)
        cy.get('#' + maxField).type(max)
        cy.get('[data-cy=submit]').click()
        cy.get('@handleChangeFilters').should('have.been.calledWith', {
            ...emptyObj,
            [maxField]: max
        })

        cy.get('#' + minField).should('have.value', '0')
        cy.get('#' + maxField).should('have.value', max)
    })

    it(`It submits with minPrice = '' after user inputs value in minPrice but then selects pricePerMeterSquare`, () => {
        const value = '10000'
        cy.get('select').select('total').invoke('val').should('eq', 'total')
        cy.get('#minPrice').type(value)
        cy.get('select').select('m²').invoke('val').should('eq', 'm²')
        cy.get('#minPricePerMeterSquare').type(value)
        cy.get('[data-cy=submit]').click()
        cy.get('@handleChangeFilters').should('have.been.calledWith', {
            ...emptyObj,
            minPricePerMeterSquare: value
        })
    })
})

/* Logging arg object

should('have.been.calledWidth, Cypress.sinon.match.object)
 .its('firstCall.args.0')
            .then((obj) => {
                Object.entries(obj).forEach(([key, value]) => {
                    cy.log(key, value)
                })
            })   */

//https://glebbahmutov.com/cypress-examples/recipes/called-with-object.html#exact-object
