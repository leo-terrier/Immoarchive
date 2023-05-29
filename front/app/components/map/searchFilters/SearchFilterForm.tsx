import React, { useRef, useState } from 'react'
import { TextField, Slider, Typography, Button, Box } from '@mui/material'
import { useAppContext } from '@/app/context/Context'
import { FilterParamsType } from '@/app/types'
import {
    getUrlQueryParams,
    useSetUrlQueryParams
} from '@/utils/utilityFunctions'

const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.WheelEvent<HTMLInputElement>
) => {
    const { target } = e
    if ((target as HTMLInputElement).value.includes('-'))
        (target as HTMLInputElement).value = '0'
}
// Set the new value in the input field

const handleInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '-') {
        event.preventDefault()
    }
}

type InputProps = {
    label: string
    name: string
    defaultValue: string
}
const CustomNumberTextField = (props: InputProps) => {
    const { label, name, defaultValue } = props

    return (
        <TextField
            size="small"
            type="number"
            InputLabelProps={{
                sx: { fontSize: '.92rem', verticalAlign: 'center' }
            }}
            inputProps={{
                onInput: handleChange,
                onKeyDown: handleInput,
                id: name
            }}
            label={label}
            name={name}
            sx={{ backgroundColor: 'white' }}
            defaultValue={defaultValue}
        />
    )
}

type CustomBoxesType = {
    label: string
    minName: string
    maxName: string
    minDefaultValue: string
    maxDefaultValue: string
    togglePricePerMeter?: () => void
    isPricePerMeter?: boolean
}
const CustomMinMaxFieldBoxes = ({
    label,
    minName,
    maxName,
    minDefaultValue = '',
    maxDefaultValue = '',
    togglePricePerMeter = () => {},
    isPricePerMeter
}: CustomBoxesType) => {
    return (
        <Box
            width={{ xs: '110px', sm: '120px' }}
            display="flex"
            flexDirection="column"
            gap="8px"
        >
            <Typography
                variant="subtitle1"
                textAlign="center"
                sx={{
                    marginBottom: '-4px',
                    fontSize: '.92rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-evenly'
                }}
            >
                {label}
                {minName.includes('Price') ? (
                    <select
                        onChange={togglePricePerMeter}
                        value={isPricePerMeter ? 'm2' : 'total'}
                    >
                        <option value="m2">/ m2</option>
                        <option value="total">Total</option>
                    </select>
                ) : (
                    ''
                )}
            </Typography>
            <CustomNumberTextField
                label="Max"
                name={maxName}
                defaultValue={maxDefaultValue}
            />
            <CustomNumberTextField
                label="Min"
                name={minName}
                defaultValue={minDefaultValue}
            />
        </Box>
    )
}

