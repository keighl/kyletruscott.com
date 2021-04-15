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
	],
}
