// import React from 'react';
import Arc from './scrollAdjustments/Arc';
import Blur from './scrollAdjustments/Blur';
import Expand from './scrollAdjustments/Expand';
import Fade from './scrollAdjustments/Fade';
import Flip from './scrollAdjustments/Flip';
import Fly from './scrollAdjustments/Fly';
import Move from './scrollAdjustments/Move';
import Parallax from './scrollAdjustments/Parallax';
import Reveal from './scrollAdjustments/Reveal';
import Shape from './scrollAdjustments/Shape';
import Shrink from './scrollAdjustments/Shrink';
import Shutters from './scrollAdjustments/Shutters';
import Slide from './scrollAdjustments/Slide';
import Spin from './scrollAdjustments/ScrollSpin';
import Spin3D from './scrollAdjustments/Spin3D';
import Stretch from './scrollAdjustments/Stretch';
import Tilt from './scrollAdjustments/Tilt';
import Turn from './scrollAdjustments/Turn';

const animationComponents = {
	arc: Arc,
	blur: Blur,
	expand: Expand,
	fade: Fade,
	flip: Flip,
	fly: Fly,
	move: Move,
	parallax: Parallax,
	reveal: Reveal,
	shape: Shape,
	shrink: Shrink,
	shutters: Shutters,
	slide: Slide,
	'3dspin': Spin3D,
	stretch: Stretch,
	tilt: Tilt,
	turn: Turn,
	spin: Spin,
};

const ScrollAdj = ({ activeComponent, adjustAnimation }) => {
	const AnimationComponent = animationComponents[activeComponent?.animations?.animeName];
	return AnimationComponent ? (
		<AnimationComponent activeComponent={activeComponent} adjustAnimation={adjustAnimation} />
	) : null;
};

export default ScrollAdj;
