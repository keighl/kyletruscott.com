import { Theme } from '@emotion/react'

export const media = {
	small: '@media (max-width: 767px)',
	medium: '@media (min-width: 768px) and (max-width: 1023px)',
	mediumUp: '@media (min-width: 768px)',
	large: '@media (min-width: 1024px)',
}

export const theme = 2
export const themex = true

export const themes: Record<string, Theme> = {
	// dark: {
	// 	background: '#002C37',
	// 	color: '#7f9596',
	// 	tree: {
	// 		key: '#7f9596',
	// 		boundary: '#008bd8',
	// 		separator: '#7f9596',
	// 		comment: '#4a7075',
	// 		toggle: '#4A7075',
	// 		value: {
	// 			string: '#00a498',
	// 			number: '#809600',
	// 			boolean: '#809600',
	// 			url: '#e51584',
	// 		},
	// 	},
	// },
	dark: {
		background: '#011627',
		color: '#ECC48D',
		tree: {
			keyRoot: '#C792EA',
			key: '#d6deeb',
			boundary: '#d6deeb',
			separator: '#d6deeb',
			comment: '#637777',
			toggle: '#4A7075',
			value: {
				string: '#ECC48D',
				number: '#F78C6C',
				boolean: '#FF5874',
				url: '#C5E478',
			},
		},
	},
}
