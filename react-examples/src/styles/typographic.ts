import styled, { css } from "styled-components"
import {
    TextWeight,
    TextAlign,
    getFontWeight,
} from "./typographicHelper"

export const fonts = {
    // eslint-disable-next-line max-len
    primary: "'-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans- serif', sans-serif",
}

type CommonProps = {
    textWeight?: TextWeight,
    textAlign?: TextAlign,
    isCursorPointer?: boolean,
}

const TextStyleBase = () => css<CommonProps>`
	${p => (p.textWeight && getFontWeight(p.textWeight))};
	${p => (p.textAlign && css`text-align: ${p.textAlign};`)};
	${p => (p.isCursorPointer && css`
		cursor: pointer;
	`)}
`

const Heading24 = styled.h2`
	${TextStyleBase}
	font-size:2.4rem;
`
const Body18 = styled.p`
	${TextStyleBase}
	font-size:1.8rem;
`

export const TextStyled = {
    Heading24,
    Body18,
}