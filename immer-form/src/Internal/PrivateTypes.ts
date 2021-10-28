import { Draft } from "immer"
import { SubscriptionsReturn } from "./PrivateHooks"
import { Token } from "./Types"
import { FieldsErrors } from "./Validations"


export type ModificationFunction<T> = (n: Draft<T>) => void


export type ModificationHandler<T> = (n: ModificationFunction<T>, paths: Paths) => void

export type BlurHandler = (paths: Paths) => void
export type SetShowErrorHandler = (paths: Paths, elementForBallonError: HTMLElement | null) => void



export type FieldsDirty = Record<string, boolean>
export type FieldsTouched = Record<string, boolean>
export type FieldsShowError = Record<string, boolean>



export type Paths = {
    path: string,
    pathArray: string,
}


export type InnerTokenGenerator<T, S> = {
    source: Token<S, never>,
    f: (s: S) => T,
    deps: Deps,
}


export type FormState = {
    valid: boolean,
    submitted: boolean,
    loading: boolean,
    submittable: boolean,
    hasChanges: boolean,
}

export type ToClear = {
    dirty?: boolean,
    touched?: boolean,
    showError?: boolean,
}

type ErrorsMessages = {
    messages: string,
    hasError: boolean,
}

export type TokenFormProps = {
    subscribe: SubscriptionsReturn["subscribe"],
    unSubscribe: SubscriptionsReturn["unSubscribe"],
    onBlurPath: BlurHandler,
    setShowErrors: SetShowErrorHandler,
    getTouched: (paths: Paths) => FieldsTouched,
    getDirty: (paths: Paths) => FieldsDirty,
    getErrors: (paths: Paths) => FieldsErrors,
    getShowError: (paths: Paths) => boolean,
    getErrorMessagesToShow: (paths: Paths) => ErrorsMessages,
    getErrorMessages: (paths: Paths) => ErrorsMessages,
    getFormState: () => FormState,
    getIsValidationReady: () => boolean,
    clearState: (paths: Paths, toClear: ToClear) => void,
}

export type InnerToken<T> = {
    formProps: TokenFormProps,
    onModification: ModificationHandler<T>,
    getValue: () => T,
} & Paths


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Deps = any[]