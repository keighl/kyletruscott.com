/** @jsx jsx */
import { FunctionComponent } from 'react'
import { jsx } from '@emotion/react'

import { BranchObject } from './Branch'
import BranchContext from './BranchContext'
import { media } from '../../style'

type Props = {
	data: Record<string, any>
}

const TreeRoot: FunctionComponent<Props> = ({ data }) => {
	return (
		<div
			css={{
				fontFamily: "'Hack', monospace",
				fontSize: '0.75rem',
				lineHeight: '1.4em',
				[media.mediumUp]: {
					fontSize: '15px',
				},
			}}
		>
			<BranchContext.Provider
				value={{
					type: 'root',
					branch: null,
					depth: 0,
				}}
			>
				<BranchObject value={data} />
			</BranchContext.Provider>
		</div>
	)
}

export default TreeRoot
