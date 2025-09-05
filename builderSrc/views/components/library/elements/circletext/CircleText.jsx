import React, { Component } from 'react';
import './circleText.scss';

class CircleText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: this.props.text,
			style: this.props.style,
		};
		this.curvedTextRef = React.createRef();
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.text !== nextProps.text) {
			this.setState({
				text: nextProps.text,
			});
		}
		if (this.state.style !== nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
		}
	};
	componentDidMount() {
		this.updateCurvedText();
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.text !== this.props.text ||
			prevProps.radius !== this.props.radius ||
			prevProps.width !== this.props.width
		) {
			this.updateCurvedText();
		}
	}

	updateCurvedText = () => {
		const { text, radius, width, divStyle } = this?.props;
		const $curvedText = this.curvedTextRef.current;

		$curvedText.style.minWidth = 'initial';
		$curvedText.style.minHeight = 'initial';
		$curvedText.style.width = width;

		const w = $curvedText.offsetWidth;
		const h = $curvedText.offsetHeight;
		$curvedText.style.minWidth = `${w}px`;
		$curvedText.style.minHeight = `${h}px`;

		let html = '';

		Array.from(text).forEach((letter) => {
			html += `<span>${letter}</span>`;
		});
		$curvedText.innerHTML = html;

		const $letters = $curvedText.querySelectorAll('span');
		$letters.forEach((letter) => {
			letter.style.position = 'absolute';
			letter.style.height = `${radius}px`;
			letter.style.transformOrigin = 'bottom center';
		});

		const circleLength = 2 * Math.PI * radius;
		const angleRad = w / (2 * radius);
		const angle = (2 * angleRad * 180) / Math.PI / text.length;

		$letters.forEach((letter, idx) => {
			letter.style.transform = `translate(${w / 2}px, 0px) rotate(${
				idx * angle - (text.length * angle) / 2
			}deg)`;
		});
	};
	handleClick = () => {
		this.props.circleTextData(this.props);
		!this.state.preview && this.props.setTab('Ct');
	};

	render() {
		const { style, divStyle } = this?.props;

		return (
			<div
				className="curved-text-main"
				style={{
					...divStyle,
					cursor: 'pointer',
					...(this.props.isFluid && { position: 'relative' }),
				}}
				onClick={this.handleClick}
			>
				<div ref={this.curvedTextRef} className="curved-text" style={style}>
					{this.state.text}
				</div>
			</div>
		);
	}
}

export default CircleText;
