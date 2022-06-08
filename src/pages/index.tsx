/** @jsx jsx */
import { jsx, ThemeProvider } from '@emotion/react'
import { FunctionComponent } from 'react'
import { PageProps } from 'gatsby'
import Helmet from 'react-helmet'

import { media, themes } from '../style'
import data from '../data'
import Tree from '../components/Tree'
import '../style/main.scss'

type Props = PageProps & {}

const HomePage: FunctionComponent<Props> = ({}) => {
	return (
		<ThemeProvider theme={themes.dark}>
			<Helmet>
				<title>Kyle Truscott - Developer/Designer</title>
				<html lang="en" />
				<meta name="description" content={data.desc} />
				<meta property="og:description" content={data.desc} />
			</Helmet>
			<div
				css={{
					padding: '1.5rem',
					[media.mediumUp]: {
						padding: '7rem 1.5rem',
					},
				}}
			>
				<div
					css={{
						margin: '0 auto',
						[media.mediumUp]: {
							padding: '0 4rem',
							maxWidth: '60rem',
						},
					}}
				>
					<Tree data={data} />
				</div>
			</div>
		</ThemeProvider>
	)
}

export default HomePage
