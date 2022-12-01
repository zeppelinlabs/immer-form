
import React from "react"
import { CheckboxStyled } from "./CheckboxStyles"
import { ReactComponent as TickIcon } from "../../../assets/tick.svg"
import Label from "../Label/Label"

export type Props = {
    label?: string,
    children?: JSX.Element,
    value: boolean,
    disabled?: boolean,
    onChange?: (value: boolean) => void,
    onBlur?: () => void,
}


const Checkbox = React.forwardRef((
    props: Props,
    ref: React.ForwardedRef<HTMLInputElement>
) => {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(e.target.checked)
    }

    return (
        <Label inline disabled={props.disabled}>
            <CheckboxStyled.Container>
                <CheckboxStyled.Input
                    type="checkbox"
                    checked={props.value}
                    disabled={props.disabled}
                    ref={ref}
                    onChange={handleOnChange}
                    onBlur={props.onBlur}
                />
                <CheckboxStyled.Check>
                    {props.value && (
                        <CheckboxStyled.Tick>
                            <TickIcon />
                        </CheckboxStyled.Tick>
                    )}
                </CheckboxStyled.Check>
            </CheckboxStyled.Container>
            {props.children}
            {props.label}
        </Label>
    )
})

Checkbox.displayName = "Checkbox"

export default Checkbox
