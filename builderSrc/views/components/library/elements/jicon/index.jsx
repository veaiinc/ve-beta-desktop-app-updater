import React, { Component } from 'react';
import './jIcon.scss';
import { journeyIcons } from './journeyIcons';

class JIcon extends Component {
	constructor(props) {
		super();
		this.state = {
			preview: props?.preview,
			previewType: props?.previewType,
			cardColor: props?.cardColor,

			icon: props?.icon,
			color: props?.color,
			size: props?.size,
			mSize: props?.mSize,
			properties: props?.properties,
			containerSize: 0,
		};
		this.iconRef = React.createRef();
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.cardColor !== nextProps.cardColor) {
			this.setState({
				cardColor: nextProps.cardColor,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}

		if (this.state.icon !== nextProps.icon) {
			this.setState({
				icon: nextProps.icon,
			});
		}
		if (this.state.color !== nextProps.color) {
			this.setState({
				color: nextProps.color,
			});
		}
		if (this.state.size !== nextProps.size) {
			this.setState({
				size: nextProps.size,
			});
		}
		if (this.state.properties !== nextProps.properties) {
			this.setState({
				properties: nextProps.properties,
			});
		}
		if (this.state.mSize !== nextProps.mSize) {
			this.setState({
				mSize: nextProps.mSize,
			});
		}
	};
	setIconHeight = () => {
		if (this.iconRef.current) {
			const iconHeight = this.iconRef.current.clientHeight;
			const iconWidth = this.iconRef.current.clientWidth;
			const containerSize = Math.max(iconHeight, iconWidth);
			this.setState({ containerSize });
		}
	};
	componentDidMount() {
		this.setIconHeight();
	}
	componentDidUpdate(prevProps, prevState) {
		if (
			this.iconRef.current &&
			(prevState.size !== this.state.size ||
				prevState.mSize !== this.state.mSize ||
				prevState.previewType !== this.state.previewType)
		) {
			this.setIconHeight();
		}
	}

	handleOnClick = async () => {
		this.props?.client == true
			? [
					this.props.properties?.linkType === 'url'
						? window.open(
								this.props?.properties?.linkUrl?.startsWith('http')
									? this.props?.properties?.linkUrl
									: `https://${this.props?.properties?.linkUrl}`,
								'_blank',
						  )
						: this.props?.properties?.linkType === 'section'
						? [
								await this.props.getModuleInfo(
									this.props?.properties?.linkModuleId,
									this.props?.properties?.linkModuleType,
								),

								await setTimeout(() => {
									this.props.scrollToSection(this.props?.properties?.sectionId);
								}, 500),
						  ]
						: '',
			  ]
			: [this.props?.setTab('ji')];
	};

	render() {
		// Filter icons based on search term
		const filteredIcons = journeyIcons?.filter((icon1) =>
			icon1.name?.toLowerCase().includes(this.state?.icon?.toLowerCase()),
		);

		const firstMatchedIcon = filteredIcons[0]?.svg;
		const getUpdatedSvg = (svg, color, size) => {
			const hasFill = /fill="[^"]*"/.test(svg);
			const hasStroke = /stroke="[^"]*"/.test(svg);
			const hasWidth = /width="[^"]*"/.test(svg);
			const hasHeight = /height="[^"]*"/.test(svg);
			const hasStrokeWidth = /stroke-width="[^"]*"/.test(svg);

			// Extract the original stroke-width value
			let originalStrokeWidth = null;
			if (hasStrokeWidth) {
				const match = svg.match(/stroke-width="([^"]*)"/);
				if (match) {
					originalStrokeWidth = match[1]; // Save the original stroke-width value
				}
			}
			// Replace `fill` only if it's present and not "none"
			if (hasFill) {
				svg = svg.replace(/fill="[^"]*"/g, (match) =>
					match.includes('none') ? match : `fill="${color}"`,
				);
			}

			// Replace `stroke` only if it's present and not "none"
			if (hasStroke) {
				svg = svg.replace(/stroke="[^"]*"/g, (match) =>
					match.includes('none') ? match : `stroke="${color}"`,
				);
			}
			if (hasWidth) {
				svg = svg.replace(/width="[^"]*"/g, `width="${size}"`);
			} else {
				// Add `width` if not present
				svg = svg?.replace(/<svg/, `<svg width="${size}"`);
			}

			// Update `height` if it's present
			if (hasHeight) {
				svg = svg.replace(/height="[^"]*"/g, `height="${size}"`);
			} else {
				// Add `height` if not present
				svg = svg?.replace(/<svg/, `<svg height="${size}"`);
			}
			if (originalStrokeWidth) {
				if (hasStrokeWidth) {
					svg = svg.replace(
						/stroke-width="[^"]*"/g,
						`stroke-width="${originalStrokeWidth}"`,
					);
				} else {
					svg = svg.replace(/<svg/, `<svg stroke-width="${originalStrokeWidth}"`);
				}
			}

			return svg;
		};
		return (
			<>
				{this.props?.isFluid ? (
					<div
						className={`fluid-j-icon-container `}
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: this.props?.extraStyles?.verticalAlign || 'center',
							alignItems:
								this.props?.extraStyles?.align == 'left'
									? 'flex-start'
									: this.props?.extraStyles?.align == 'right'
									? 'flex-end'
									: 'center',
						}}
						onClick={() => this.handleOnClick()}
					>
						<div
							className={`fluid-j-icon-container j-icon-${this.props?.extraStyles?.bgType}`}
							style={{
								backgroundColor: this.props?.isFluid
									? this.props?.extraStyles?.bgType != 'none' &&
									  this.props?.extraStyles?.bgStyle == 'solid'
										? this.state?.cardColor
										: 'transparent'
									: this.state?.cardColor,
								color: this.state?.color,
								border:
									this.props?.extraStyles?.bgStyle == 'outline' &&
									this.props?.isFluid
										? `${this.props?.extraStyles?.thickness}px solid ${this.state?.color}`
										: 'none',
								minWidth: `${this.state.containerSize}px`,
								minHeight: `${this.state.containerSize}px`,
								width: 'auto',
								height: 'auto',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding:
									parseFloat(
										this.state?.previewType == 'm'
											? this.state?.mSize / 10 + 5
											: this.state?.size / 10 + 5,
									) || '6px',
							}}
						>
							<div
								ref={this.iconRef}
								dangerouslySetInnerHTML={{
									__html: getUpdatedSvg(
										firstMatchedIcon,
										this.state?.color,
										this.state?.previewType == 'm'
											? this.state?.mSize
											: this.state?.size,
									),
								}}
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							></div>
						</div>
					</div>
				) : (
					<>
						<div
							className={`j-icon-container`}
							style={{
								backgroundColor: this.state?.cardColor,
								color: this.state?.color,
								zoom: this.state?.previewType === 'm' && 0.6,
								width: `${this.state.containerSize}px`,
								height: `${this.state.containerSize}px`,
							}}
							onClick={() => this.handleOnClick()}
						>
							<div
								ref={this.iconRef}
								dangerouslySetInnerHTML={{
									__html: getUpdatedSvg(
										firstMatchedIcon,
										this.state?.color,
										this.state?.size,
									),
								}}
							></div>
						</div>
					</>
				)}
			</>
		);
	}
}

export default JIcon;
