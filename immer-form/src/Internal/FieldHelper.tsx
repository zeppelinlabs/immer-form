import React, { useCallback, useRef } from "react"
import { KeysWithValue } from "./PrivateUtilTypes"
import { useField, _PrivateFormHooks } from "./UseSubForm"
import { TokenLive, TokenProp } from "./Types"


const {
    useSubscribe_,
} = _PrivateFormHooks


type HTMLRef = { setCustomValidity: HTMLInputElement["setCustomValidity"], }

type Props<T> = {
    value: T,
    onChange?: (v: T) => void,
    onBlur?: () => void,
    errorMessage?: string | null,
    disabled?: boolean,
    ref?: React.Ref<HTMLRef>,
}


type OverridablesProps = "disabled" | "errorMessage"

type IsValidProps<T> = T extends Props<any> ? T : never
type GetPropsValueType<T> = T extends Props<infer V> ? V : never


const overrideIfNotUndefined = <T,>(overrider: T | undefined, original: T) =>
    overrider !== undefined ? overrider : original




type ConnectProps<P, V, F, K> =
    Omit<P, keyof Omit<Props<V>, OverridablesProps>>
    & {
        token: TokenProp<F>,
        attr: K,
    }

const useSyncErrorsWithBrowser = <R extends HTMLRef,>(params: { token: TokenLive<unknown>, }) => {
    const ref = useRef<R>(null)

    const depsCallback = useCallback(() => {
        const errorsToShow
            = params.token._.formProps.getErrorMessagesToShow(params.token._)
        if (ref.current && ref.current.setCustomValidity) {
            ref.current.setCustomValidity(errorsToShow.messages)
        }
        return [false,]
    }, [])

    useSubscribe_(params.token, false, depsCallback)

    return ref
}



const connectField = <P,>(
    C: React.ComponentType<IsValidProps<P>>
) => {
    const ConnectedComponent = <
        V extends GetPropsValueType<P>,
        F,
        K extends KeysWithValue<F, V>,
        >(
            props: ConnectProps<P, V, F, K>
        ) => {
        const {
            value,
            onChange,
            onBlur,
            errorsToShow,
            loading,
            subToken,
        } = useField(props)

        const ref = useSyncErrorsWithBrowser({ token: subToken, })

        return <C
            {...props as any}
            disabled={overrideIfNotUndefined((props as any as Props<unknown>).disabled, loading)}
            errorMessage={overrideIfNotUndefined(
                (props as any as Props<unknown>).errorMessage,
                errorsToShow.messages
            )}
            token={undefined}
            attr={undefined}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
        />
    }
    return ConnectedComponent
}





export {
    connectField,
    overrideIfNotUndefined,
    useSyncErrorsWithBrowser,
}