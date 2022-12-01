import React, { useEffect } from "react"
import { TextAreaStyled } from "./TextAreaStyles"
import { UseCombinedRefs } from "../../../hooks/UseCombineRefs"
import { renderErrorMessage } from "../FormCommon"

export type Props = {
    placeholder?: string,
    value: string,
    disabled?: boolean,
    errorMessage?: string | null,
    onChange?: (value: string) => void,
    onBlur?: () => void,
    autoHeight?: boolean,
    maxLength?: number,
}

const TextArea = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
    const innerRef = UseCombinedRefs(ref)

    useEffect(() => {
        if (props.autoHeight && innerRef.current) {
            innerRef.current.style.height = `${(innerRef.current.scrollHeight) + 2}px`
        }
    }, [innerRef, props.autoHeight,])

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange && props.onChange(e.target.value)
        if (props.autoHeight && innerRef.current) {
            innerRef.current.style.height = "0"
            innerRef.current.style.height = `${innerRef.current.scrollHeight}px`
        }
    }

    const renderCharacterCount = () => {
        return (
            <TextAreaStyled.CharacterCount
                reachesTheLimit={props.value.length === props.maxLength}
            >
                {`${props.value.length}/${props.maxLength}`}
            </TextAreaStyled.CharacterCount>
        )
    }

    return (
        <TextAreaStyled.TextAreaContainer>
            <TextAreaStyled.TextArea
                errorMessage={props.errorMessage}
                placeholder={props.placeholder}
                disabled={props.disabled}
                ref={innerRef}
                value={props.value}
                onChange={handleOnChange}
                onBlur={props.onBlur}
                maxLength={props.maxLength}
                autoHeight={props.autoHeight}
            />
            {props.maxLength && renderCharacterCount()}
            {props.errorMessage
                && renderErrorMessage(props.errorMessage)}
        </TextAreaStyled.TextAreaContainer>
    )
})

TextArea.displayName = "TextArea"

export default TextArea
