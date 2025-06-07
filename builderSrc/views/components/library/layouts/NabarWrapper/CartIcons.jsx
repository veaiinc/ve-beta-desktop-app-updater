import React, { Component } from 'react';
import {
	CartOne,
	CartTwo,
	CartThree,
	CartFour,
	CartFive,
	CartSix,
	CartSeven,
} from '../../svgs/Navbar/Cart/CartComponents/CartComponents';

class CartIcons extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	renderIcon = (iconType, fillColor) => {
		switch (iconType) {
			case 0:
				return <CartOne fillColor={fillColor} />;
			case 1:
				return <CartTwo fillColor={fillColor} />;
			case 2:
				return <CartThree fillColor={fillColor} />;
			case 3:
				return <CartFour fillColor={fillColor} />;
			case 4:
				return (
					<>
						{/* <div>hello</div> */}
						<CartFive fillColor={fillColor} />
					</>
				);
			case 5:
				return <CartSix fillColor={fillColor} />;
			case 6:
				return <CartSeven fillColor={fillColor} />;
			default:
				return <CartOne fillColor={fillColor} />;
		}
	};

	render() {
		return <div>{this.renderIcon(this.props.iconType, this.props.fillColor)}</div>;
	}
}

export default CartIcons;
