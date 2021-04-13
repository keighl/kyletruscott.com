/** @jsx jsx */
import { jsx, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { rgba } from 'emotion-rgba'

export const Gutter = styled.span`
	width: 2.5em;
	padding: 0 0.3em;
`

export const Key = styled.span<{ depth: number }>`
	color: ${(props) => {
		console.log(props.depth)

		if (props.depth < 2) {
			return props.theme.tree.keyRoot
		}
		return props.theme.tree.key
	}};
	display: inline-block;
	margin-right: 0.5em;
	font-style: italic;
	&:after {
		content: ':';
	}
`

export const Boundary = styled.span`
	color: ${(props) => props.theme.tree.boundary};
	font-weight: bold;
`

export const Separator = styled.span`
	color: ${(props) => props.theme.tree.separator};
	display: inline-block;
	margin-left: 0.5em;
	&:after {
		content: ',';
	}
`

export const Comment = styled.span`
	color: ${(props) => props.theme.tree.comment};
	margin-left: 1em;
	font-style: italic;
	&:before {
		content: '// ';
	}
`

export const Ellipsis = styled.span`
	color: ${(props) => props.theme.tree.comment};
	margin-left: 1em;
	margin-right: 1em;
	&:after {
		content: '\u2026';
	}
`

export const ToggleButton: FC<
	ButtonHTMLAttributes<HTMLButtonElement> & {
		open: boolean
	}
> = ({ open, ...props }) => {
	const theme = useTheme()
	return (
		<button
			aria-label={open ? 'Close object' : 'Open object'}
			css={{
				background: 0,
				border: 0,
				cursor: 'pointer',
				width: '100%',
				padding: '0 0.25em',
				outline: 'none',
				'&:focus': {
					background: `${rgba(theme.tree.toggle, 0.3)}`,
				},
			}}
			{...props}
		>
			<div
				css={{
					height: '1.4em',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					'&::after': {
						display: 'block',
						content: '" "',
						width: 0,
						height: 0,
						borderStyle: 'solid',
						borderWidth: '8px 4px 0 4px',
						borderColor: `${theme.tree.toggle} transparent transparent transparent`,
						transform: open ? 'none' : 'rotate(-90deg)',
						transition: 'transform 150ms ease-in-out',
					},
				}}
			/>
		</button>
	)
}
