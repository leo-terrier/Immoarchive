import { useAppContext } from '@/app/context/Context'
import { LatLng } from '@/app/types'
import { Close } from '@mui/icons-material'
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

type SuggestionType = { id: string; description: string }

type Props = {
    changeZoom: (type?: string) => void
    setMapCenter: (lnglat: LatLng) => void
}

export const AddressForm = ({ setMapCenter, changeZoom }: Props) => {
    const { setOpenFilters } = useAppContext()

    // TODO : pass parameters instead of filtering after on specific terms
    const {
        /* ready, */
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: 'fr' }
            //googleMaps(TODO)
        },
        debounce: 300
    })

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

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
            const suggestions: SuggestionType[] = data.map((suggestion) => ({
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
                    data-cy="suggestion"
                    sx={{
                        backgroundColor: 'white',
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.grey[200]
                        }
                    }}
                >
                    <Typography color="text.primary">{description}</Typography>
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
                    md: '45%' // Subtract 20px padding from the width'
                },
                top: 10,
                right: 10,
                backgroundColor: 'white'
            }}
        >
            <TextField
                sx={{
                    backgroundColor:
                        'white' /* (theme) => theme.palette.greish.main */,
                    height: '40px',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;'
                }}
                autoComplete="off"
                type="text"
                value={value}
                onChange={handleInput}
                fullWidth
                /* label={
                    <Typography sx={{ fontSize: '18px' }}>{label()}</Typography>
                } */
                placeholder={`Addresse / Point d'intérêt`}
                InputLabelProps={{
                    shrink: false
                }}
                InputProps={{
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
                            position="end"
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
                                data-cy="close"
                                onClick={() => {
                                    setValue('')
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
                                <Close fontSize="medium" />
                            </IconButton>
                            <Divider
                                orientation="vertical"
                                sx={{
                                    height: '30px',
                                    display: { sm: 'none' }
                                }}
                            />
                            <Button
                                sx={{
                                    margin: '5px',
                                    padding: '4px 8px',
                                    fontSize: '0.8rem',
                                    maxWidth: '40px',
                                    display: { sx: 'flex', sm: 'none' },
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: (theme) =>
                                        theme.palette.text.primary,
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto',
                                    lineHeight: '115%'
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
                    sx={{ backgroudColor: 'white' }}
                    data-cy="suggestions"
                >
                    {renderSuggestions()}
                </MenuList>
            )}
        </Box>
    )
}