export const SearchFilterForm = () => {
    const { handleChangeFilters, isLoading } = useAppContext()

    const {
        minYear,
        maxYear,
        minPrice,
        maxPrice,
        minPricePerMeterSquare,
        maxPricePerMeterSquare,
        minSurface,
        maxSurface,
        minSurfaceLand,
        maxSurfaceLand,
        minNbOfRooms,
        maxNbOfRooms
    } = getUrlQueryParams()

    const setUrlQueryParams = useSetUrlQueryParams()

    const minMaxYearRef = useRef<number[]>([
        minYear ? parseInt(minYear as string, 10) : 2017,
        maxYear ? parseInt(maxYear as string, 10) : 2022
    ])

    const [isPricePerMeter, setIsPricePerMeter] = useState<boolean>(
        minPrice === undefined && maxPrice === undefined
    )

    const togglePricePerMeter = () => {
        setIsPricePerMeter((prev) => !prev)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const data: { [key: string]: string } = {}

        //Running validation
        for (const [key, value] of formData.entries()) {
            const elt = document.getElementById(key) as HTMLInputElement
            if (key.includes('min')) {
                const maxElt = document.getElementById(
                    key.replace('min', 'max')
                ) as HTMLInputElement
                if (
                    maxElt.value &&
                    parseInt(maxElt.value, 10) <= parseInt(value as string, 10)
                ) {
                    elt.value = '0'
                }
            }
        }

        //Creating response object (and resetting undisplayed field)
        const formattedForm = new FormData(event.currentTarget)
        formattedForm.forEach(
            (value, key) => (data[key] = value !== '0' ? (value as string) : '')
        )
        const [minYear, maxYear] = minMaxYearRef.current
        const queriesToAdd = {
            ...data,
            ...(isPricePerMeter
                ? { minPrice: '', maxPrice: '' }
                : { minPricePerMeterSquare: '', maxPricePerMeterSquare: '' }),
            minYear: minYear !== 2017 ? minYear.toString() : '',
            maxYear: maxYear !== 2022 ? maxYear.toString() : ''
        }
        handleChangeFilters(queriesToAdd as FilterParamsType)
        setUrlQueryParams(queriesToAdd)
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                minHeight: { xs: '520px', sm: 'initial' },
                display: 'flex',
                justifyContent: 'space-evenly',
                alignContent: 'space-around',
                flexWrap: 'wrap',
                alignItems: 'center',
                height: '100%',
                gap: '20px'
            }}
        >
            {isPricePerMeter ? (
                <CustomMinMaxFieldBoxes
                    isPricePerMeter={isPricePerMeter}
                    key={'minPricePerMeterSquare'}
                    label="Prix (€)"
                    minDefaultValue={minPricePerMeterSquare || ''}
                    minName="minPricePerMeterSquare"
                    maxDefaultValue={maxPricePerMeterSquare || ''}
                    maxName="maxPricePerMeterSquare"
                    togglePricePerMeter={togglePricePerMeter}
                />
            ) : (
                <CustomMinMaxFieldBoxes
                    isPricePerMeter={isPricePerMeter}
                    key={'minPrice'}
                    label="Prix (€)"
                    minDefaultValue={minPrice || ''}
                    minName="minPrice"
                    maxDefaultValue={maxPrice || ''}
                    maxName="maxPrice"
                    togglePricePerMeter={togglePricePerMeter}
                />
            )}
            <CustomMinMaxFieldBoxes
                label="Surface (m²)"
                minDefaultValue={minSurface || ''}
                minName="minSurface"
                maxDefaultValue={maxSurface || ''}
                maxName="maxSurface"
            />
            <CustomMinMaxFieldBoxes
                label="Terrain (m²)"
                minDefaultValue={minSurfaceLand || ''}
                minName="minSurfaceLand"
                maxDefaultValue={maxSurfaceLand || ''}
                maxName="maxSurfaceLand"
            />

            <CustomMinMaxFieldBoxes
                label="Pièce(s)"
                minDefaultValue={minNbOfRooms || ''}
                minName="minNbOfRooms"
                maxDefaultValue={maxNbOfRooms || ''}
                maxName="maxNbOfRooms"
            />
            <Box width={'210px'}>
                <Typography
                    id="year-range-slider"
                    variant="subtitle1"
                    textAlign="center"
                    sx={{
                        textAlign: 'center',
                        fontSize: '.92rem',
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                        marginBottom: '-7px'
                    }}
                >
                    Années de la transaction
                </Typography>
                <Box
                    width="90%"
                    margin="0 auto"
                    display="flex"
                    alignItems="center"
                >
                    <Slider
                        size="medium"
                        disableSwap
                        min={2017}
                        max={2022}
                        marks
                        defaultValue={minMaxYearRef.current}
                        valueLabelDisplay="auto"
                        track="normal"
                        onChange={(_, newValue) => {
                            if (Array.isArray(newValue)) {
                                minMaxYearRef.current = newValue
                            }
                        }}
                    />
                </Box>
            </Box>
            <Box display="flex" justifyContent={'center'} alignSelf="end">
                <Button type="submit" variant="contained" disabled={isLoading}>
                    Appliquer
                </Button>
            </Box>
        </Box>
    )
}
