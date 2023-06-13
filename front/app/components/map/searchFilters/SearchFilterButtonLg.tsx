import { Button } from '@mui/material'
import { useAppContext } from '@/app/context/Context'

export const SearchFilterButtonLg = () => {
    const { setIsFiltersOpen: setOpenFilters } = useAppContext()
    return (
        <Button
            sx={{
                letterSpacing: 1,
                fontWeight: 'bold',
                paddingX: 2,
                backgroundColor: 'white',
                color: (theme) => theme.palette.text.primary,
                '&:hover': {
                    backgroundColor: 'rgb(235, 235, 235)'
                },
                boxShadow:
                    'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                position: 'absolute',
                bottom: '50px',
                left: 0,
                right: 0,
                marginX: 'auto',
                display: { xs: 'none', sm: 'flex' },
                zIndex: 2,
                width: 'fit-content'
            }}
            onClick={() => setOpenFilters(true)}
            data-cy='searchFilterButtonLg'
        >
            Recherche Avancée
        </Button>
    )
}
