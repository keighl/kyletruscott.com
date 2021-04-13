import '@emotion/react'

declare module '@emotion/react' {
	export interface Theme {
		background: string
		color: string
		tree: {
			key: string
			keyRoot: string
			boundary: string
			separator: string
			comment: string
			toggle: string
			value: {
				string: string
				number: string
				boolean: string
				url: string
			}
		}
	}
}
