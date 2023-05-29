export const stripArrondissement = (str: string): string => {
    if (str.includes('Arrondissement')) {
        //arr.splice(arr.length - 2, 2);
        return str.split(' ')[0]
    } else {
        return str
    }
}
