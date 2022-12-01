import { createGlobalStyle } from "styled-components"

export const ResetStyled = createGlobalStyle`
	body,
	h1,
	h2,
	h3,
	h4,
	p,
	figure,
	blockquote,
	dl,
	ul,
	ol,
	div,
	section,
	article,
	dd {
		margin: 0;
		padding: 0;
	}
	main {
		display: block;
	}
	ul,ol{
	  list-style: none;
	}
	img,
	picture{
		max-width: 100%;
		display: block;
		border-style: none;
	}
	button,
	select{
		text-transform: none;
	}
	input,
	button,
	textarea,
	select {
		font: inherit;
		margin: 0;
		font-size: 100%;
	}
	button,
	[type='button'],
	[type='reset'],
	[type='submit'] {
		-webkit-appearance: button;
	}
	textarea {
		overflow: auto;
	}
	button::-moz-focus-inner,
	[type='button']::-moz-focus-inner,
	[type='reset']::-moz-focus-inner,
	[type='submit']::-moz-focus-inner {
		border-style: none;
		padding: 0;
	}
	[type='checkbox'],
	[type='radio'] {
		box-sizing: border-box;
		padding: 0;
	}
	[type='number']::-webkit-inner-spin-button,
	[type='number']::-webkit-outer-spin-button {
		height: auto;
	}
	[type='search'] {
		-webkit-appearance: textfield; /* 1 */
		outline-offset: -2px; /* 2 */
	}
	[type='search']::-webkit-search-decoration {
		-webkit-appearance: none;
	}
	::-webkit-file-upload-button {
		-webkit-appearance: button; /* 1 */
		font: inherit; /* 2 */
	}
	a {
		background-color: transparent;
	}
	@media (prefers-reduced-motion: reduce) {
		html:focus-within {
		scroll-behavior: auto;
		}
		html{
			scroll-behavior: auto;
		}
		body{
			scroll-behavior: auto;
		}
		*,
		*::before,
		*::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}
`