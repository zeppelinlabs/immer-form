import React from "react"
import Label from "../Label/Label"
import { SwitchStyled } from "./SwitchStyles"

export type Props = {
    label?: string,
    value: boolean,
    disabled?: boolean,
    onChange?: (value: boolean) => void,
    onBlur?: () => void,
}

const Switch = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(e.target.checked)
    }
    return (
        <Label inline disabled={props.disabled}>
            <SwitchStyled.Input
                type="checkbox"
                checked={props.value}
                disabled={props.disabled}
                ref={ref}
                onChange={handleOnChange}
                onBlur={props.onBlur}
            />
            <SwitchStyled.Slider />
            {props.label && props.label}
        </Label>
    )
})

Switch.displayName = "Switch"

export default Switch
