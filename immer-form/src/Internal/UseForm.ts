import produce, { Draft } from "immer"
import { useState, useRef, useEffect, useCallback, useMemo, useDebugValue } from "react"
import { SubmitHandler, TokenLive, TokenType } from "./Types"
import {
    ModificationHandler, Paths, InnerToken, FieldsDirty, FieldsTouched, FieldsShowError, FormState, TokenFormProps,
} from "./PrivateTypes"
import { filterPathChildren, filterWithValue, getChildren, getErrorMessageGetter, getErrorMessageToShowGetter, getParentAndSelf, } from "./PrivateUtil"
import { useValidation, Validator } from "./Validations"
import { PrivateHooks } from "./PrivateHooks"

const {
    useSubscription,
    useIsMounted,
    useCurrent,
} = PrivateHooks



type State<T> = {
    value: T,
    dirty: FieldsDirty,
    touched: FieldsTouched,
    showError: FieldsShowError,
    shouldResetAfterSubmitt: boolean,
}



export type FormReturn<T> = {
    formState: FormState,
    token: TokenLive<T>,
    onModification: ModificationHandler<T>,
    onChange: (t: T) => void,
    handleSubmit: (handler: SubmitHandler<T>) => () => void,
    reset: () => void,
}


const defaultFormState = {
    loadingSubmit: false,
    submitCount: 0,
}

const rootPath: Paths = {
    path: "",
    pathArray: "",
}

const focusErrorField = (node: HTMLElement | null) => {
    if (node) {
        let maybeForm: HTMLFormElement | null = null
        if (node.nodeName.toLowerCase() === "form") {
            maybeForm = node as HTMLFormElement
        } else {
            maybeForm = node.closest("form")
        }
        if (maybeForm) {
            // setTimeout(() => maybeForm!.reportValidity())
            setTimeout(() => {
                const invalid = maybeForm!.querySelector(":invalid")
                if (invalid && (invalid as any).focus) {
                    (invalid as any).focus()
                }
            })
        }
    }
}

const emptyValidator: Validator<any> = async () => ({})

