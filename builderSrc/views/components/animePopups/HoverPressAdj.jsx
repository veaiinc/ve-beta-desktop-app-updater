// import React from 'react';
import EasyIn from './hoverandpressAdjustments/EasyIn';
import Skew from './hoverandpressAdjustments/Skew';
import EasyOut from './hoverandpressAdjustments/EasyOut';
import Move from './hoverandpressAdjustments/Move';
import Rotate from './hoverandpressAdjustments/Rotate';
import Appear from './hoverandpressAdjustments/Appear';

const animationComponents = {
	easeIn: EasyIn,
	skew: Skew,
	easeOut: EasyOut,
	move: Move,
	rotate: Rotate,
	appear: Appear,
};
const HoverPressAdj = ({ activeComponent, adjustAnimation }) => {
	const AnimationComponent = animationComponents[activeComponent?.animations?.animeName];
	return AnimationComponent ? (
		<AnimationComponent activeComponent={activeComponent} adjustAnimation={adjustAnimation} />
	) : null;
};

export default HoverPressAdj;
