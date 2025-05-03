require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: process.env.REACT_APP_DEV_ENVIRONMENT || 'development',
	entry: path.join(__dirname, 'src', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		clean: true, // Removes old files from the build folder
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolves imports without specifying extensions
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public', 'index.html'),
			templateParameters: {
				PUBLIC_URL: '.', // Use a valid public path instead of the placeholder
			},
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env), // <-- Add this plugin
		}),
	],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							['@babel/preset-react', { runtime: 'automatic' }],
						],
					},
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.s[ac]ss$/i, // Matches both .scss and .sass files
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
						},
					},
				],
			},
			{
				// Convert SVGs into React components with a URL fallback.
				test: /\.svg$/,
				issuer: /\.[jt]sx?$/,
				use: [
					{
						loader: '@svgr/webpack',
						options: {
							prettier: false,
							svgo: false,
							svgoConfig: {
								plugins: [{ removeViewBox: false }],
							},
							titleProp: true,
							ref: true,
						},
					},
					{
						loader: 'file-loader',
						options: {
							name: 'static/media/[name].[hash].[ext]',
						},
					},
				],
			},
			{
				// Handles image files (png, jpg, jpeg, gif)
				test: /\.(png|jpe?g|gif)$/i,
				type: 'asset/resource', // Emits the file and returns the URL
			},
		],
	},
	devServer: {
		port: 8000,
		hot: true, // Enables Hot Module Replacement
		static: path.resolve(__dirname, 'public'), // Serves static files from the public folder
		historyApiFallback: true, // Enables SPA routing
		client: {
			overlay: {
				warnings: false,
				errors: false,
			},
		},
	},
	ignoreWarnings: [
		{
			module: /sass\.dart\.js/,
		},
	],
};
