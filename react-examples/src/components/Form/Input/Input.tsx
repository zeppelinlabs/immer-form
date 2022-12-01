import React, { useEffect, useRef, useState } from "react"
import { IconPosition } from "../../CommonTypes"
import { renderErrorMessage, renderIcon } from "../FormCommon"
import { InputStyled } from "./InputStyles"

export type Props = {
    type: "text" | "email" | "tel" | "password",
    value: string,
    placeholder?: string,
    icon?: JSX.Element,
    position?: IconPosition,
    disabled?: boolean,
    errorMessage?: string,
    leadingLabel?: string,
    onChange?: (value: string) => void,
    onBlur?: () => void,
    onFocus?: (value: string) => void,
}


const Input = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {

    const leadingLabelRef = useRef<HTMLSpanElement>(null)
    const [leadingLabelWidth, setLeadingLabelWidth,] = useState<number | undefined>(undefined)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(e.target.value)
    }

    const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus && props.onFocus(e.target.value)
    }

    useEffect(() => {
        if (leadingLabelRef.current) {
            setLeadingLabelWidth(leadingLabelRef.current.clientWidth)
        }
    }, [leadingLabelRef, props.leadingLabel,])


    const renderInput = () => {
        return (
            <>
                <InputStyled.Input
                    type={props.type}
                    value={props.value || ""}
                    errorMessage={!!props.errorMessage}
                    placeholder={props.placeholder}
                    position={props.position}
                    disabled={props.disabled}
                    ref={ref}
                    onChange={handleOnChange}
                    onBlur={props.onBlur}
                    onFocus={handleOnFocus}
                    {...(props.leadingLabel && { leadingLabelWidth: leadingLabelWidth, })}
                />
                {props.icon && props.position === IconPosition.right
                    && <InputStyled.IconContainer position={props.position}>
                        {props.icon}
                    </InputStyled.IconContainer>}
                {props.errorMessage
                    && renderErrorMessage(props.errorMessage)}
            </>
        )
    }

    const renderLeadingLabel = () => {
        return (
            <InputStyled.LeadingLabel ref={leadingLabelRef}
                errorMessage={!!props.errorMessage}>
                {props.leadingLabel}
            </InputStyled.LeadingLabel>
        )
    }

    return (
        <InputStyled.InputContainer>
            {renderInput()}
            {props.icon && props.position
                && renderIcon(props.position, props.icon)
            }
            {props.leadingLabel && renderLeadingLabel()}
        </InputStyled.InputContainer>
    )
})

Input.displayName = "Input"

export default Input
