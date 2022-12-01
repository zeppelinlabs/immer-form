
import React from "react"
import Label from "../Label/Label"
import { RadioButtonStyled } from "./RadioButtonStyles"

export type Props = {
    value: string,
    text?: string,
    selectedValue?: string,
    disabled?: boolean,
    onChange?: (value: string) => void,
    onBlur?: () => void,
}


export const RadioButtonInner = React.forwardRef((
    props: Props,
    ref: React.ForwardedRef<HTMLInputElement>
) => {
    const handleOnChange = () => {
        props.onChange && props.onChange(props.value)
    }

    return (
        <RadioButtonStyled.Container>
            <RadioButtonStyled.Input
                ref={ref}
                type="radio"
                checked={props.value === props.selectedValue}
                disabled={props.disabled}
                onChange={handleOnChange}
                onBlur={props.onBlur}
            />
            <RadioButtonStyled.Radio />
            {props.text}
        </RadioButtonStyled.Container>
    )
})

RadioButtonInner.displayName = "RadioButtonInner"


const RadioButton = React.forwardRef((
    props: Props,
    ref: React.ForwardedRef<HTMLInputElement>
) => {
    return (
        <Label>
            <RadioButtonInner
                {...props}
            />
        </Label>
    )
})

RadioButton.displayName = "RadioButton"

export default RadioButton
