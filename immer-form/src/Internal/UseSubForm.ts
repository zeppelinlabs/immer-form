import { Draft } from "immer"
import { useCallback, useDebugValue, useEffect, useMemo, useRef } from "react"
import { PrivateHooks, SubNotificationSource } from "./PrivateHooks"
import { Deps, FormState, ModificationFunction, Paths, ToClear } from "./PrivateTypes"
import { getApplyAttr, getFunctionPaths, getPathGenerators } from "./PathProxy"
import { TokenLive, TokenGenerator, Token, TokenType, } from "./Types"
import {
    areEqualShallow, generateReactKey,
} from "./PrivateUtil"
import { ArrayElementIfArray, KeysWithValue } from "./PrivateUtilTypes"



const {
    useRender,
    useCurrent,
} = PrivateHooks


const getTokenBase = <T, R>(params: {
    token: TokenLive<T>,
    f: (e: T) => R,
    paths: Paths,
}): TokenLive<R> => {
    const {
        token,
        f,
        paths: {
            path,
            pathArray,
        },
    } = params


    const getValue = () => f(token._.getValue())

    const onModification = (change: (r: Draft<R>) => void, callPaths: Paths) => {
        token._.onModification(p => {
            change(f(p as T) as Draft<R>)
        }, callPaths)
    }

    return {
        _type: TokenType.live,
        _: {
            getValue: getValue,
            formProps: token._.formProps,
            path: path,
            pathArray,
            onModification: onModification,
        },
    }
}

const getTokenF = <T, R>(params: {
    token: TokenLive<T>,
    f: (e: T) => R,
}): TokenLive<R> => {
    const {
        token,
        f,
    } = params
    const paths = getFunctionPaths(token._, f)

    return getTokenBase({
        token,
        f,
        paths,
    })
}



const useToken = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
}): TokenGenerator<R, T> => {
    const fFixed = useCallback(params.f, [...params.deps,])

    return {
        _type: TokenType.generator,
        _: {
            source: params.token as any,
            f: fFixed,
            deps: params.deps,
        }
    }
}

const composeToken = <T, S>(token: TokenGenerator<T, S>): TokenGenerator<T, never> => {
    const source = token._.source
    if (source._type === TokenType.generator) {
        const composedSource = composeToken(source)
        const ret: TokenGenerator<T, never> = {
            _type: TokenType.generator,
            _: {
                source: composedSource._.source,
                f: (s) => token._.f(composedSource._.f(s) as any),
                deps: [...composedSource._.deps, ...token._.deps]
            }
        }
        return ret
    } else {
        return token as any as TokenGenerator<T, never>
    }
}

const useLiveToken = <T, S>(params: {
    token: Token<T, S>,
}) => {
    if (params.token._type === TokenType.live) {
        return params.token
    } else {
        const composed = composeToken(params.token)
        return useSubToken({
            token: composed._.source,
            f: composed._.f,
            deps: composed._.deps,
        })
    }
}

/** 
 * Recibe un token y una funcion
 * @returns subtoken de aplicar la funcion al token original 
 */
const useSubToken = <T, R, S>(params: {

    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,

}): TokenLive<R> => {
    const {
        token: tokenOrGenerator, f, deps,
    } = params

    const token = useLiveToken({
        token: tokenOrGenerator,
    })


    const subToken = useMemo(() => {
        return getTokenF({
            token,
            f,
        })
    }, [token, ...deps,])


    return subToken
}



type KeyTokens<T>
    = T extends (infer AE)[]
    ? { [k in number]: TokenLive<AE> }
    : { [k in keyof T]-?: TokenLive<T[k]> }

// eslint-disable-next-line max-lines-per-function
const useTokenGetter = <
    T,
    R,
    S
>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
}) => {
    const subToken = useSubToken(params)
    const pathGenerators = getPathGenerators(subToken._)

    const cache = useMemo<{
        [k in string]?: TokenLive<unknown>
    }>(() => {
        return {

        }
    }, [subToken,])

    return <K extends Exclude<keyof KeyTokens<R> & keyof R & keyof Draft<R>, symbol>>
        (k: K, key?: string | number): KeyTokens<R>[typeof k] => {
        const cacheKey = `${k}--${key || ""}`

        if (cache[cacheKey]) {
            return cache[cacheKey] as KeyTokens<R>[K]
        }

        const paths = getApplyAttr(pathGenerators, k, key)

        const ff = (t: R) => {
            return t[k]
        }


        const ret: TokenLive<R[K]> = getTokenBase({
            token: subToken,
            f: ff,
            paths,
        })

        cache[cacheKey] = ret

        return ret as KeyTokens<R>[K]
    }
}


