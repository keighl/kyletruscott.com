const data: Record<string, any> = {
	name: 'Kyle Truscott',
	openToWork: true,
	desc:
		'Full-stack software and design leader with a specialty in bridging complex gaps between technology and user-experience.',
	latestRole: {
		role: 'Senior Engineering Director',
		company: 'https://freeassociation.com',
		range: [2018, 2023]
	},
	github: 'https://github.com/keighl',
	location: 'Fairfield, CT, USA',
	attributes: {
		leadership: ['design-direction', 'tech-direction', 'product-strategy'],
		engineering: [
			'design-tools',
			'web-development',
			'app-development',
			'backend-systems',
			'build-tooling',
			'automation',
		],
		design: ['ux-design', 'prototyping', 'research', 'workshops'],
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
			customer: 'Coinbase',
			project: {
				name: 'Coinbase Design System',
				role: 'Design Director',
				duration: 'Summer/Fall 2023',
				desc: [
					'Worked alongside Coinbase designers to improve internal Figma component systems',
					'Guided junior designers across multiple workstreams',
					'Generated UX concepts for internationalized onboarding flows',
				],
			},
		},
		{
			customer: 'Unqork',
			project: {
				name: 'Wealth Management Platform',
				role: 'Design Director',
				duration: 'Spring 2023',
				desc: [
					'Designed a white-label application for wealth custodians to onboard and service banking customers.',
					'Interfaced with internal and external stakeholders to align on strategic vision',
					'Led divergent design rounds to establish scalable UX principles',
				],
			},
		},
		{
			customer: 'Toyota',
			project: {
				name: 'Woven City Gate Kiosk',
				role: 'Design Director',
				duration: 'Fall 2022',
				desc: [
					'Led hands-on team of 3 designers to create comprehensive entryway experience for Woven City',
					'Directed the team to high creative output and divergent concepts',
					'Influenced the UX direction for other systems and applications within the city',
					'Collaborated with Toyota engineering to align on vision for how “Woven ID” data and systems will operate',
				],
			},
		},
		{
			customer: 'Credit Karma',
			project: {
				name: 'UI Library & Figma Plugin',
				role: 'Design Lead / Engineer',
				duration: 'Summer 2022',
				desc: [
					'Constructed new internal data visualization UI library to empower product innovation within Credit Karma',
					'Led team towards a designer experience that emphasizes composability and creativity',
					'Design and engineered custom internal Figma plugin to assist and educate CK designers while using the new library',
				],
				tech: ['typescript', 'figma-apis'],
				url: 'https://www.freeassociation.com/work/credit-karma',
			},
		},
		{
			name: 'Sticky Loops',
			type: 'Figma Plugin',
			url:
				'https://www.figma.com/community/plugin/1111690296935263941/Sticky-Loops',
			desc: [
				'A creative audio plugin which interprets Figjam sticky notes into drum machine loops',
			],
			tech: ['typescript', 'figma-apis', 'audiocontext', 'tonejs'],
		},
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
