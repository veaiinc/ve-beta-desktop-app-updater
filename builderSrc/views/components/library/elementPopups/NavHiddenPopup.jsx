import React from 'react';
import './elementPopup.scss';
class NavHiddenPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logo: false,
			cart: false,
			button: false,
			activeComponent: this.props?.activeComponent,
		};
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
			});
		}
	};

	toggleElement = (element) => {
		this.setState({ [element]: !this.state[element] });
	};
	handleHiddenElement = (element, value) => {
		let newComponent = { ...this.state.activeComponent };
		if (element === 'showLogo') {
			this.setState({ logo: value });
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [element]: value },
			};
		} else if (element === 'showCart') {
			this.setState({ cart: value });
			newComponent = {
				...newComponent,
				style: { ...newComponent.style, [element]: value },
			};
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};
	render() {
		return (
			<div className="hidden-popup-container">
				<div className="hidden-popup-header">
					<div className="hidden-popup-header-title active"> Manage Elements</div>
				</div>
				<div className="hidden-popup-body">
					<div className="hidden-popup-body-item">
						<div
							className=" bs-item bs-item-row animated-item"
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								// margin: '20px 0px',
							}}
						>
							<b
							// style={{ textTransform: 'capitalize' }}
							>
								Show Logo
							</b>

							<label
								className="switch"
								onClick={() => {
									this.handleHiddenElement(
										'showLogo',
										!this.state.activeComponent?.style?.showLogo,
									);
								}}
							>
								<input
									type="checkbox"
									checked={this.state.activeComponent?.style?.showLogo || false}
								/>
								<span
									style={{
										backgroundColor:
											this.state.activeComponent?.style?.showLogo &&
											'#F1F1F1',
									}}
									className="slider-round-white round"
								></span>
							</label>
						</div>
					</div>
					<div className="hidden-popup-body-item">
						<div
							className=" bs-item bs-item-row animated-item"
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								// margin: '20px 0px',
							}}
						>
							<b
							// style={{ textTransform: 'capitalize' }}
							>
								Show Cart
							</b>

							<label
								className="switch"
								onClick={() => {
									this.handleHiddenElement(
										'showCart',
										!this.state.activeComponent?.style?.showCart,
									);
								}}
							>
								<input
									type="checkbox"
									checked={this.state.activeComponent?.style?.showCart || false}
								/>
								<span
									style={{
										backgroundColor:
											this.state.activeComponent?.style?.showCart &&
											'#F1F1F1',
									}}
									className="slider-round-white round"
								></span>
							</label>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default NavHiddenPopup;
