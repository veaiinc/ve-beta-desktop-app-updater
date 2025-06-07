import React, { Component } from 'react';

class DownloadPDF extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sizeValues: {
				small: '16',
				medium: '24',
				large: '32',
			},
		};
	}

	render() {
		const { fillColor = '#8B75BA', iconSize = 'medium', style, onClick } = this.props;
		const size = this.state.sizeValues[iconSize] || this.state.sizeValues.medium;

		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={'24px'}
				height={'20px'}
				fill="none"
				style={style}
				onClick={onClick}
			>
				<g
					stroke={fillColor}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					clipPath="url(#download_svg__a)"
				>
					<path d="M12 13.5V3M20.25 13.5v6H3.75v-6" />
					<path d="M15.75 9.75 12 13.5 8.25 9.75" />
				</g>
				<defs>
					<clipPath id="download_svg__a">
						<path fill="#fff" d="M0 0h24v24H0z" />
					</clipPath>
				</defs>
			</svg>
		);
	}
}

export default DownloadPDF;
