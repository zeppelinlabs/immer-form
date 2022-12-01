import React from "react"
import { InputStyled } from "./InputStyles"
import { useState } from "react"
import { ReactComponent as HideIcon } from "../../../assets/not_preview.svg"
import { ReactComponent as ShowIcon } from "../../../assets/preview.svg"
import { renderErrorMessage } from "../FormCommon"

export type Props = {
    placeholder?: string,
    value: string,
    disabled?: boolean,
    errorMessage?: string | null,
    tabIndex?: number,
    autoFocus?: boolean,
    onChange?: (value: string) => void,
    onBlur?: () => void,
    onFocus?: (value: string) => void,
}


const InputPassword = React.forwardRef((
    props: Props,
    ref: React.ForwardedRef<HTMLInputElement>
) => {
    const [showPassword, setShowPassword,] = useState(true)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(e.target.value)
    }

    const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus && props.onFocus(e.target.value)
    }

    const handleToggleShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    const renderIconAction = () => {
        return (
            <InputStyled.InputAction
                type="button"
                onClick={handleToggleShowPassword}
            >
                {showPassword ? <ShowIcon /> : <HideIcon />}
            </InputStyled.InputAction>
        )
    }

    return (
        <InputStyled.InputContainer>
            <InputStyled.Input
                type={showPassword ? "password" : "text"}
                value={props.value || ""}
                errorMessage={!!props.errorMessage}
                placeholder={props.placeholder}
                disabled={props.disabled}
                ref={ref}
                onChange={handleOnChange}
                onBlur={props.onBlur}
                onFocus={handleOnFocus}
                tabIndex={props.tabIndex}
                autoFocus={props.autoFocus}
            />
            {renderIconAction()}
            {props.errorMessage
                && renderErrorMessage(props.errorMessage)}
        </InputStyled.InputContainer>
    )
})

InputPassword.displayName = "InputPassword"

export default InputPassword
