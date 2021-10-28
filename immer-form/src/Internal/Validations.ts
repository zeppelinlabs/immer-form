
import produce from "immer"
import { useCallback, useEffect, useRef } from "react"
import { PrivateHooks } from "./PrivateHooks"
import { areEqualShallow, } from "./PrivateUtil"
import equal from "fast-deep-equal"

const {
    useFakeState,
    useFakeMountEffect,
    useCurrent,
} = PrivateHooks


export type FieldError = {
    messages: string[],
    byType: {
        [s: string]: string | true,
    },
    originals: unknown[],
}

export type FieldsErrors = Record<string, FieldError>

export type Validator<T> = (data: T, path?: string | undefined) => Promise<FieldsErrors | null>

declare const process: { env: { NODE_ENV: string, }, }





// eslint-disable-next-line max-lines-per-function
export const useValidation = <T>(params: {
    defaults: T,
    validator: (data: T, path?: string) => Promise<FieldsErrors | null>,
    getToValidate: () => T,
    onValidation: () => void,
}) => {
    type State =
        {
            pending: null | "regular" | "priority",
            validating: boolean,
            result: FieldsErrors,
            hasChanges: boolean,
        }

    const timeoutClear = useRef<ReturnType<typeof setTimeout>>()

    const currentValidator = useCurrent(params.validator)

    const [proj, state, setState,]
        = useFakeState<State, {
            hasErrors: boolean,
            hasChanges: boolean,
        }>({
            initial: {
                pending: null,
                result: {},
                validating: false,
                hasChanges: false,
            },
            projection: (s) => {
                return {
                    hasErrors: Object.keys(s.result).length !== 0,
                    hasChanges: s.hasChanges,
                }
            },
            equals: areEqualShallow,
            fakeEffects: [
                {
                    effect: (s) => {
                        if (!s.validating) {
                            if (s.pending === "regular") {
                                enqueueValidation()
                            } else if (s.pending === "priority") {
                                validate()
                            }
                        }
                    },
                    dep: (s) => ([s.validating,]),
                },
            ],
        })


    const validate = useCallback(async () => {
        if (timeoutClear.current) {
            clearTimeout(timeoutClear.current)
            timeoutClear.current = undefined
        }

        setState(produce(s => {
            s.pending = null
            s.validating = true
        }))
        try {
            const toValidate = params.getToValidate()
            const resultPromise = currentValidator.current(toValidate)
            const hasChanges = !equal(params.defaults, toValidate)
            const result = await resultPromise
            if (result !== null) {
                setState(produce(s => {
                    s.validating = false
                    s.result = result
                    s.hasChanges = hasChanges
                }))
            }
        } catch (e) {
            console.error("Error validating", e)
            setState(produce(s => {
                s.validating = false
                s.result = {}
            }))
        } finally {
            params.onValidation()
        }
    }, [params.validator, params.onValidation, params.defaults,])

    const enqueueValidation = () => {
        if (!timeoutClear.current) {
            timeoutClear.current = setTimeout(validate, 250)
        }
    }



    const triggerValidation = useCallback((priority?: boolean) => {
        const pendingType = priority ? "priority" : "regular"
        if (state.current.validating && !state.current.pending) {
            setState(produce(s => {
                s.pending = pendingType
            }))
        } else if (state.current.validating && state.current.pending) {
            if (state.current.pending !== pendingType) {
                setState(produce(s => {
                    s.pending = pendingType
                }))
            }
            //else do nothing already pending
        } else if (!state.current.validating && !state.current.pending) {
            if (priority) {
                validate()
            } else {
                enqueueValidation()
            }
        }
    }, [validate,])

    const validatePath = useCallback(async (path: string, data: T) => {
        const fieldErrors = await params.validator(data, path)
        if (fieldErrors !== null) {
            setState(s => {
                const prev = { ...s.result, }
                delete prev[path]
                return {
                    ...s,
                    result: {
                        ...prev,
                        ...fieldErrors,
                    },
                }
            })
        }
    }, [params.validator,])

    const getHasChanges = useCallback(() => {
        return state.current.hasChanges
    }, [])

    const getErrors = useCallback(() => {
        return state.current.result
    }, [])

    const getHasErrors = useCallback(() => {
        return Object.keys(state.current.result).length !== 0
    }, [])

    const getIsValidationReady = useCallback(() => {
        return !state.current.pending && !state.current.validating
    }, [])

    useFakeMountEffect(() => {
        triggerValidation(true)
    })

    useEffect(() => {
        triggerValidation()
    }, [params.validator,])

    return {
        // ...proj,
        triggerValidation,
        validatePath,
        getHasErrors,
        getHasChanges,
        getErrors: getErrors,
        getIsValidationReady,
    }
}
