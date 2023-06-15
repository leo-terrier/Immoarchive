import { roundToLeadingDigit } from './utils'
import {
    Bar,
    GenerateHistoType,
    StatsDealType,
    GenerateScatterType,
    ListedDealType,
    OriginalDealType
} from './types'

const generateHistoStep = ({ deals, range, prop }: GenerateHistoType) => {
    // If the smallest  of the highest 10% deals falls below last interval value, return step, else increase step
    const acceptableLastStepShare = Math.floor(deals.length * 0.1)
    const highestValueDeals = deals.slice(0, acceptableLastStepShare + 1)
    const smallestOfHighest = highestValueDeals[highestValueDeals.length - 1]
    let step = 0
    let currentStep = range![0]
    while (step === 0 && currentStep < range![1] + 1) {
        const value = smallestOfHighest[prop] as number
        if (value < currentStep * 9) {
            step = currentStep
        }
        //Avoid non round step (ex: 750)
        currentStep = roundToLeadingDigit(currentStep * 2)
    }
    return step
}

const histoData = ({ deals, prop, range }: GenerateHistoType) => {
    const isRoomsHisto = prop === 'total_nombre_pieces_principales'

    //Create Histo interval
    const step = isRoomsHisto ? 1 : generateHistoStep({ deals, range, prop })
    const result: Bar[] = []
    let barValue = step
    for (let i = 0; i < 10; i++) {
        const bar: Bar = {
            name: barValue.toLocaleString('fr-FR'),
            value: barValue,
            count: 0,
            tooltipProps: {
                tooltipItems: [],
                label: ''
            }
        }
        if (isRoomsHisto) {
            if (i === 9) {
                bar.name = '> 9'
                bar.tooltipProps.label = '> 9'
            }
            barValue += step
        } else {
            if (i !== 0 && i !== 9) {
                bar.tooltipProps.label = `${barValue.toLocaleString(
                    'fr-FR'
                )} - ${(barValue + step).toLocaleString('fr-FR')}`
                barValue += step
            } else {
                const label =
                    (i === 0 ? '< ' : '> ') + barValue.toLocaleString('fr-FR')
                bar.name = label
                bar.tooltipProps.label = label
            }
        }

        result.push(bar)
    }

    // Add individual values into intervals
    deals.forEach((deal) => {
        const value = deal[prop] as number
        for (let i = 0; i < 10; i++) {
            if (i === 9) {
                result[i].count++
                break
            }
            if (value < result[i + 1].value) {
                result[i].count++
                break
            }
        }
    })
    // Add tooltip info for each interval
    result.forEach((res) => {
        res.tooltipProps = {
            ...res.tooltipProps,
            tooltipItems: [
                {
                    name: 'Nombre de transactions',
                    value: res.count.toLocaleString('fr-FR')
                },
                {
                    name: 'Pourcentage',
                    value: ((res.count / deals.length) * 100).toFixed(2),
                    color: '#f50057',
                    unit: '%'
                }
            ]
        }
    })
    return result
}

const generatePriceSurfaceScatter = ({
    priceSorted,
    surfaceSorted,
    dealsBottomOutliersRemoved
}: GenerateScatterType) => {
    const data: ListedDealType[] = []

    const topOutliersId: string[] = []

    // Remove top outliers when result length  > 10
    if (priceSorted.length > 10) {
        for (let i = 2; i > -1; i--) {
            if (
                priceSorted[i].valeur_fonciere >
                1.25 * priceSorted[i + 1].valeur_fonciere
            ) {
                topOutliersId.push(
                    ...priceSorted.slice(0, i + 1).map((e) => e.id_mutation)
                )
                break
            }
        }
        for (let i = 2; i > -1; i--) {
            if (
                surfaceSorted[i].total_surface_reelle_bati >
                1.25 * surfaceSorted[i + 1].total_surface_reelle_bati
            ) {
                topOutliersId.push(
                    ...surfaceSorted.slice(0, i + 1).map((e) => e.id_mutation)
                )
                break
            }
        }
    }
    const deals = dealsBottomOutliersRemoved.filter(
        (deal) => !topOutliersId.includes(deal.id_mutation)
    )

    let sumPpms = 0

    deals.forEach((deal) => {
        sumPpms += deal.prix_metre_carre
        data.push(deal)
    })
    const averagePricePerMeterSquare = sumPpms / deals.length
    const xValue = deals[0].valeur_fonciere * 0.75
    const yValue = Math.floor((xValue / averagePricePerMeterSquare) * 100) / 100

    return {
        data,
        averagePricePerMeterSquare: Math.floor(averagePricePerMeterSquare),
        endPoint: { x: xValue, y: yValue }
    }
}

