import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { TooltipContainer } from '../common/TooltipContainer'
import { useAppContext } from '@/app/context/Context'

type Props = {
    component: React.ReactNode
    noDataDesc?: string
    title?: string
}
export const ChartContainer = ({
    component,
    noDataDesc = '',
    title = ''
}: Props) => {
    const { isLoading } = useAppContext()

    return (
        <Paper
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                height: '600px',
                gap: 2.2,
                backgroundColor: 'white',
                p: {
                    xs: '20px 10px',
                    sm: '30px 50px'
                },
                position: 'relative'
            }}
        >
            {title ? (
                <Typography
                    sx={{
                        typography: {
                            xs: 'mapLgTypo1',
                            sm: 'mapLgTypo'
                        }
                    }}
                    component={'h2'}
                >
                    {title}
                </Typography>
            ) : (
                <></>
            )}
            {isLoading || noDataDesc ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        zIndex: 2,
                        backgroundColor: 'rgba(255, 255, 255, .4)'
                    }}
                >
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <TooltipContainer>
                            <Box sx={{ p: '20px 30px' }}>
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: 'mapLgTypo2',
                                            sm: 'mapLgTypo1'
                                        }
                                    }}
                                >
                                    {noDataDesc}
                                </Typography>
                            </Box>
                        </TooltipContainer>
                    )}
                </Box>
            ) : (
                <></>
            )}
            {component}
        </Paper>
    )
}
