module.exports = {
	siteMetadata: {
		title: 'Kyle Truscott',
	},
	plugins: [
		'gatsby-plugin-emotion',
		'gatsby-plugin-sass',
		{
			resolve: `gatsby-plugin-google-gtag`,
			options: {
				trackingIds: ['G-5XEZL81G65'],
				exclude: [],
			},
		},
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `kyletruscott`,
				short_name: `kyletruscott`,
				start_url: `/`,
				display: `minimal-ui`,
				icon: `src/images/favicon.png`,
			},
		},
	],
}