// eslint-disable-next-line max-lines-per-function
export const useImmerForm = <T,>(p: {
    defaults: T,
    validator?: Validator<T>,
    allowSubmitWithoutChanges?: boolean,
}): FormReturn<T> => {

    const runValidations = p.validator || emptyValidator

    const isMounted = useIsMounted()

    const [formState, setFormState,] = useState<{
        submitCount: number,
        loadingSubmit: boolean,
    }>(defaultFormState)

    const currentFormState = useCurrent(formState)

    const getDefaults = (t: T): State<T> => {
        return {
            value: t,
            dirty: {},
            touched: {},
            showError: {},
            shouldResetAfterSubmitt: false,
        }
    }

    const state = useRef<State<T>>(getDefaults(p.defaults))

    const setState = (s: State<T> | ((f: State<T>) => State<T>)) => {
        if (typeof s === "function") {
            state.current = s(state.current)
        } else {
            state.current = s
        }
    }
    const subs = useSubscription()


    const handleValidation = useCallback(() => {
        subs.notify("")
    }, [subs.notify,])


    const validations = useValidation({
        defaults: p.defaults,
        validator: runValidations,
        getToValidate: () => state.current.value,
        onValidation: handleValidation,
    })


    const onModification = (
        f: (s: Draft<T>) => void,
        paths: Paths
    ) => {
        setState(produce<State<T>>(sd => {
            f(sd.value)
            sd.dirty[paths.pathArray] = true
        }))


        subs.notify(paths.path);

        (async () => {

            await validations.validatePath(paths.path, state.current.value)
            subs.notify(paths.path)
            validations.triggerValidation()

        })()
    }


    const handleSubmit = (handler: SubmitHandler<T>) => async (
        e?: any
    ) => {
        if (e) {
            e.preventDefault && e.preventDefault()
            e.persist && e.persist()
        }

        try {
            setFormState(produce(s => {
                s.loadingSubmit = true
            }))

            const errors = await runValidations(state.current.value)
            if (Object.keys(errors!).length > 0) {
                setTimeout(() => {
                    e && e.target && focusErrorField(e.target)
                })
            } else {
                await handler(state.current.value)
            }
        } finally {
            if (isMounted()) {
                if (state.current.shouldResetAfterSubmitt) {
                    _reset()
                } else {
                    setFormState(produce(s => {
                        s.loadingSubmit = false
                        s.submitCount = s.submitCount + 1
                    }))
                }
            }
        }
    }

    useEffect(() => {
        subs.notify("")
    }, [formState])

    // console.log("Form", state, validations.getErrors(), validations, formState)

    const _reset = () => {
        setState(getDefaults(p.defaults))
        validations.triggerValidation(true)
        setFormState(defaultFormState)
    }

    const reset = useCallback(() => {
        if (currentFormState.current.loadingSubmit) {
            setState(produce<State<T>>(sd => {
                sd.shouldResetAfterSubmitt = true
            }))
        } else {
            _reset()
        }
    }, [defaultFormState,])



    const callbacks = useMemo(() => {
        const clearState: TokenFormProps["clearState"] = (paths, toClear) => {
            setState(produce<State<T>>(sd => {

                filterWithValue([
                    toClear.dirty ? sd.dirty : null,
                    toClear.touched ? sd.touched : null,
                    toClear.showError ? sd.touched : null,
                ])
                    .forEach(fields => {

                        getChildren(fields, paths.pathArray)
                            .map(([p,]) => p)
                            .forEach(p => delete fields[p])
                    })
            }))

            subs.notify(paths.path);
        }

        const ret = {
            getFormState: () => {
                const submitted = currentFormState.current.submitCount > 0
                const changesAllowSubmit
                    = p.allowSubmitWithoutChanges || validations.getHasChanges()
                const loading = currentFormState.current.loadingSubmit
                const submittable
                    = changesAllowSubmit
                    && (!submitted || !validations.getHasErrors())
                    && !loading
                return {
                    valid: !validations.getHasErrors(),
                    submitted,
                    loading,
                    submittable,
                    hasChanges: validations.getHasChanges(),
                }
            },
            onChange: (f: T) => {
                setState(s => {
                    return {
                        ...s,
                        value: f,
                    }
                })
                validations.triggerValidation()

                subs.notify("")
            },
            onBlurPath: (paths: Paths) => {
                setState(produce(s => {
                    s.touched[paths.pathArray] = true
                }))
                subs.notify(paths.path)
            },
            setShowErrors: (paths: Paths, elementForBallonError: HTMLElement | null) => {
                setState(produce(s => {
                    s.showError[paths.pathArray] = true
                }))
                subs.notify(paths.path)
                focusErrorField(elementForBallonError)
            },
            clearState,
            getDirty: (paths: Paths) => {
                return filterPathChildren(state.current.dirty, paths.pathArray)
            },
            getTouched: (paths: Paths) => {
                return filterPathChildren(state.current.touched, paths.pathArray)
            },
            getValue: () => state.current.value,
            getErrors: (paths: Paths) => {
                return filterPathChildren(validations.getErrors(), paths.path)
            },
            getShowError: (paths: Paths) => {
                const { all, } = getParentAndSelf(state.current.showError, paths.pathArray)

                return all.some(Boolean)
            },
            getIsValidationReady: validations.getIsValidationReady,
        }

        return {
            ...ret,
            getErrorMessagesToShow: getErrorMessageToShowGetter({
                ...ret,
            }),

            getErrorMessages: getErrorMessageGetter({
                getErrors: ret.getErrors,
            }),
        }
    }, [])







    const innerToken = useMemo((): InnerToken<T> => {
        return {
            formProps: {
                subscribe: subs.subscribe,
                unSubscribe: subs.unSubscribe,
                ...callbacks
            },
            onModification: onModification,
            getValue: callbacks.getValue,
            ...rootPath,
        }
    }, [
        subs, onModification, callbacks, formState,
    ])



    // console.log("Form Token", innerToken)

    const ret: FormReturn<T> = {
        token: {
            _type: TokenType.live,
            _: innerToken,
        },
        formState: callbacks.getFormState(),
        onModification: onModification,
        onChange: callbacks.onChange,
        handleSubmit,
        reset,
    }

    useDebugValue(ret)

    return ret
}


