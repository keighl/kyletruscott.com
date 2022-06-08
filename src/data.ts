const data: Record<string, any> = {
	name: 'Kyle Truscott',
	desc:
		'Full-stack software and design leader with a specialty in bridging complex gaps between technology and user-experience.',
	current: {
		company: 'https://freeassociation.is',
		role: 'Senior Engineering Director',
	},
	github: 'https://github.com/keighl',
	location: ['CT, USA', [41.142458, -73.233067]],
	specialties: {
		engineering: [
			'design-systems',
			'design-tools',
			'application-development',
			'APIs',
			'build-tooling',
			'automation',
		],
		design: ['ux-design', 'prototyping', 'research', 'workshops'],
		leadership: ['tech-direction', 'product-strategy'],
	},
	technology: [
		'node',
		'typescript',
		'react',
		'ruby',
		'golang',
		'swift',
		'+ many others',
	],

	recent_work: [
		{
			name: 'Selective Surgery',
			type: 'Figma Plugin',
			url: 'https://www.figma.com/community/plugin/1023301829529134737',
			desc: [
				'Designed and engineered a specicalized Figma plugin for smart batch selection of deeply nested layers',
				'Leveraged the plugin to promote design software and tooling at Free Association',
			],
			tech: ['typescript', 'figma-apis'],
		},
		{
			customer: ['Tiyaro', 'https://www.tiyaro.ai/'],
			project: {
				role: 'Design Director',
				duration: 'Winter 2021',
				desc: [
					'Designed Tiyaro’s MVP web application for self-service AI integration',
					'Defined experience principles for the company’s initial offering, and honed strategic product approach',
					'Crafted Tiaryo’s visual brand',
					'Guided internal AI team on web service architecture and developer experience',
					'Orchestrated user-testing with potential customers',
				],
				attrs: {
					design: true,
					leadership: true,
				},
			},
		},
		{
			customer: ['Unqork', 'https://www.unqork.com/'],
			projects: [
				{
					duration: '2020-present',
					desc: [
						'Architected composable design system to unlock UX design efficiency',
						'Collaborated with design and engineering stakeholders to maintain cross-disciplinary parity for naming, purpose and workflow',
						'Guided both designers and engineers during implementation; provided code reviews and feedback for Unqork engineering',
						'Led documentation effort to ensure clarity and comprehension of the system ',
					],
					technology: ['typescript', 'react', 'storybook', 'figma'],
					attrs: {
						engineering: true,
						design: true,
						leadership: true,
					},
				},
			],
		},
		{
			customer: 'eBay',
			projects: [
				{
					project: 'Asset Maker',
					desc: [
						'Architected and implemented a specialized application for internal graphics production at ebay.',
						'Worked alongside design lead to determine UX principles and key workflows',
						'Designed a Salesforce-based storage API with internal ebay engineers',
						'Collaborated with stakeholders to set project scope and cadence',
					],
					technology: ['typescript', 'react', 'pdfkit', 'fabricjs', 'canvas'],
					attrs: {
						engineering: true,
						design: true,
						leadership: true,
					},
				},
				{
					project: 'Brand Playbook',
					desc: [
						'Engineered the large internal branding/design portal inside eBay that serves thousands of user across the company with information, tools and resources',
						'Contributed to design work including IA, content layout and prototyping',
					],
					technology: [
						'typescript',
						'react',
						'pdfkit',
						'prismic',
						'salesforce',
					],
					attrs: {
						engineering: true,
						design: true,
						leadership: true,
					},
				},
				{
					project: 'Color Tooling',
					desc: [
						'Built several internal software tools to empower designers and developers to better leverage the complex eBay color system',
						{
							name: 'Color API',
							desc:
								'Designed and implemented internal color Node package that exposes pre-parsed color data and utility methods',
						},
						{
							name: 'Color Layering Tool',
							desc:
								'Engineered a popular internal tool in React that assists designers in choosing color combinations that meet both accessibility and branding requirements',
						},
						{
							name: 'Color Blocking Tool',
							desc:
								'Developed a generative program and UI for assembling eBay’s signature “color block” brand marks. Written in Node and React, the templating and color engine has been integrated into different systems across ebay.',
						},
					],
					attrs: {
						engineering: true,
						design: true,
						leadership: true,
					},
				},
			],
		},
	],
}

export default data