declare const process: { env: { NODE_ENV: string, }, }


const useSubscribe_ = <T, D>({
    _: token,
}: TokenLive<T>,
    shallow: boolean,
    depsRef: () => D,
    debug?: boolean,
) => {
    const render = useRender()
    const lastCallRefs = useCurrent(depsRef())
    const id = useRef(generateReactKey())

    const callback = useCallback((source: SubNotificationSource) => {
        let newDeps
        try {
            newDeps = depsRef()
        } catch (e) {
            if (source === "parent") {
                // eslint-disable-next-line no-process-env
                if (process.env.NODE_ENV === "development") {
                    console.warn("Render skiped", e)
                }
                return
            } else {
                throw e
            }
        }
        // eslint-disable-next-line no-negated-condition
        if (!areEqualShallow(lastCallRefs.current, newDeps)) {
            debug && console.log("\tRender", token.path, id.current)
            render()
        } else {
            debug && console.log("\tNo Render", token.path, id.current)
        }
    }, [depsRef, render,])

    useEffect(() => {
        debug && console.log("subscribe", token.path, id.current)
        token.formProps.subscribe(token.path, callback, shallow)
        return () => {
            debug && console.log("unsubscribe", token.path, id.current)
            token.formProps.unSubscribe(token.path, callback, shallow)
        }
    }, [token, render, depsRef, callback,])

}

const useSubFormBase_ = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
}) => {
    const {
        deps,
        f,
        token,
    } = params

    const subToken = useSubToken({
        token, f, deps,
    })

    const errorsToShow = subToken._.formProps.getErrorMessagesToShow(subToken._)


    const onModification = useCallback((f: ModificationFunction<R>) => {
        subToken._.onModification(f, subToken._)
    }, [subToken,])

    const setShowErrors = useCallback((elementForBallonError: HTMLElement | null) => {
        subToken._.formProps.setShowErrors(subToken._, elementForBallonError)
    }, [subToken,])

    const clearState = useCallback((toClear: ToClear) => {
        subToken._.formProps.clearState(subToken._, toClear)
    }, [subToken,])

    return {
        value: subToken._.getValue(),
        onModification: onModification,
        errorsToShow: errorsToShow,
        setShowErrors: setShowErrors,
        subToken,
        clearState,

    }
}

const useSubFormToken = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
    debug?: boolean,
}) => {
    const ret = useSubFormBase_(params)

    return ret as Omit<typeof ret, "value" | "errorsToShow">
}

const useSubForm = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
    debug?: boolean,
}) => {
    const ret = useSubFormBase_(params)

    const depsCallback = useCallback(() => [
        ret.subToken._.getValue(),
        ...Object.values(ret.subToken._.formProps.getErrorMessagesToShow(ret.subToken._)),
    ], [ret.subToken._,])

    useSubscribe_(ret.subToken, false, depsCallback, params.debug)

    useDebugValue(ret)

    return ret
}

const useSubFormError = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
}) => {
    const subForm = useSubFormBase_(params)

    const depsCallback = useCallback(() => [
        ...Object.values(subForm.subToken._.formProps.getErrorMessages(subForm.subToken._)),
        ...Object.values(subForm.subToken._.formProps.getErrorMessagesToShow(subForm.subToken._)),
        subForm.subToken._.formProps.getIsValidationReady(),
        subForm.subToken._.formProps.getShowError(subForm.subToken._),
    ], [subForm.subToken._,])

    useSubscribe_(subForm.subToken, false, depsCallback)

    const ret = {
        ...(subForm as Omit<typeof subForm, "value">),
        errors: subForm.subToken._.formProps.getErrorMessages(subForm.subToken._),
        isValidationReady: subForm.subToken._.formProps.getIsValidationReady(),
        forceShowError: subForm.subToken._.formProps.getShowError(subForm.subToken._),
    }

    useDebugValue(ret)

    return ret
}


const useWatch = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: (e: T) => Deps,
}) => {
    const {
        deps,
        f,
        token: tokenOrGenerator,
    } = params

    const token = useLiveToken({
        token: tokenOrGenerator,
    })

    const despCallback = useCallback(() => {
        return deps(token._.getValue())
    }, [token._,])

    useSubscribe_(token, false, despCallback)

    const ret = {
        value: f(token._.getValue()),
    }

    useDebugValue(ret)

    return ret
}

