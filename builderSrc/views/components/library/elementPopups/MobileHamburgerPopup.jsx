import React, { Component } from 'react';
import { ReactComponent as Cart1 } from '../svgs/Navbar/Hamburger/Hamburger1.svg';
import { ReactComponent as Cart2 } from '../svgs/Navbar/Hamburger/Hamberger2.svg';
import { ReactComponent as Cart3 } from '../svgs/Navbar/Hamburger/Hamberger3.svg';
import { ReactComponent as Cart4 } from '../svgs/Navbar/Hamburger/Hamberger4.svg';
import { ReactComponent as Cart5 } from '../svgs/Navbar/Hamburger/Hamburger5.svg';
import { ReactComponent as Cart6 } from '../svgs/Navbar/Hamburger/Hamburger6.svg';
import { ReactComponent as Cart7 } from '../svgs/Navbar/Hamburger/Hamburger7.svg';
class MobileNavHamburger extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeComponent: props.activeComponent,
			fieldStyle: 'lines-3',
			thickness: 'S',
			sliderValue: 3,
		};
		this.cartShapes = [
			<Cart1 />,
			<Cart2 />,
			<Cart3 />,
			<Cart4 />,
			<Cart5 />,
			<Cart6 />,
			<Cart7 />,
		];
	}

	handleCartGlobalFunction = (type, value) => {
		let newComponent = { ...this.props.activeComponent };
		if (type == 'hamburgerIcon' || type == 'thickness') {
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [type]: value },
			};
		} else {
			newComponent = { ...newComponent, [type]: value };
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};
	handleFieldStyleChange = (style) => {
		this.setState({ fieldStyle: style });
	};
	handleThicknessChange = (thickness) => {
		this.setState({ thickness });
	};
	handleSliderChange = (e) => {
		this.setState({ sliderValue: e.target.value });
	};
	render() {
		const { fieldStyle, thickness, sliderValue } = this.state;
		return (
			<div className="edit-menu">
				<h2 className="head">Edit Menu</h2>
				<div className="tab-indicator"></div>
				<div className="sectionsub">
					<p className="section-title">Field Style</p>
					<div className="field-style-options">
						{this.cartShapes.map((Icon, idx) => (
							<div
								key={idx}
								className={`style-btn ${
									this.props.activeComponent?.style?.hamburgerIcon === idx ||
									(!this.props.activeComponent?.style?.hamburgerIcon && idx === 0)
										? 'active'
										: ''
								}`}
								onClick={() => this.handleCartGlobalFunction('hamburgerIcon', idx)}
							>
								{Icon}
							</div>
						))}
					</div>
				</div>
				{/* <div className="divider-line"></div>
				<div className="sectionsub">
					<p className="section-title">Thickness</p>
					<div className="thickness-options">
						{['S', 'M', 'L'].map((size) => (
							<div
								key={size}
								className={`size-bt ${
									this.props.activeComponent?.style?.thickness === size ||
									size === 'S'
										? 'active'
										: ''
								}`}
								onClick={() => this.handleCartGlobalFunction('thickness', size)}
							>
								{size}
							</div>
						))}
					</div>
					<div className="slider-container">
						<input
							type="range"
							min="1"
							max="10"
							value={this.state.sliderValue}
							onChange={this.handleSliderChange}
							className="slider"
						/>
						<span className="slider-value">{this.state.sliderValue}</span>
					</div>
				</div> */}
			</div>
		);
	}
}
export default MobileNavHamburger;
