import React, { Component } from 'react';

import {
	HamburgerOne,
	HamburgerTwo,
	HamburgerThree,
	HamburgerFour,
	HamburgerFive,
	HamburgerSix,
	HamburgerSeven,
} from '../../svgs/Navbar/Hamburger/HamburgerComponent';

class HamburgerIcons extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	renderIcon = (iconType, fillColor) => {
		switch (iconType) {
			case 0:
				return <HamburgerOne fillColor={fillColor} />;
			case 1:
				return <HamburgerTwo fillColor={fillColor} />;
			case 2:
				return <HamburgerThree fillColor={fillColor} />;
			case 3:
				return <HamburgerFour fillColor={fillColor} />;
			case 4:
				return <HamburgerFive fillColor={fillColor} />;
			case 5:
				return <HamburgerSix fillColor={fillColor} />;
			case 6:
				return <HamburgerSeven fillColor={fillColor} />;
			default:
				return <HamburgerFour fillColor={fillColor} />;
		}
	};

	render() {
		return <div>{this.renderIcon(this.props.iconType, this.props.fillColor)}</div>;
	}
}

export default HamburgerIcons;
