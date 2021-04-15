import { FunctionComponent } from 'react'

export namespace Tree {
	export type Renderer<T> = FunctionComponent<{
		value: T
	}>

	export type ValueTypeObject = 'object' | 'array'
	export type ValueTypeLiteral = 'string' | 'number' | 'boolean' | 'url'
	export type ValueType =
		| 'object'
		| 'array'
		| 'string'
		| 'number'
		| 'boolean'
		| 'url'
}

export const getValueType = (value: any): Tree.ValueType => {
	if (Array.isArray(value)) {
		return 'array'
	}

	const t = typeof value

	if (t === 'string') {
		try {
			new URL(value as string)
			return 'url'
		} catch (error) {
			// Not a URL
		}
	}

	return t as Tree.ValueType
}