const generatePricePerMeterIncreaseLine = (deals: StatsDealType[]) => {
    const result = [
        { name: '2017', sum: 0, count: 0 },
        { name: '2018', sum: 0, count: 0 },
        { name: '2019', sum: 0, count: 0 },
        { name: '2020', sum: 0, count: 0 },
        { name: '2021', sum: 0, count: 0 },
        { name: '2022', sum: 0, count: 0 }
    ]

    deals.forEach((deal) => {
        const year = result.find(
            (year) =>
                new Date(deal.date_mutation).getFullYear().toString() ==
                year.name
        )
        year!.sum += deal.prix_metre_carre
        year!.count++
    })

    return result.map((year) => ({
        name: year.name,
        ['Prix / m²']: Math.floor(year.sum / year.count),
        tooltipProps: {
            tooltipItems: [
                {
                    name: 'Prix / m²',
                    value: Math.floor(year.sum / year.count).toLocaleString(
                        'fr-FR'
                    ),
                    unit: ' €'
                },
                {
                    name: 'Nombre de transactions',
                    value: year.count.toLocaleString('fr-FR'),
                    color: '#f50057'
                }
            ],
            label: year.name
        }
    }))
}

export const generateGraphData = (
    deals: (ListedDealType | OriginalDealType)[],
    isClustered: boolean
) => {
    const pricePerMeterSquareSorted = [...deals].sort(
        (a, b) => b.prix_metre_carre - a.prix_metre_carre
    )
    const priceSorted = [...deals].sort(
        (a, b) => b.valeur_fonciere - a.valeur_fonciere
    )
    const surfaceSorted = [...deals].sort(
        (a, b) => b.total_surface_reelle_bati - a.total_surface_reelle_bati
    )
    const priceHisto = histoData({
        deals: priceSorted,
        prop: 'valeur_fonciere',
        range: [25000, 10000000]
    })
    const pricePerMeterHisto = histoData({
        deals: pricePerMeterSquareSorted,
        prop: 'prix_metre_carre',
        range: [250, 100000]
    })
    const surfaceHisto = histoData({
        deals: surfaceSorted,
        prop: 'total_surface_reelle_bati',
        range: [5, 4000]
    })
    const roomsHisto = histoData({
        deals,
        prop: 'total_nombre_pieces_principales'
    })

    const pricePerMeterMedian =
        pricePerMeterSquareSorted[
            Math.floor(pricePerMeterSquareSorted.length / 2)
        ].prix_metre_carre

    const dealsBottomOutliersRemoved =
        deals.length > 10
            ? priceSorted.filter(
                  (deal) => deal.prix_metre_carre > 0.1 * pricePerMeterMedian
              )
            : priceSorted

    const priceSurfaceScatter = isClustered
        ? null
        : generatePriceSurfaceScatter({
              priceSorted: priceSorted as ListedDealType[],
              surfaceSorted: surfaceSorted as ListedDealType[],
              dealsBottomOutliersRemoved:
                  dealsBottomOutliersRemoved as ListedDealType[]
          })

    const pricePerMeterIncreaseLine = generatePricePerMeterIncreaseLine(
        dealsBottomOutliersRemoved
    )

    return {
        priceHisto,
        pricePerMeterHisto,
        surfaceHisto,
        roomsHisto,
        priceSurfaceScatter,
        pricePerMeterIncreaseLine
    }
}
