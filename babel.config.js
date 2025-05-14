module.exports = {
	presets: [
		'@babel/preset-env',
		'@babel/preset-react', // if you're using React
	],
	plugins: [
		[
			'@locator/babel-jsx/dist',
			{
				env: 'development',
			},
		],
	],
};
