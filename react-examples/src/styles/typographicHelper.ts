import { css } from "styled-components"

export enum TextWeight {
    ExtraBold = "extraBold",
    Bold = "bold",
    SemiBold = "semiBold",
    Regular = "regular",
    Light = "regular",
}
export enum TextAlign {
    Left = "left",
    Center = "center",
    Right = "right",
}

export const getFontWeight = (weight: TextWeight) => {
    const weightByCase = {
        [TextWeight.ExtraBold]: (800),
        [TextWeight.Bold]: (700),
        [TextWeight.SemiBold]: (600),
        [TextWeight.Regular]: (400),
        [TextWeight.Light]: (100),
    }
    return css`font-weight: ${weightByCase[weight]};`
}