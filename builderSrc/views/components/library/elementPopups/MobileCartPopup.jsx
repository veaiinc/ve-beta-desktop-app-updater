import React, { Component } from 'react';
import { ReactComponent as Cart1 } from '../svgs/Navbar/Cart/Cart1.svg';
import { ReactComponent as Cart2 } from '../svgs/Navbar/Cart/Catrt2.svg';
import { ReactComponent as Cart3 } from '../svgs/Navbar/Cart/Cart3.svg';
import { ReactComponent as Cart4 } from '../svgs/Navbar/Cart/Cart4.svg';
import { ReactComponent as Cart5 } from '../svgs/Navbar/Cart/Cart5.svg';
import { ReactComponent as Cart6 } from '../svgs/Navbar/Cart/Cart6.svg';
import { ReactComponent as Cart7 } from '../svgs/Navbar/Cart/Cart7.svg';

// ToggleSwitch remains a functional component since it's simple
const ToggleSwitch = ({ isOn, handleToggle }) => (
	<div className="cartclick-toggle-container" onClick={handleToggle}>
		<div
			style={{ backgroundColor: isOn ? '#202123' : '#ffffff' }}
			className={`cartclick-toggle-switch ${isOn ? 'on' : 'off'}`}
		>
			<div
				style={{ backgroundColor: isOn ? '#000000' : '#ffffff' }}
				className="cartclick-toggle-thumb"
			/>
		</div>
	</div>
);

class MobileNavbarCart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cartEnabled: false,
			style: 'icon',
			selectedCart: 0,
			selectedBorder: 0,
			showZero: false,
		};
		this.cartIcons = [
			<Cart1 />,
			<Cart2 />,
			<Cart3 />,
			<Cart4 />,
			<Cart5 />,
			<Cart6 />,
			<Cart7 />,
		];
		this.borderShapes = ['dash', 'square', 'hexagon', 'circle'];
	}
	handleCartGlobalFunction = (key, value) => {
		let newComponent = { ...this.props.activeComponent };
		if (
			key == 'cartIcon' ||
			key == 'cartBorder' ||
			key == 'showCart' ||
			key == 'downloadIcon' ||
			key == 'cartValue'
		) {
			this.setState({ selectedCart: value });
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [key]: value },
			};
		} else {
			newComponent = { ...newComponent, [key]: value };
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};

	render() {
		return (
			<div className="cartclick-menu">
				<div className="cartclick-scroll">
					<h2 className="cartclick-head">Design</h2>
					<div className="cartclick-tab-indicator" />

					<div className="cartclick-section">
						<div className="cartclick-label">Cart</div>
						<ToggleSwitch
							isOn={this.props.activeComponent?.style?.showCart}
							handleToggle={() =>
								this.handleCartGlobalFunction(
									'showCart',
									!this.props.activeComponent?.style?.showCart,
								)
							}
						/>
					</div>
					<div className="cartclick-section">
						<div className="cartclick-label">Download Icon</div>
						<ToggleSwitch
							isOn={this.props.activeComponent?.style?.downloadIcon}
							handleToggle={() =>
								this.handleCartGlobalFunction(
									'downloadIcon',
									!this.props.activeComponent?.style?.downloadIcon,
								)
							}
						/>
					</div>
					<div className="cartclick-section">
						<div className="cartclick-label">Cart Value</div>
						<ToggleSwitch
							isOn={this.props.activeComponent?.style?.cartValue}
							handleToggle={() =>
								this.handleCartGlobalFunction(
									'cartValue',
									!this.props.activeComponent?.style?.cartValue,
								)
							}
						/>
					</div>

					<div className="cartclick-style">
						<div className="cartclick-label">Style</div>
						<div className="cartclick-style-switch">
							{/* <button
								className={this.state.style === 'text' ? 'active' : ''}
								onClick={() => this.setState({ style: 'text' })}
							>
								Text
							</button> */}
							<button
								className={this.state.style === 'icon' ? 'active' : ''}
								onClick={() => this.setState({ style: 'icon' })}
							>
								Icon
							</button>
						</div>

						{this.state.style === 'icon' && (
							<div className="cartclick-icon-options">
								{this.cartIcons.map((Icon, i) => (
									<div
										key={i}
										className={`cartclick-icon-btn ${
											this.props.activeComponent?.style?.cartIcon === i ||
											(!this.props.activeComponent?.style?.cartIcon &&
												i === 0)
												? 'active'
												: ''
										}`}
										onClick={() => this.handleCartGlobalFunction('cartIcon', i)}
									>
										{Icon}
									</div>
								))}
							</div>
						)}
					</div>

					<div className="cartclick-divider" />

					<div className="cartclick-style">
						<div className="cartclick-label">Border</div>
						{/* <div className="cartclick-border-options">
							{this.borderShapes.map((shape, i) => (
								<div
									key={i}
									className={`cartclick-shape ${
										this.props.activeComponent?.style?.cartBorder === shape ||
										(!this.props.activeComponent?.style?.cartBorder &&
											shape === 'dash')
											? 'active'
											: ''
									}`}
									onClick={() =>
										this.handleCartGlobalFunction('cartBorder', shape)
									}
								>
									<div className={`cartclick-shape-inner ${shape}`} />
								</div>
							))}
						</div> */}
					</div>

					{/* <div className="cartclick-divider" /> */}

					{/* <div className="cartclick-section-column">
						<div className="cartclick-label-row">
							<div className="cartclick-label">Show "0" in cart</div>
							<ToggleSwitch
								isOn={this.state.showZero}
								handleToggle={() =>
									this.setState({ showZero: !this.state.showZero })
								}
							/>
						</div>
						<p className="cartclick-description">
							An empty cart displays '0' on desktop. On mobile, the count is never
							visible.
						</p>
					</div> */}
				</div>
			</div>
		);
	}
}

export default MobileNavbarCart;
