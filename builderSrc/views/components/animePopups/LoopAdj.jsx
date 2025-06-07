import React from 'react';
import Breathe from './loopAdjustments/Breathe';
import Cross from './loopAdjustments/Cross';
import Flap from './loopAdjustments/Flap';
import Flash from './loopAdjustments/Flash';
import Flip from './loopAdjustments/Flip';
import Jello from './loopAdjustments/LoopJello';
import Poke from './loopAdjustments/Poke';
import Pulse from './loopAdjustments/Pulse';
import Rubber from './loopAdjustments/Rubber';
import Spin from './loopAdjustments/Spin';
import Swing from './loopAdjustments/Swing';
import Wiggle from './loopAdjustments/Wiggle';

const animationComponents = {
	breathe: Breathe,
	cross: Cross,
	flap: Flap,
	flip: Flip,
	flash: Flash,
	poke: Poke,
	pulse: Pulse,
	rubber: Rubber,
	spin: Spin,
	swing: Swing,
	wiggle: Wiggle,
	jello: Jello,
	bounce: Wiggle,
};

const LoopAdj = ({ activeComponent, adjustAnimation }) => {
	const AnimationComponent = animationComponents[activeComponent?.animations?.animeName];
	return AnimationComponent ? (
		<AnimationComponent activeComponent={activeComponent} adjustAnimation={adjustAnimation} />
	) : null;
};

export default LoopAdj;
