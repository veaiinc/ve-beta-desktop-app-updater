import React, { Component } from 'react';

import './scrolltext.scss';

class ScrollText extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
		this.speeds = {
			fast: 3.5,
			medium: 2.5,
			slow: 1.5,
		};
		const initialFontSize = props.fontStyles?.fontSize || 24;
		const initialHeight = this.calculateCanvasHeight(initialFontSize);
		const initialCenterY = this.calculateCenterY(initialHeight, initialFontSize);
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			previewType: props.previewType,

			width: props.width || 1100,
			scrollStyles: props.scrollStyles,
			intensity: props.scrollStyles?.intensity,
			speed: this.speeds[props.scrollStyles?.speed || 'medium'],
			direction: props.scrollStyles?.direction || 'left',
			spacing: props.scrollStyles?.spacing || 2,
			fade: props.scrollStyles?.fade || false,
			pauseOnHover: props.scrollStyles?.pauseOnHover || false,
			blur: props.scrollStyles?.blur || false,
			blurType: props.scrollStyles?.blurType || 'background',
			blurAmount: props.scrollStyles?.blurAmount || 5,
			fontStyles: props.fontStyles,
			fontSize: props.fontStyles?.fontSize || 24,
			color: props.fontStyles?.color || '#fff',
			fontFamily: props.fontStyles?.fontFamily || 'sans-serif',
			fontWeight: props.fontStyles?.fontWeight || 'normal',
			// height: 240,
			// centerY: 142,
			height: initialHeight,
			centerY: initialCenterY,
			position: 0,
			text: props.text || 'Do With Ve',
			scrollSymbol: props.scrollSymbol || '$',
			itemSpacing: props.itemSpacing || 40,
			isHovered: false,
			textWidth: 0,
			symbolWidth: 0,
			combinedWidth: 0,
			instanceCount: 0,
			animationFrameId: null,
			scaleFactor: 1,
			isUpdating: false,
		};
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}

		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.width !== nextProps.width) {
			this.setState({
				width: nextProps.width,
			});
		}
		if (this.state.text !== nextProps.text) {
			this.setState({
				text: nextProps.text,
			});
		}
		if (this.state.scrollSymbol !== nextProps.scrollSymbol) {
			this.setState({
				scrollSymbol: nextProps.scrollSymbol,
			});
		}
		if (this.state.itemSpacing !== nextProps.itemSpacing) {
			this.setState({
				itemSpacing: nextProps.itemSpacing,
			});
		}
		if (this.state.scrollStyles !== nextProps.scrollStyles) {
			this.setState({
				scrollStyles: nextProps.scrollStyles,
				intensity: nextProps.scrollStyles.intensity,
				speed: this.speeds[nextProps.scrollStyles.speed],
				direction: nextProps.scrollStyles.direction,
				spacing: nextProps.scrollStyles.spacing,
				fade: nextProps.scrollStyles.fade,
				pauseOnHover: nextProps.scrollStyles.pauseOnHover,
				blur: nextProps.scrollStyles.blur,
				blurType: nextProps.scrollStyles.blurType,
				blurAmount: nextProps.scrollStyles.blurAmount,
			});
		}

		if (this.state.fontStyles !== nextProps.fontStyles) {
			const newFontSize = nextProps.fontStyles.fontSize;
			const newHeight = this.calculateCanvasHeight(newFontSize);
			const newCenterY = this.calculateCenterY(newHeight, newFontSize);
			this.setState(
				{
					fontStyles: nextProps.fontStyles,
					fontSize: nextProps.fontStyles.fontSize,
					color: nextProps.fontStyles.color,
					fontFamily: nextProps.fontStyles.fontFamily,
					fontWeight: nextProps.fontStyles.fontWeight,
					height: newHeight,
					centerY: newCenterY,
				},
				() => {
					// Update the canvas font properties
					const canvas = this.canvasRef.current;
					const ctx = canvas.getContext('2d');
					ctx.font = `${this.state.fontWeight} ${this.state.fontSize}px ${this.state.fontFamily}`;
					this.updateTextMetrics();
					// this.animate(ctx);
				},
			);
		}
	};

	componentDidUpdate(prevProps, prevState) {
		const hasRelevantChanges =
			prevState.fontSize !== this.state.fontSize ||
			prevState.width !== this.state.width ||
			prevProps.text !== this.props.text ||
			prevState.fontFamily !== this.state.fontFamily ||
			prevState.fontWeight !== this.state.fontWeight ||
			prevState.scrollStyles.intensity !== this.state.intensity;

		if (hasRelevantChanges && !this.state.isUpdating) {
			if (this.state.animationFrameId) {
				cancelAnimationFrame(this.state.animationFrameId);
				this.setState({ animationFrameId: null }, () => {
					this.updateTextMetrics();
				});
			} else {
				this.updateTextMetrics();
			}
		}
	}
	componentDidMount() {
		if (!this.state.text) {
			console.warn('Text is empty. Provide text to display in ScrollText component.');
			return;
		}
		const canvas = this.canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.font = `${this.state?.fontWeight} ${this.state.fontSize}px ${this.state?.fontFamily}`;
		this.updateTextMetrics();
		requestAnimationFrame(() => this.animate(ctx));
	}
	componentWillUnmount() {
		if (this.state.animationFrameId) {
			cancelAnimationFrame(this.state.animationFrameId);
		}
	}

	calculateCanvasHeight = (fontSize) => {
		const minHeight = Math.max(80, fontSize * 2);

		// Adjust vertical padding based on font size
		const verticalPadding = fontSize * 3; // Increased from 2 to 3 for better spacing

		// Scale intensity space with font size
		const intensitySpace = (this.state?.intensity || 0) * Math.max(2, fontSize / 12);

		// Calculate total height with better proportions
		const calculatedHeight = fontSize + verticalPadding + intensitySpace;

		return Math.max(calculatedHeight, minHeight);
	};

	calculateCenterY = (canvasHeight, fontSize) => {
		const baselineOffset = fontSize * 0.4; // Adjusted from fontSize/3 for better alignment
		return canvasHeight / 2 + baselineOffset; // The fontSize/3 adjustment helps center better
	};

	calculateSingleTextWidth = (text, ctx) => {
		const chars = text.split('');
		let width = 0;
		chars.forEach((char, index) => {
			width += ctx.measureText(char).width;
			if (index < chars.length - 1) {
				width += this.state.spacing;
			}
		});
		return width;
	};

	updateTextMetrics = () => {
		if (!this.state.text || this.state.isUpdating) return;

		const canvas = this.canvasRef.current;
		if (!canvas) return;

		this.setState({ isUpdating: true }, () => {
			const ctx = canvas.getContext('2d');
			const isMobilePreview = this.state.preview && this.state.previewType === 'm';
			const scaleFactor = isMobilePreview ? this.state.width / 420 : 1;
			// const adjustedFontSize = isMobilePreview
			// 	? this.state.fontSize * scaleFactor
			// 	: this.state.fontSize;
			const minFontSize = 10;
			const adjustedFontSize = Math.max(
				minFontSize,
				isMobilePreview ? this.state.fontSize * scaleFactor : this.state.fontSize,
			);
			// Calculate new height and centerY
			const newHeight = this.calculateCanvasHeight(adjustedFontSize);
			const newCenterY = this.calculateCenterY(newHeight, adjustedFontSize);

			ctx.font = `${this.state.fontWeight} ${adjustedFontSize}px ${this.state.fontFamily}`;

			const text1Width = this.calculateSingleTextWidth(this.state.text, ctx);
			const text2Width = this.state.scrollSymbol
				? this.calculateSingleTextWidth(this.state.scrollSymbol, ctx)
				: 0;

			// Adjust item spacing based on text length
			const dynamicSpacing =
				this.state.text.length > 23 ? this.state.itemSpacing * 1.5 : this.state.itemSpacing;

			const combinedWidth =
				text2Width > 0
					? Math.min(
							this.state.width,
							text1Width + dynamicSpacing + text2Width + dynamicSpacing,
					  )
					: Math.min(this.state.width, text1Width);

			// Ensure instance count covers the canvas width even with long text
			const instanceCount = Math.ceil(this.state.width / combinedWidth) + 2;

			this.setState(
				{
					textWidth: text1Width,
					symbolWidth: text2Width,
					combinedWidth: combinedWidth + dynamicSpacing,
					instanceCount,
					spacing: Math.max(
						this.state.spacing,
						(this.state.width % combinedWidth) /
							(instanceCount * this.state.text.length),
					),
					scaleFactor,
					height: newHeight,
					centerY: newCenterY,
					isUpdating: false,
				},
				() => {
					if (!this.state.animationFrameId) {
						this.animate(ctx);
					}
				},
			);
		});
	};

	calculateTotalWidth = (ctx) => {
		const calculateSingleTextWidth = (text) => {
			const chars = text.split('');
			let width = 0;
			chars.forEach((char, index) => {
				width += ctx.measureText(char).width;
				if (index < chars.length - 1) {
					width += this.state.spacing;
				}
			});
			return width;
		};

		const text1Width = calculateSingleTextWidth(this.state.text);
		const text2Width = this.state.scrollSymbol
			? calculateSingleTextWidth(this.state.scrollSymbol)
			: 0;

		return text2Width > 0 ? text1Width + text2Width + this.state.itemSpacing : text1Width;
	};

	draw = (ctx) => {
		if (!ctx || !this.canvasRef.current) return;

		const canvas = this.canvasRef.current;
		const isMobilePreview = this.state.preview && this.state.previewType === 'm';

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.globalCompositeOperation = 'source-over';

		// const adjustedFontSize = isMobilePreview
		// 	? this.state.fontSize * (this.state.scaleFactor || 1)
		// 	: this.state.fontSize;
		const minFontSize = 10;
		const adjustedFontSize = Math.max(
			minFontSize,
			isMobilePreview
				? this.state.fontSize * (this.state.scaleFactor || 1)
				: this.state.fontSize,
		);

		ctx.font = `${this.state.fontWeight} ${adjustedFontSize}px ${this.state.fontFamily}`;
		ctx.fillStyle = this.state.color;
		ctx.textBaseline = 'middle';

		const copies = Math.ceil(canvas.width / this.state.combinedWidth) + 2;

		const drawText = (text, startX) => {
			let currentX = startX;
			text.split('').forEach((char) => {
				if (currentX > -100 && currentX < canvas.width + 100) {
					const charWidth = ctx.measureText(char).width;
					const yOffset = Math.sin(currentX / 50) * (this.state.intensity || 0);
					ctx.fillText(char, currentX, this.state.centerY + yOffset);
					currentX += charWidth + this.state.spacing;
				} else {
					const charWidth = ctx.measureText(char).width;
					currentX += charWidth + this.state.spacing;
				}
			});
			return currentX;
		};

		for (let i = 0; i < copies; i++) {
			let currentX = i * this.state.combinedWidth - this.state.position;

			// Draw first text
			currentX = drawText(this.state.text, currentX);

			// Draw second text if it exists
			currentX += this.state.itemSpacing;
			if (this.state.scrollSymbol) {
				drawText(this.state.scrollSymbol, currentX);
			}
		}
	};

	animate = (ctx) => {
		if (!ctx || !this.canvasRef.current || this.state.isUpdating) return;

		this.draw(ctx);

		if (!(this.state.pauseOnHover && this.state.isHovered)) {
			const movement =
				this.state.speed *
				(this.state.preview && this.state.previewType === 'm' ? this.state.scaleFactor : 1);

			this.setState((prevState) => ({
				position:
					this.state.direction === 'left'
						? (this.state.position + movement) % this.state.combinedWidth
						: (this.state.position - movement + this.state.combinedWidth) %
						  this.state.combinedWidth,
			}));
		}

		const animationFrameId = requestAnimationFrame(() => this.animate(ctx));
		this.setState({ animationFrameId });
	};

	handleMouseEnter = () => {
		this.setState({ isHovered: true });
	};

	handleMouseLeave = () => {
		this.setState({ isHovered: false });
	};
	handleOnClick = () => {
		this.state.preview == true
			? [
					// e.stopPropagation(),
					window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self'),
			  ]
			: [this.props.setTab('st')];
	};

	render() {
		const isMobilePreview = this.state.preview && this.state.previewType === 'm';
		const canvasWidth = isMobilePreview ? 420 : this.state.width;

		const minHeight = Math.max(80, this.state.fontSize * 2);
		const canvasHeight = Math.max(this.state.height, minHeight);
		return (
			<div
				className="scroll-text-contianer"
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				style={{ background: 'transparent', cursor: 'pointer' }}
				onClick={this.handleOnClick}
			>
				{this.state?.blur && this.state.blurType === 'background' && (
					<div
						className="blur-bg"
						style={{ filter: `blur(${this.state.blurAmount || 15}px)` }}
					/>
				)}
				<canvas
					style={{
						filter:
							this.state?.blur &&
							this.state.blurType === 'text' &&
							`blur(${this.state.blurAmount}px)`,
						width: isMobilePreview ? '420px' : `${this.state.width}px`,
						// height: `${this.state.height}px`,
						height: `${canvasHeight}px`,
						position: 'relative',
						zIndex: 1,
					}}
					className={this.state.fade ? 'fading' : ''}
					ref={this.canvasRef}
					width={canvasWidth}
					// height={this.state.height}
					height={canvasHeight}
				/>
			</div>
		);
	}
}

export default ScrollText;
