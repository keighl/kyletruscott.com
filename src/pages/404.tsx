/** @jsx jsx */
import { jsx, ThemeProvider } from '@emotion/react'
import { FunctionComponent } from 'react'
import { PageProps } from 'gatsby'

import { media, themes } from '../style'
import Tree from '../components/Tree'
import '../style/main.scss'

type Props = PageProps & {}

const NotFoundPage: FunctionComponent<Props> = () => {
	return (
		<ThemeProvider theme={themes.dark}>
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
					<Tree data={{ status: { code: 404, message: 'Not found' } }} />
				</div>
			</div>
		</ThemeProvider>
	)
}

export default NotFoundPage
