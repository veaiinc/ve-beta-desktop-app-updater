import React from 'react';
import './elementPopup.scss';
import ColorPicker from '../../properties/colorpicker';
export default class MenubarPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeComponent: props.activeComponent,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
			});
		}
	}

	handleNavbarStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };

		newComponent = { ...newComponent, [type]: value };

		this.setState({ activeComponent: newComponent }, () => {
			this.props?.setActivePopupComponent(newComponent);
		});
	};
	render() {
		return (
			<div className="menubar-popup-container">
				<>
					<div className="block_styles pad-color-p-imp" style={{ padding: '12px 0px' }}>
						<ColorPicker
							title={'Background Color'}
							color={this.state?.activeComponent?.navbarBackgroundColor}
							handleColor={(e) => this.handleNavbarStyles('navbarBackgroundColor', e)}
							brandColors={this.props?.brandColors}
							zoom={0.8}
							isDarkBg={true}
						/>
					</div>
					<div className="block_styles pad-color-p-imp" style={{ padding: '12px 0px' }}>
						<ColorPicker
							title={'Text Color'}
							color={this.state?.activeComponent?.navbarTextColor}
							handleColor={(e) => this.handleNavbarStyles('navbarTextColor', e)}
							brandColors={this.props?.brandColors}
							zoom={0.8}
							isDarkBg={true}
						/>
					</div>
				</>
			</div>
		);
	}
}
