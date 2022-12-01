
import React from "react"
import { LabelStyled } from "./LabelStyles"

export type Props = {
    text?: string,
    children?: React.ReactNode,
    required?: boolean,
    disabled?: boolean,
    htmlFor?: string,
    inline?: boolean,
}

const Label = (props: Props) => {
    return (
        <LabelStyled.Label
            htmlFor={props.htmlFor}
            disabled={props.disabled}
            inline={props.inline}
        >
            {props.text
                && <LabelStyled.LabelText
                    disabled={props.disabled}
                >
                    {props.text && props.text}
                    {props.required && <LabelStyled.Required>*</LabelStyled.Required>}
                </LabelStyled.LabelText>
            }
            {props.children && props.children}
        </LabelStyled.Label>
    )
}
export default Label