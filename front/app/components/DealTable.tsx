import { useAppContext } from '../context/Context'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    TablePagination,
    CircularProgress
} from '@mui/material'
import { ListedDealType } from '../types'
import { stripArrondissement } from '@/utils/utilityFunctions'

type Order = 'asc' | 'desc'

export const DealTable = () => {
    const { listedDeals, isLoading, handlePopTooltip, isClustered, length } =
        useAppContext()

    const [tableItems, setTableItems] = useState<ListedDealType[]>([])
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] =
        useState<keyof ListedDealType>('date_mutation')
    const [rowsPerPage, setRowsPerPage] = useState(50)
    const [page, setPage] = useState(0)

    const headerColumns: { name: string; field: keyof ListedDealType }[] = [
        { name: 'Date', field: 'date_mutation' },
        { name: 'Adresse', field: 'adresse_numero' },
        { name: 'Prix', field: 'valeur_fonciere' },
        { name: 'Surface', field: 'total_surface_reelle_bati' },
        { name: 'Prix / m²', field: 'prix_metre_carre' },
        { name: 'Pièces', field: 'total_nombre_pieces_principales' },
        { name: 'Terrain', field: 'total_surface_terrain' }
    ]

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleSort = (field: keyof ListedDealType) => {
        const newOrder =
            orderBy !== field ? 'asc' : order === 'desc' ? 'asc' : 'desc'
        setOrder(newOrder)
        setOrderBy(field)
    }

    useEffect(() => {
        if (!isClustered && length) {
            let newList: ListedDealType[] = []
            if (order === 'desc') {
                newList = [...listedDeals].sort((a, b) => {
                    if (orderBy === 'date_mutation') {
                        return (
                            new Date(b.date_mutation).getTime() -
                            new Date(a.date_mutation).getTime()
                        )
                    }
                    if (typeof a[orderBy] === 'number')
                        return (b[orderBy] as number) - (a[orderBy] as number)
                    else if (typeof a[orderBy] === 'string')
                        return (b[orderBy] as string).localeCompare(
                            a[orderBy] as string
                        )
                    else return 0
                })
            } else {
                newList = [...listedDeals].sort((a, b) => {
                    if (orderBy === 'date_mutation') {
                        return (
                            new Date(a.date_mutation).getTime() -
                            new Date(b.date_mutation).getTime()
                        )
                    }
                    if (typeof b[orderBy] === 'number')
                        return (a[orderBy] as number) - (b[orderBy] as number)
                    else if (typeof b[orderBy] === 'string')
                        return (a[orderBy] as string).localeCompare(
                            b[orderBy] as string
                        )
                    else return 0
                })
            }
            setTableItems(newList)
        } else setTableItems([])
        setPage(0)
    }, [order, orderBy, listedDeals, isClustered, length])

    return (
        <Paper sx={{ backgroundColor: 'white', my: 15 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headerColumns.map((col) =>
                                col.name !== 'Adresse' ? (
                                    <TableCell
                                        key={col.name}
                                        align="center"
                                        sx={{ whiteSpace: 'nowrap' }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === col.name}
                                            direction={order}
                                            onClick={() =>
                                                handleSort(col.field)
                                            }
                                        >
                                            {col.name}
                                        </TableSortLabel>
                                    </TableCell>
                                ) : (
                                    <TableCell align="center" key={col.name}>
                                        {col.name}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody
                    /* sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }} */
                    >
                        {!isLoading && !isClustered && length > 0 ? (
                            tableItems
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((item) => (
                                    <TableRow
                                        key={item.id_mutation}
                                        hover={true}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: (theme) =>
                                                    theme.palette.ash.main +
                                                    '!important'
                                            }
                                        }}
                                        onClick={() => {
                                            handlePopTooltip({
                                                lnglat: item.lnglat,
                                                idx: item.agglomerateIdx
                                            })
                                        }}
                                    >
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {format(
                                                new Date(item.date_mutation),
                                                'dd-MM-yyyy'
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.adresse_numero +
                                                ' ' +
                                                item.adresse_suffixe +
                                                ' ' +
                                                item.adresse_nom_voie +
                                                ' ' +
                                                item.code_postal +
                                                ' ' +
                                                stripArrondissement(
                                                    item.nom_commune
                                                )}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {item.valeur_fonciere.toLocaleString() +
                                                ' €'}{' '}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {item.total_surface_reelle_bati.toLocaleString() +
                                                ' m²'}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {item.prix_metre_carre.toLocaleString() +
                                                ' €'}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {item.total_nombre_pieces_principales.toLocaleString()}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {item.total_surface_terrain.toLocaleString() +
                                                ' m²'}
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow hover={false}>
                                <TableCell
                                    align="center"
                                    colSpan={'100%' as unknown as number}
                                >
                                    {isLoading ? (
                                        <CircularProgress />
                                    ) : isClustered ? (
                                        'Trop de transactions'
                                    ) : (
                                        'Aucune transaction'
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                    inputProps: {
                        id: 'rowsPerPage'
                    }
                }}
                labelRowsPerPage={
                    <label htmlFor="rowsPerPage">Lignes par pages</label>
                }
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} sur ${
                        count !== -1 ? count : `plus de ${to}`
                    }`
                }
            />
        </Paper>
    )
}