type Shallow<T> = {
    [k in keyof T]: T extends object ? never : T
}

const useSubFormShallow = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps[],
}) => {
    const ret = useSubFormBase_(params)

    const depsCallback = useCallback(() => [
        ret.value,
        ...Object.values(ret.errorsToShow),
    ], [ret,])

    useSubscribe_(ret.subToken, true, depsCallback)

    return {
        ...ret,
        value: ret.value as unknown as Shallow<R>,
    }
}


type ArrayAtrributes<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k in keyof T]: T[k] extends any[] ? k : never
}[keyof T]


type UseArrayRet<R, KK> =
    R extends (infer AE)[]
    ? (KK extends keyof AE ? {
        value: {
            token: TokenLive<AE>,
            key: AE[KK] extends (string | number) ? AE[KK] : never,
        }[],
        _value: Pick<AE, KK>[],
        onModification: (f: ModificationFunction<R>) => void,
    } : never)
    : never


const useArraySubForm = <
    T,
    R,
    AE extends ArrayElementIfArray<R>,
    KK extends keyof AE,
    S
>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
    key: KK,
}): UseArrayRet<AE[], KK> => {

    const {
        token,
        f,
    } = params


    const {
        subToken,
        value,
        // errorMessage,
        onModification,
    } = useSubFormBase_({
        token,
        f,
        deps: [],
    })

    const depsCallback = useCallback(() => [
        subToken._.getValue(),
        ...Object.values(subToken._.formProps.getErrorMessagesToShow(subToken._)),
    ], [subToken._])

    useSubscribe_(subToken, true, depsCallback)

    const tg = useTokenGetter<T, AE[], S>({
        token: params.token,
        f: f as any as (e: T) => AE[],
        deps: [],
    })

    const ret = {
        value: value && (value as any as AE[]).map((v, i) => {
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token: tg(i, v[params.key] as any),
                key: v[params.key],
            }
        }),
        _value: value,
        onModification,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    useDebugValue(ret)

    return ret
}

type UseArrayFieldRet<T, K extends keyof T, KK> =
    T[K] extends (infer AE)[]
    ? (KK extends keyof AE ? {
        value: {
            token: TokenLive<AE>,
            key: AE[KK],
        }[],
        _value: Pick<AE, KK>[],
        onModification: (f: ModificationFunction<T[K]>) => void,
    } : never)
    : never

const useArrayField = <
    T,
    K extends ArrayAtrributes<T> & keyof T,
    AE extends ArrayElementIfArray<T[K]>,
    KK extends keyof AE & KeysWithValue<AE, string | number>,
    S
>(params: {
    token: Token<T, S>,
    attr: K,
    key: KK,
}): UseArrayFieldRet<T, K, KK> => {

    const {
        token,
        attr,
        key,
    } = params

    const f = useCallback((t: T) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t[attr] as any as AE[]
    }, [attr, token,])

    const ret = useArraySubForm({
        token,
        f,
        key: key,
        deps: [attr,],
    })
    useDebugValue(ret)

    return ret as any
}


const useFieldBase = <T, K extends keyof T, S>(params: {
    token: Token<T, S>,
    attr: K,
}) => {
    const {
        attr,
        token: tokenOrGenerator,
    } = params

    const token = useLiveToken({
        token: tokenOrGenerator,
    })

    const f = useCallback((t: T) => {
        return t[attr]
    }, [attr, token,])

    const {
        subToken,
        value,
        errorsToShow,
        clearState,
    } = useSubFormBase_({
        token,
        f,
        deps: [attr, token,],
    })



    const onChange = useCallback((value: T[typeof attr]) => {
        token._.onModification(v => {
            (v as T)[attr] = value
        }, subToken._)
    }, [subToken, token, attr,])

    const onBlur = useCallback(() => subToken._.formProps.onBlurPath(subToken._), [subToken,])


    const loading = subToken._.formProps.getFormState().loading

    const rr = {
        [attr]: value
    } as {
            [k in K]: T[K]
        }

    return {
        ...rr,
        value: value,
        loading,
        onChange,
        onBlur,
        clearState,
        errorsToShow,
        subToken,
    }
}


export type FieldToken<T> = {
    onChange: (value: T) => void,
    onBlur: () => void,
    subToken: TokenLive<T>,
    clearState: (toClear: ToClear) => void,
}
const useFieldToken = <T, K extends keyof T, S>(params: {
    token: Token<T, S>,
    attr: K,
}): FieldToken<T[K]> => {
    const ret = useFieldBase(params)


    return {
        onChange: ret.onChange,
        onBlur: ret.onBlur,
        subToken: ret.subToken,
        clearState: ret.clearState,
    }
}



