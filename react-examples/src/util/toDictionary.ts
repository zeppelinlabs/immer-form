export type ObjDictionary<K extends string | number, T> = {
    [a in K]: T
}
export const toDictionary = <K extends string | number, T>(data: T[], getKey: (o: T) => K) => {
    return data.reduce<ObjDictionary<K, T>>((acc, curr) => {
        const key = getKey(curr)
        acc[key] = curr
        return acc
    }, {} as ObjDictionary<K, T>)
}