import { createContext } from 'react'

export type BranchContextValue_Key = {
	type: 'key'
	depth: number
	branch: string
}

export type BranchContextValue_Index = {
	type: 'index'
	depth: number
	branch: number
}

export type BranchContextValue_Root = {
	type: 'root'
	depth: 0
	branch: null
}

export type BranchContextValue =
	| BranchContextValue_Key
	| BranchContextValue_Index
	| BranchContextValue_Root

const BranchContext = createContext<BranchContextValue>({
	type: 'root',
	depth: 0,
	branch: null,
})

export default BranchContext