const useField = <T, K extends keyof T, S>(params: {
    token: Token<T, S>,
    attr: K,
}) => {
    const ret = useFieldBase(params)

    const depsCallback = useCallback(() => {
        const d = [
            ret.subToken._.getValue(),
            ...Object.values(ret.subToken._.formProps.getErrorMessagesToShow(ret.subToken._)),
            ret.subToken._.formProps.getFormState().loading,
        ]
        return d
    }, [ret.subToken._,])

    useSubscribe_(ret.subToken, false, depsCallback)

    useDebugValue(ret)

    return ret
}


const useDebug = <T, S>(params: {
    token: Token<T, S>,
    name?: string,
}) => {
    const ret = useSubFormBase_({
        f: v => v,
        token: params.token,
        deps: [],
    })

    const id = useRef<string>()
    if (!id.current) {
        id.current = params.name ? `${params.name}-${generateReactKey()}` : generateReactKey()
    }


    const getDebugInfo = () => {
        return {
            errorsToShow: ret.errorsToShow,
            errors: ret.subToken._.formProps.getErrorMessages(ret.subToken._),
            getTouched: ret.subToken._.formProps.getTouched(ret.subToken._),
            getDirty: ret.subToken._.formProps.getDirty(ret.subToken._),
            getErrors: ret.subToken._.formProps.getErrors(ret.subToken._),
            getShowError: ret.subToken._.formProps.getShowError(ret.subToken._),
            value: ret.value,
            getValue: ret.subToken._.getValue(),
            path: ret.subToken._.path,
            pathArray: ret.subToken._.pathArray,
            formState: ret.subToken._.formProps.getFormState(),
        }
    }

    console.log("Debug-render", id.current, ret.subToken._.path, getDebugInfo())

    useSubscribe_(ret.subToken, false, () => {
        console.log("Debug-callback", id.current, ret.subToken._.path, getDebugInfo())
        return false
    })

    useDebugValue(ret)

    return ret
}

const useFormState = <T, S>(params: {
    token: Token<T, S>,
}): FormState => {
    const token = useLiveToken({
        token: params.token,
    })


    const depsCallback = useCallback(() => {
        const fs = token._.formProps.getFormState()
        const d = [
            ...Object.keys(fs),
            ...Object.values(fs),
        ]
        return d
    }, [token._.formProps,])

    useSubscribe_(token, false, depsCallback)

    const ret = token._.formProps.getFormState()

    useDebugValue(ret)

    return ret
}

const useSubFormState = <T, R, S>(params: {
    token: Token<T, S>,
    f: (e: T) => R,
    deps: Deps,
}) => {
    const subForm = useSubFormBase_(params)


    const getRet = useCallback(() => ({
        isValidationReady: subForm.subToken._.formProps.getIsValidationReady(),
        forceShowError: subForm.subToken._.formProps.getShowError(subForm.subToken._),
        dirty: Object.values(subForm.subToken._.formProps.getDirty(subForm.subToken._))
            .some(Boolean),
        touched: Object.values(subForm.subToken._.formProps.getTouched(subForm.subToken._))
            .some(Boolean),
        showErrors: subForm.subToken._.formProps.getShowError(subForm.subToken._),
    }), [subForm.subToken._,])


    const depsCallback = useCallback(() => [
        ...Object.values(subForm.subToken._.formProps.getErrorMessages(subForm.subToken._)),
        ...Object.values(subForm.subToken._.formProps.getErrorMessagesToShow(subForm.subToken._)),
        ...Object.values(getRet()),
    ], [subForm.subToken._, getRet,])

    useSubscribe_(subForm.subToken, false, depsCallback)

    const ret = {
        ...(subForm as Omit<typeof subForm, "value">),
        errors: subForm.subToken._.formProps.getErrorMessages(subForm.subToken._),
        ...getRet(),
    }

    useDebugValue(ret)

    return ret
}


export {
    useToken,
    useTokenGetter,
    useWatch,
    useSubForm,
    useSubFormToken,
    useSubFormError,
    useSubFormShallow,
    useArraySubForm,
    useArrayField,
    useFieldToken,
    useField,
    useFormState,
    useDebug,
    useSubFormState,
}

export const _PrivateFormHooks = {
    useSubscribe_,
}