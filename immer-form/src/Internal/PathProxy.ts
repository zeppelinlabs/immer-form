import { Paths } from "./PrivateTypes"

const pathProxyKey = Symbol("Path Proxy Getter")

export type PathProxy =
    {
        [s in string | number]: PathProxy
    }
    &
    {
        [pathProxyKey]: string,
    }


export const getPathProxy = (path?: string) => {
    const ret = new Proxy({}, {
        get: (_, p) => {
            if (p === pathProxyKey) {
                return path
            } else {
                return getPathProxy([path, p as string,].filter(Boolean).join("."))
            }
        },

    }) as PathProxy

    return ret
}

export const getPathGenerators = (paths: Paths) => {
    const path = getPathProxy(paths.path)
    const pathArray = getPathProxy(paths.pathArray)
    return {
        path,
        pathArray,
    }
}


export const getFunctionPaths = <T, R>(paths: Paths, f: (t: T) => R) => {
    const path = f(getPathProxy(paths.path) as any) as any as PathProxy
    const pathArray = f(getPathProxy(paths.pathArray) as any) as any as PathProxy
    return {
        path: path[pathProxyKey],
        pathArray: pathArray[pathProxyKey],
    }
}

export const getApplyAttr = <R>(
    generators: ReturnType<typeof getPathGenerators>,
    attr: R,
    key?: string | number
) => {
    return {
        path: (generators.path[attr as any] as PathProxy)[pathProxyKey],
        pathArray: (generators.path[key || attr as any] as PathProxy)[pathProxyKey],
    }
}