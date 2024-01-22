const data: Record<string, any> = {
	name: 'Kyle Truscott',
	desc:
		'Full-stack software and design leader with a specialty in bridging complex gaps between technology and user-experience.',
	github: 'https://github.com/keighl',
	linkedin: 'https://www.linkedin.com/in/kyle-truscott/',
	location: 'Fairfield, CT, USA',
	technology: [
		'typescript/node',
		'react',
		'nextjs',
		'figma-plugins',
		'ruby',
		'html/css',
		'tailwind',
		'many others...',
	],
	design: ['ux-innovation', 'product-design', 'ui-systems'],

	recent_work: [
		{
			name: 'Google Labs - Camera UI/UX Prototype',
			duration: 'January 2024',
			role: 'Lead Engineer [Contract]',
			techonlogy: [
				'typescript',
				'tensorflow',
				'chrome-media-apis',
				'web-components',
				'flutter',
			],
			desc: ['Engineered experiemental web-based camera application'],
		},
		{
			name: 'GlossGenius - Figma System Design',
			role: 'UI Design Consultant [Contract]',
			duration: 'Q4 2023',
			technology: ['figma', 'react'],
			desc: [
				'Revamped the GlossGenius internal Figma design system using the latest tools and best practices to facilitate fast innovation',
				'Worked closely with Gloss Genius engineers to guide their implementation of the new system for strong designer/developer workflows',
			],
		},
		{
			name: 'Medely - Website Development',
			role: 'Engineering Director [Contract]',
			duration: 'Q4 2023',
			technology: ['typescript', 'react', 'nextjs', 'tailwind', 'prismic'],
			desc: [
				'Engineered highly composable website built with React/Typescript/Next powered by a headless Prismic backend',
				'Orchestrated designer constraints in Figma and maintained parity between design components and developer components',
				'Developed scalable theming system that spans most content modules for visual flexibility',
			],
			url: 'https://medely.com/',
		},
		{
			name: 'Coinbase Design System',
			role: 'Design Director',
			duration: 'Summer/Fall 2023',
			desc: [
				'Worked alongside Coinbase designers to improve internal Figma component systems',
				'Guided junior designers across multiple 	workstreams',
				'Generated UX concepts for internationalized onboarding flows',
			],
		},
		{
			name: 'Unqork - Wealth Management Platform',
			role: 'Design Director',
			duration: 'Spring 2023',
			desc: [
				'Designed a white-label application for wealth custodians to onboard and service banking customers.',
				'Interfaced with internal and external stakeholders to align on strategic vision',
				'Led divergent design rounds to establish scalable UX principles',
			],
		},
		{
			name: 'Toyota - Woven City Gate Kiosk',
			role: 'Design Director',
			duration: 'Fall 2022',
			desc: [
				'Led hands-on team of 3 designers to create comprehensive entryway experience for Woven City',
				'Directed the team to high creative output and divergent concepts',
				'Influenced the UX direction for other systems and applications within the city',
				'Collaborated with Toyota engineering to align on vision for how “Woven ID” data and systems will operate',
			],
		},
		{
			name: 'Credit Karma - UI Library & Figma Plugin',
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
			name: 'Tiyaro - MVP Product Design',
			role: 'Design Director',
			duration: 'Winter 2021',
			desc: [
				'Designed Tiyaro’s MVP web application for self-service AI integration',
				'Defined experience principles for the company’s initial offering, and honed strategic product approach',
				'Crafted Tiaryo’s visual brand',
				'Guided internal AI team on web service architecture and developer experience',
				'Orchestrated user-testing with potential customers',
			],
		},
		{
			name: 'Unqork - UI Design System',
			role: 'Designer / Engineer',
			duration: '2020',
			desc: [
				'Architected composable design system to unlock UX design efficiency',
				'Collaborated with design and engineering stakeholders to maintain cross-disciplinary parity for naming, purpose and workflow',
				'Guided both designers and engineers during implementation; provided code reviews and feedback for Unqork engineering',
				'Led documentation effort to ensure clarity and comprehension of the system ',
			],
			technology: ['typescript', 'react', 'storybook', 'figma'],
		},

		{
			project: 'eBay - Asset Maker',
			role: 'Lead Engineer',
			desc: [
				'Architected and implemented a specialized application for internal graphics production at ebay.',
				'Worked alongside design lead to determine UX principles and key workflows',
				'Designed a Salesforce-based storage API with internal ebay engineers',
				'Collaborated with stakeholders to set project scope and cadence',
			],
			technology: [
				'typescript',
				'react',
				'pdfkit',
				'fabricjs',
				'canvas',
				'salesforce',
			],
		},
		{
			project: 'eBay - Brand Playbook',
			role: 'Lead Engineer',
			desc: [
				'Engineered the large internal branding/design portal inside eBay that serves thousands of user across the company with information, tools and resources',
				'Contributed to design work including IA, content layout and prototyping',
			],
			technology: ['typescript', 'react', 'pdfkit', 'prismic', 'salesforce'],
		},
		{
			project: 'eBay - Color Tools',
			role: 'Lead Engineer',
			technology: ['typescript', 'react'],
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
		},
	],
}

export default data
