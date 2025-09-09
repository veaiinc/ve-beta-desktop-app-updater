import React, { Component } from 'react';
import './listicon.scss';
import Circle from '../../svgs/listIcons/Circle';
import FilledRight from '../../svgs/listIcons/FilledRight';
import Heart from '../../svgs/listIcons/Heart';
import Minus from '../../svgs/listIcons/Minus';
import Right from '../../svgs/listIcons/Right';
import RightArrow from '../../svgs/listIcons/RightArrow';
import Ring from '../../svgs/listIcons/Ring';
import RoundedRight from '../../svgs/listIcons/RoundedRight';
import Star from '../../svgs/listIcons/Star';
import Numbers from '../../svgs/listIcons/Numbers';
import SquareCircle from '../../svgs/listIcons/SquareCircle';
import Delivery from '../../svgs/listIcons/Delivery';
import Location from '../../svgs/listIcons/Location';

const listIconShapes = [
	{ name: 'Circle', element: <Circle /> },
	{ name: 'FilledRight', element: <FilledRight /> },
	{ name: 'Heart', element: <Heart /> },
	{ name: 'Minus', element: <Minus /> },
	{ name: 'Right', element: <Right /> },
	{ name: 'RightArrow', element: <RightArrow /> },
	{ name: 'Ring', element: <Ring /> },
	{ name: 'RoundedRight', element: <RoundedRight /> },
	{ name: 'Star', element: <Star /> },
	{ name: 'Numbers', element: <Numbers /> },
	{ name: 'SquareCircle', element: <SquareCircle /> },
	{ name: 'Delivery', element: <Delivery/> },
	{ name: 'Location', element: <Location/> },
];
class ListIcon extends Component {
	constructor(props) {
		super();
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props?.preview,
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
	};
	renderIcon = (shape, color, size, listCount) => {
		// previouse logic
		// switch (shape) {
		// 	case 'Circle':
		// 		return <Circle color={color} size={size} />;
		// 	case 'FilledRight':
		// 		return <FilledRight color={color} size={size} />;
		// 	case 'Heart':
		// 		return <Heart color={color} size={size} />;
		// 	case 'Minus':
		// 		return <Minus color={color} size={size} />;

		// 	case 'Right':
		// 		return <Right color={color} size={size} />;
		// 	case 'RightArrow':
		// 		return <RightArrow color={color} size={size} />;
		// 	case 'Ring':
		// 		return <Ring color={color} size={size} />;
		// 	case 'RoundedRight':
		// 		return <RoundedRight color={color} size={size} />;
		// 	case 'Star':
		// 		return <Star color={color} size={size} />;
		// 	default:
		// 		return null;
		// }

		// updated logic

		const IconComponent = listIconShapes.find((icon) => icon.name === shape)?.element;

		return IconComponent ? React.cloneElement(IconComponent, { color, size, listCount }) : <Circle color={color} size={size} listCount={listCount} />;
	};
	handleOnClick = () => {
		this.state.preview == true
			? [
					// e.stopPropagation(),
					window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self'),
			  ]
			: [this.props.setTab('li')];
	};

	render() {
		return (
			<div
				className={`listicon ${this.props.size}`}
				style={{}}
				onClick={() => this.handleOnClick()}
			>
				{this.renderIcon(
					this.props.shape,
					this.props.color,
					this.props.size,
					this.props.listCount,
				)}
			</div>
		);
	}
}

export default ListIcon;
