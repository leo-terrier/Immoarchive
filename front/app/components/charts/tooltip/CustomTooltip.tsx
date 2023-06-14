import { TooltipItemType } from '@/app/types'
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent'

const CustomTooltip = (props: any) => {
    const { payload, unit = '' } = props
    if (props.payload?.[0] != null) {
        const tooltipProps = payload[0]?.payload?.tooltipProps
        const tooltipItems = tooltipProps.tooltipItems.map(
            (elt: TooltipItemType) =>
                elt.color
                    ? elt
                    : {
                          ...elt,
                          color: '#212121'
                      }
        )
        const newPayload = tooltipItems
        const newLabel = tooltipProps?.label.includes(' - ')
            ? tooltipProps?.label
                  .split(' - ')
                  .map((elt: string) => (elt += ' ' + unit))
                  .join(' - ')
            : tooltipProps?.label + ' ' + unit

        return (
            <DefaultTooltipContent
                {...props}
                label={newLabel}
                contentStyle={{
                    opacity: 0.9,
                    backgroundColor: 'white'
                }}
                labelStyle={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    marginBottom: '8px'
                }}
                payload={newPayload}
            />
        )
    } else {
        return <DefaultTooltipContent {...props} />
    }
}

export default CustomTooltip
