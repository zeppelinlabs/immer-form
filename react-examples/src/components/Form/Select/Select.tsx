/* eslint-disable react/display-name */
import React from "react"
import { SelectStyled } from "./SelectGroupStyles"
import Label from "../Label/Label"
import { renderErrorMessage } from "../FormCommon"

export type SelectOption<K> = {
    key: K,
    text: string,
}

type ValidKey = string | boolean | number | null

export type Props<K extends ValidKey, T extends SelectOption<K>> = {
    displayName?: string,
    options: T[],
    keyValue: K,
    placeholder: string,
    disabled?: boolean,
    errorMessage?: string | null,
    onChange?: (value: T) => void,
    onBlur?: () => void,
}
const keySerializator = (() => {
    const emptyValue = ""
    return {
        serialize: (k: ValidKey) =>
            (k === emptyValue
                ? emptyValue
                : JSON.stringify(k)),
        deserialize: <R extends ValidKey>(s: string) =>
            (s === emptyValue
                ? emptyValue
                : JSON.parse(s) as R),
    }
})()
const Select = React.forwardRef(<K extends ValidKey, T extends SelectOption<K>>(props: Props<K, T>,
    ref: React.ForwardedRef<HTMLSelectElement>) => {

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = keySerializator.deserialize(e.target.value)
        const value = props.options.find(o => o.key === selected)

        if (value) {
            props.onChange && props.onChange(value)
        } else {
            console.error("Option not found", value, e.target.value, selected)
            throw new Error("Option not found")
        }
    }
    return (
        <Label text={props.displayName && props.displayName}>
            <SelectStyled.Select
                ref={ref}
                value={keySerializator.serialize(props.keyValue)}
                onChange={handleOnChange}
                onBlur={props.onBlur}
                disabled={props.disabled}
                errorMessage={props.errorMessage}
            >
                {props.placeholder
                    && <SelectStyled.OptionPlaceholder>
                        {props.placeholder}
                    </SelectStyled.OptionPlaceholder >
                }

                {props.options.map((opt) => {
                    const key = keySerializator.serialize(opt.key)
                    return (
                        <option key={key}
                            value={key}
                        >
                            {opt.text}
                        </option>
                    )
                })}
            </SelectStyled.Select>
            {
                props.errorMessage
                && renderErrorMessage(props.errorMessage)
            }
        </Label>
    )
}) as <K extends ValidKey, T extends SelectOption<K>>(props: Props<K, T>
    & React.RefAttributes<HTMLSelectElement>) => JSX.Element

export default Select