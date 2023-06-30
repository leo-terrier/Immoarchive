import {
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    MenuList,
    TextField,
    Typography
} from '@mui/material'
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
} from 'use-places-autocomplete'
import { Close } from '@mui/icons-material'
import { useAppContext } from '@/app/context/Context'
import { LatLng } from '@/app/types'

type AddressFormPropTypes = {
    changeZoom: (zoomType?: 'increment' | 'initial') => void
    setMapCenter: (lnglat: LatLng) => void
}

export const AddressForm = ({
    setMapCenter,
    changeZoom
}: AddressFormPropTypes) => {
    const { setIsFiltersOpen: setOpenFilters } = useAppContext()

    const {
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: 'fr' }
        },
        debounce: 300
    })

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    type SuggestionType = { id: string; description: string }
    const handleSelect = ({ id, description }: SuggestionType) => {
        setValue(description, false)
        clearSuggestions()
        getGeocode({ placeId: id })
            .then((results) => {
                const { lat, lng } = getLatLng(results[0])
                setMapCenter({
                    lat,
                    lng
                })
                changeZoom('initial')
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('Error: ', error)
            })
    }

    const renderSuggestions = () => {
        if (data.length > 0 && status === 'OK') {
            const suggestions = data.map((suggestion) => ({
                id: suggestion.place_id,
                description: suggestion.terms
                    .filter((term) => term.value !== 'France')
                    .map((term) => term.value)
                    .join(', ')
            }))

            return suggestions.map(({ id, description }) => (
                <MenuItem
                    key={id}
                    onClick={() => handleSelect({ id, description })}
                    data-cy='suggestion'
                    sx={{
                        backgroundColor: 'white',
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.grey[300]
                        }
                    }}
                >
                    <Typography color='text.primary'>{description}</Typography>
                </MenuItem>
            ))
        }
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                zIndex: 2,
                width: {
                    xs: 'calc(100% - 20px)',
                    sm: '70%',
                    md: '45%'
                },
                top: 10,
                right: 10,
                backgroundColor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;'
            }}
        >
            <TextField
                sx={{
                    height: '40px'
                }}
                autoComplete='off'
                type='text'
                value={value}
                onChange={handleInput}
                fullWidth
                label={value ? '' : `Addresse / Point d'intérêt`}
                aria-label={`Addresse / Point d'intérêt`}
                InputLabelProps={{
                    shrink: false,
                    htmlFor: 'addressFormInput',
                    sx: {
                        height: '100%',
                        mt: -1,
                        fontSize: {
                            xs: 16,
                            sm: 18
                        }
                    }
                }}
                InputProps={{
                    id: 'addressFormInput',
                    sx: {
                        borderRadius: '0',
                        height: '100%',
                        fontSize: {
                            xs: 16,
                            sm: 18
                        }
                    },
                    endAdornment: (
                        <InputAdornment
                            position='end'
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                gap: 2,
                                width: {
                                    xs: '60%',
                                    sm: 'initial'
                                },
                                alignItems: 'center'
                            }}
                        >
                            <IconButton
                                //Sm screens and up
                                data-cy='close'
                                onClick={() => {
                                    setValue('', false)
                                    clearSuggestions()
                                }}
                                sx={{
                                    display: {
                                        xs: 'none',
                                        sm: 'flex',
                                        alignItems: 'center'
                                    },
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <Close fontSize='medium' />
                            </IconButton>
                            <Divider
                                //Xs screens
                                orientation='vertical'
                                sx={{
                                    height: '30px',
                                    display: { sm: 'none' }
                                }}
                            />
                            <Button
                                // Xs screens
                                sx={{
                                    padding: '4px 8px',
                                    fontSize: '0.8rem',
                                    display: { sx: 'flex', sm: 'none' },
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: (theme) =>
                                        theme.palette.text.primary,
                                    fontWeight: 'bold',
                                    lineHeight: '125%',
                                    mb: '-1.5px'
                                }}
                                onClick={() => setOpenFilters(true)}
                            >
                                <span>Recherche</span>
                                <span> Avancée</span>
                            </Button>
                        </InputAdornment>
                    )
                }}
            />
            {data.length > 0 && (
                <MenuList
                    sx={{ backgroudColor: 'white', overflowX: 'hidden' }}
                    data-cy='suggestions'
                >
                    {renderSuggestions()}
                </MenuList>
            )}
        </Box>
    )
}
