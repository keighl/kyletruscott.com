/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
	Children,
	Fragment,
	FunctionComponent,
	useContext,
	useState,
} from 'react'

import { getValueType, Tree } from './constants'
import Leaf from './Leaf'
import {
	Boundary,
	Gutter,
	Key,
	Separator,
	Comment,
	ToggleButton,
	Ellipsis,
} from './elements'
import BranchContext, {
	BranchContextValue_Index,
	BranchContextValue_Key,
} from './BranchContext'

const delimters = {
	array: {
		open: '[',
		close: ']',
	},
	object: {
		open: '{',
		close: '}',
	},
}

const BranchWrapper: FunctionComponent<{ valueType: Tree.ValueTypeObject }> = ({
	children,
	valueType,
}) => {
	const { type: branchType, branch, depth } = useContext(BranchContext)

	const [open, setOpen] = useState(() => {
		// Hide 'project' nodes initially
		return branch !== 'projects'
	})

	const count = Children.count(children)

	return (
		<div
			css={{
				display: 'flex',
			}}
		>
			<Gutter>
				<ToggleButton
					open={open}
					onClick={() => {
						setOpen(!open)
					}}
				/>
			</Gutter>
			<div
				css={{
					flex: 1,
				}}
			>
				<div>
					{branchType === 'key' && <Key depth={depth}>{branch}</Key>}
					{!open && (
						<span>
							<Boundary>{delimters[valueType].open}</Boundary>
							<Ellipsis />
							<Boundary>{delimters[valueType].close}</Boundary>
							<Separator />
							<Comment>{count} items</Comment>
						</span>
					)}
					{open && <Boundary>{delimters[valueType].open}</Boundary>}
				</div>
				{open && (
					<Fragment>
						<div
							css={{
								paddingLeft: '0em',
								borderLeft: '1px solid #5e81ce52',
								'& > *': {
									marginTop: '0.4em',
								},
							}}
						>
							{children}
						</div>
						<Boundary>{delimters[valueType].close}</Boundary>
						<Separator />
					</Fragment>
				)}
			</div>
		</div>
	)
}

export const BranchObject: Tree.Renderer<Record<string, any>> = ({
	value: objectValue,
}) => {
	const { depth } = useContext(BranchContext)
	return (
		<BranchWrapper valueType="object">
			{Object.keys(objectValue).map((key) => {
				const value = objectValue[key]
				const valueType = getValueType(value)
				const ValueTag = valueMap[valueType] || valueMap.noop
				const ctxValue: BranchContextValue_Key = {
					type: 'key',
					branch: key,
					depth: depth + 1,
				}
				return (
					<BranchContext.Provider value={ctxValue} key={key}>
						<ValueTag value={value} />
					</BranchContext.Provider>
				)
			})}
		</BranchWrapper>
	)
}

export const BranchArray: Tree.Renderer<any[]> = ({ value: values }) => {
	const { depth } = useContext(BranchContext)
	return (
		<BranchWrapper valueType="array">
			{values.map((value, idx) => {
				const valueType = getValueType(value)
				const ValueTag = valueMap[valueType] || valueMap.noop
				const ctxValue: BranchContextValue_Index = {
					type: 'index',
					branch: idx,
					depth: depth + 1,
				}
				return (
					<BranchContext.Provider value={ctxValue} key={idx}>
						<ValueTag value={value} />
					</BranchContext.Provider>
				)
			})}
		</BranchWrapper>
	)
}

const Noop: Tree.Renderer<any> = () => null

const valueMap = {
	object: BranchObject,
	array: BranchArray,
	string: Leaf,
	number: Leaf,
	boolean: Leaf,
	url: Leaf,

	noop: () => Noop,
}
