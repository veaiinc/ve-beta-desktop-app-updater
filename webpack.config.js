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
		clean: true,
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public', 'index.html'),
			templateParameters: {
				PUBLIC_URL: '.',
			},
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env),
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
				test: /\.module\.s[ac]ss$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[local]__[hash:base64:5]',
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
						},
					},
				],
			},
			{
				test: /\.s[ac]ss$/i,
				exclude: /\.module\.s[ac]ss$/i,
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
				test: /\.(png|jpe?g|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	devServer: {
		port: 8000,
		hot: true,
		static: path.resolve(__dirname, 'public'),
		historyApiFallback: true,
		client: {
			overlay: {
				warnings: false,
			},
		},
	},
	ignoreWarnings: [
		{
			module: /sass\.dart\.js/,
		},
	],
};
