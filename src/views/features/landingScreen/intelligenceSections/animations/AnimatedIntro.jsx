import { memo } from 'react';
import AnimatedGlowBackground from '../../../../components/globalComponents/AnimatedGlowBackground';
import s from './animatedIntro.module.scss';

const AnimatedIntro = memo(function AnimatedIntro({ title, subhead }) {
	return (
		<AnimatedGlowBackground variant="subtle" intensity="medium" className={s.Intro}>
			<div className={s.content}>
				<h1 className={s.title}>{title}</h1>
				<p className={s.subHead}>{subhead}</p>
			</div>
		</AnimatedGlowBackground>
	);
});

export default memo(AnimatedIntro);
