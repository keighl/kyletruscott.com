/** @jsx jsx */
import { FunctionComponent, useContext, useMemo } from 'react'
import { jsx } from '@emotion/react'
import styled from '@emotion/styled'

import { getValueType, Tree } from './constants'
import BranchContext from './BranchContext'
import { Key, Separator, Gutter } from './elements'

const VString = styled.span`
	color: ${(props) => props.theme.tree.value.string};
	&:before,
	&:after {
		content: "'";
	}
`

const VNumber = styled.span`
	color: ${(props) => props.theme.tree.value.number};
	font-weight: bold;
`

const VBoolean = styled.span`
	color: ${(props) => props.theme.tree.value.boolean};
	font-weight: bold;
`

const VAnchor = styled.a`
	color: ${(props) => props.theme.tree.value.url};
	text-decoration: none;
	font-weight: bold;
`

const RenderLeaf: FunctionComponent<{
	value: any
	valueType: Tree.ValueTypeLiteral
}> = ({ value, valueType }) => {
	if (valueType === 'url') {
		return <VAnchor href={value}>{value}</VAnchor>
	}

	if (valueType === 'string') {
		return <VString>{value}</VString>
	}

	if (valueType === 'boolean') {
		return <VBoolean>{JSON.stringify(value)}</VBoolean>
	}

	return <VNumber>{value}</VNumber>
}

const Leaf: Tree.Renderer<number | string | boolean> = ({ value }) => {
	const { type: branchType, branch, depth } = useContext(BranchContext)

	const valueType = useMemo(() => {
		return getValueType(value) as Tree.ValueTypeLiteral
	}, [value])

	return (
		<div
			css={{
				display: 'flex',
			}}
		>
			<Gutter />
			<div
				css={{
					flex: 1,
				}}
			>
				{branchType === 'key' && <Key depth={depth}>{branch}</Key>}
				<RenderLeaf value={value} valueType={valueType} />
				<Separator />
			</div>
		</div>
	)
}

export default Leaf
