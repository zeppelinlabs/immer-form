import { DefaultTheme, ThemeProps } from "styled-components"
import { defaultTheme } from "./defaultTheme"

type ThemeKeys = keyof DefaultTheme["palette"]
type ThemeHelper<k extends ThemeKeys> = <T>(f: (params: DefaultTheme["palette"][k]) => T) => T
type ThemeHelpers = {
    [K in ThemeKeys]: ThemeHelper<K>;
}
export const thp: ThemeHelpers = Object.keys(defaultTheme.palette).reduce((acc, k) => {
    const Ktyped = k as ThemeKeys
    return {
        ...acc,
        [k]: <T>(f: (palette: DefaultTheme["palette"][typeof Ktyped]) => T) =>
            (props: ThemeProps<DefaultTheme>) => f(props.theme.palette[Ktyped]),
    }
}, {} as ThemeHelpers)

export type AlertLevel = Extract<ThemeKeys, "info" | "warning" | "success" | "critical">;