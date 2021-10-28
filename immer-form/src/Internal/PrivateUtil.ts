import { Paths, TokenFormProps } from "./PrivateTypes"
import { FieldError } from "./Validations"

export const generateReactKey = (() => {
    let v = 0
    return () => {
        const ret = v
        v++
        return `${ret}`
    }
})()

export const flatten = <T>(list: T[][]): T[] => list.reduce((a, b) => a.concat(b), [])

export const filterWithValue = <T>(arr: (T | null | undefined)[]): T[] => {
    return arr.filter(t => t !== null && t !== undefined) as T[]
}

export const getAreEqualShallow = <T,>(toIgnore: (keyof T)[]) => {
    const ignore = new Set<any>(toIgnore)

    return (a: any, b: any) => {
        for (const key in a) {
            if (
                !ignore.has(key)
                && (!(key in b) || a[key] !== b[key])
            ) {
                return false
            }
        }
        for (const key in b) {
            if (
                !ignore.has(key)
                && (!(key in a) || a[key] !== b[key])
            ) {
                return false
            }
        }
        return true
    }
}

export const areEqualShallow = getAreEqualShallow([])

export const getChildren = <T>(pathObject: Record<string, T>, path: string) => {
    const subPathPrefix = `${path}.`
    const entries = Object.entries(pathObject)

    if (path === "") {
        return entries
    } else {
        return entries.filter(([itemPath,]) => {
            return itemPath === path || itemPath.startsWith(subPathPrefix)
        })
    }
}


const flattenAndJoinErrors = (errors: FieldError[]) => {
    let errorMessages = ""
    if (errors.length > 0) {
        errorMessages = joinErrorMessages(flatten(errors.map(e => e.messages)).filter(Boolean))
    }
    return errorMessages
}

export const getErrorMessageToShowGetter = (params: {
    getErrors: TokenFormProps["getErrors"],
    getTouched: TokenFormProps["getTouched"],
    getFormState: TokenFormProps["getFormState"],
    getShowError: TokenFormProps["getShowError"],
}) => {
    return (paths: Paths) => {
        const errors = Object.values(params.getErrors(paths))
        const touched = Object.values(params.getTouched(paths))

        if (
            touched.length > 0
            || params.getFormState().submitted
            || params.getShowError(paths)
        ) {
            return {
                messages: flattenAndJoinErrors(errors),
                hasError: errors.length > 0,
            }
        }
        return {
            messages: "",
            hasError: false,
        }
    }
}

export const getErrorMessageGetter = (params: {
    getErrors: TokenFormProps["getErrors"],
}) => {
    return (paths: Paths) => {
        const errors = Object.values(params.getErrors(paths))

        return {
            messages: flattenAndJoinErrors(errors),
            hasError: errors.length > 0,
        }
    }
}



export const joinErrorMessages = (errors: string[]) => {
    return errors.join(". ")
}


export const filterPathChildren = <T>(pathObject: Record<string, T>, path: string) => {
    const subs = getChildren(pathObject, path)

    const ret = Object.fromEntries(subs)

    return ret
}

export const getPathFilter = <T>(
    getPathObject: () => Record<string, T>,
    path: string
) => () => {
    return filterPathChildren(getPathObject(), path)
}


export const getParentAndSelf = <T>(fields: Record<string, T>, path: string) => {
    const parentsPaths = path.split(".").map((_, i, segments) => {
        return segments.slice(0, i).join(".")
    })

    const parents = parentsPaths.map(p => fields[p]).filter(Boolean)

    const self = fields[path] as T | undefined

    const all = [...parents, self]
    return {
        parents,
        self,
        all,
    }
}


export const getParentAndChildren = <T>(fields: Record<string, T>, path: string) => {
    const children = getChildren(fields, path).map(([, f,]) => f)

    const {
        all: parentAndSelf,
        parents,
        self,
    } = getParentAndSelf(fields, path)


    const all = [...parentAndSelf, ...children,]

    return {
        children,
        parents,
        self,
        all,
    }
}
