import styled, { css } from "styled-components"
import { device } from "../../../styles/mediaQueries"
import { thp } from "../../../styles/themeHelpers"
import { IconPosition } from "../../CommonTypes"

type InputProps = {
    type: "text" | "number" | "email" | "tel" | "password",
    position?: IconPosition,
    errorMessage?: boolean,
    leadingLabelWidth?: number,
}

const InputContainer = styled.div`
  position: relative;
  width: fit-content;
`

export const InputGeneralStyles = css<InputProps>`
    background: ${thp.common(c => c.white)};
    border: 1px solid ${thp.common(c => c.black)};
    box-sizing: border-box;
    padding: 8px 12px;
    color: ${props => (props.errorMessage
        ? thp.system(c => c.critical)
        : thp.common(c => c.black))};
    font-size: 1.6rem;
    width: auto;

    ${props => props.errorMessage && css`
        border-color:${thp.system(c => c.critical)};
    `}

    @media ${device.desktop} {
        font-size: 1.4rem;
    }

    &:focus {
        //focus styles
    }

    &:hover {
        //hover styles
    }

    &:disabled {
        //disabled styles
    }

    ::placeholder {
        color: ${thp.neutral(c => c.level50)};
    }

    /* Opcional: Eliminar estilos de input number*/
    &[type=number]::-webkit-outer-spin-button,
    &[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }
    &[type=number] {
        -moz-appearance: textfield;
    }
`


const Input = styled.input <InputProps>`
    ${InputGeneralStyles};
    ${props => props.position === IconPosition.left && css`
        padding-left:32px;
    `}
    ${props => props.leadingLabelWidth && css`
        /* Leading label width + input padding left */
        padding-left:${`${props.leadingLabelWidth + 12}px`};
    `}
    ${props => props.position === IconPosition.right && css`
        padding-right:32px;
    `}
`

type IconContainerProps = {
    position: IconPosition,
}
const IconContainer = styled.div<IconContainerProps>`
    position: absolute;
    top:0;
    bottom: 0;
    width: 12px;
    /* height: 12px; */
    pointer-events: none;
    display: flex;
    place-items: center;
    ${props => props.position === IconPosition.left && css`
        top:11px;
        left:8px;
    `};
     ${props => props.position === IconPosition.right && css`
        top:11px;
        right:8px;
    `};
`

const LeadingLabel = styled.span<{ errorMessage?: boolean, }>`
    font-family:inherit;
    font-size: 1.6rem;
    position: absolute;
    top: 9px;
    left: 8px;
    color: ${props => (props.errorMessage
        ? thp.system(c => c.critical)
        : thp.common(c => c.black))};
    @media ${device.desktop} {
        font-size: 1.4rem;
    }
`

const ErrorWrapper = styled.div`
    display: flex;
    padding-top: 4px;
    width: 100%;
    word-break: break-word;
    color:${thp.system(c => c.critical)};
    align-items: center;
`

const ErrorText = styled.span`
    color:${thp.system(c => c.critical)};
    font-size: 1.4rem;
    line-height: 1.6rem;

    @media ${device.desktop} {
        font-size: 1.2rem;
    }
`
const InputAction = styled.button`
    width: 14px;
    height: 14px;
    outline:none;
    cursor: pointer;
    background: none;
    border:none;
    position: absolute;
    top:10px;
    right:12px;
    z-index:1;

    &:disabled {
        opacity: 0.5;
        cursor:not-allowed;
    }
`

export const InputStyled = {
    InputContainer,
    Input,
    IconContainer,
    LeadingLabel,
    ErrorText,
    ErrorWrapper,
    InputAction,
}