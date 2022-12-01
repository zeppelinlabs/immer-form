import styled, { css } from "styled-components"
import { device } from "../../../styles/mediaQueries"
import { thp } from "../../../styles/themeHelpers"

type PropsStyled = {
    errorMessage?: string | null,
    autoHeight?: boolean,
}

const TextAreaContainer = styled.div`
    position: relative;
    display:flex;
    flex-direction:column;
`

const TextArea = styled.textarea<PropsStyled>`
    background: ${thp.common(c => c.white)};
    border: 1px solid ${thp.common(c => c.black)};
    border-color: ${props => (props.errorMessage && thp.system(c => c.critical) )};
    box-sizing: border-box;
    padding: 8px 12px;
    color: ${props => (props.errorMessage
        ? thp.system(c => c.critical) : thp.common(c => c.black))};
    font-size: 1.6rem;
    max-width: 100%;
    resize: none;
    width: auto;
    line-height: 1.5;
    min-height: 50px;

    @media ${device.desktop} {
        width: auto;
        font-size: 1.4rem;
    }
    ${props => props.autoHeight && css`
        overflow: hidden;
    `}

    &:focus {
        //focus styles
    }

    &:hover {
        //hover styles
    }

    &:disabled {
        //disabled styles
        cursor: not-allowed;
        opacity: 0.5;
    }

    ::placeholder {
        color: ${thp.neutral(c => c.level50)};
    }


`

type CharacterCountProps = {
    reachesTheLimit: boolean,
}

const CharacterCount = styled.span<CharacterCountProps>`
    font-size:1.2rem;
    line-height: 1.4rem;
    color: ${props => (props.reachesTheLimit
        ? thp.system(c => c.critical)
        : thp.common(c => c.black))};
    margin:4px 0px;
    text-align: right;
    max-height: 14px;
`

export const TextAreaStyled = {
    TextArea,
    CharacterCount,
    TextAreaContainer,
}