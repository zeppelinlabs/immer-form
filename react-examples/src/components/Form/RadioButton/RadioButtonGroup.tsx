import React from "react"
import { renderErrorMessage } from "../FormCommon"
import RadioButton from "./RadioButton"

type RadioButtonOption = {
    value: string,
    text: string,
}
type Props = {
    name: string,
    options: RadioButtonOption[],
    value: string,
    disabled?: boolean,
    errorMessage?: string | null,
    onChange?: (value: string) => void,
    onBlur?: () => void,
}

const RadioButtonGroup = React.forwardRef((
    props: Props,
    ref: React.ForwardedRef<HTMLInputElement>
) => {
    const handleOnChange = (value: string) => {
        props.onChange && props.onChange(value)
    }

    return (
        <>
            {props.options.map((propsChild: RadioButtonOption) => {
                return <RadioButton {...propsChild}
                    key={propsChild.value}
                    selectedValue={props.value}
                    disabled={props.disabled}
                    onChange={handleOnChange}
                    onBlur={props.onBlur}
                />
            })}
            {props.errorMessage
                && renderErrorMessage(props.errorMessage)}
        </>
    )
})

RadioButtonGroup.displayName = "RadioButtonGroup"

export default RadioButtonGroup
