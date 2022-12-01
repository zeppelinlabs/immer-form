/* eslint-disable max-lines-per-function */
import React, { useRef, useEffect, useState } from "react"
import { IconPosition } from "../../CommonTypes"
import { renderErrorMessage, renderIcon } from "../FormCommon"
import { InputStyled } from "./InputStyles"

type Value = number | null | undefined

export type Props = {
    value: Value,
    placeholder?: string,
    icon?: JSX.Element,
    position?: IconPosition,
    disabled?: boolean,
    errorMessage?: string,
    min?: number,
    max?: number,
    step?: number,
    leadingLabel?: string,
    onChange?: (value: Value) => void,
    onBlur?: () => void,
    onFocus?: (value: Value) => void,
    onKeyDown?: (key: string) => void,
}


const InputNumeric = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    const leadingLabelRef = useRef<HTMLSpanElement>(null)
    const [leadingLabelWidth, setLeadingLabelWidth,] = useState<number | undefined>(undefined)
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        props.onChange && props.onChange(v ? Number(v) : null)
    }

    const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const v = e.target.value
        props.onFocus && props.onFocus(v ? Number(v) : null)
    }

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown && props.onKeyDown(e.key)
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
                    type="number"
                    value={props.value || props.value === 0 ? props.value : ""}
                    errorMessage={!!props.errorMessage}
                    placeholder={props.placeholder}
                    position={props.position}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    disabled={props.disabled}
                    ref={ref}
                    onChange={handleOnChange}
                    onBlur={props.onBlur}
                    onFocus={handleOnFocus}
                    onKeyDown={handleOnKeyDown}
                    {...(props.leadingLabel && { leadingLabelWidth: leadingLabelWidth, })}
                />
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
            {props.icon && props.position
                && renderIcon(props.position, props.icon)
            }
            {renderInput()}
            {props.leadingLabel && renderLeadingLabel()}

        </InputStyled.InputContainer>
    )
})

InputNumeric.displayName = "InputNumeric"

export default InputNumeric
