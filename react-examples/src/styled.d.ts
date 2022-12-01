import "styled-components"

interface IPaletteCommon {
	black: string;
	white: string;
}

interface IPalettePrimaryLevels {
	level90: string;
	level50: string;
	level10: string;
}
interface IPaletteNeutralLevels {
	level90: string;
	level50: string;
	level10: string;
}
interface IPaletteSystemLevels {
	info: string;
	warning: string;
	success: string;
	critical: string;
}

declare module "styled-components" {
	export interface DefaultTheme {
		palette: {
			common: IPaletteCommon,
			primary: IPalettePrimaryLevels,
			neutral: IPaletteNeutralLevels,
			system: IPaletteSystemLevels,
		};
	}
}
