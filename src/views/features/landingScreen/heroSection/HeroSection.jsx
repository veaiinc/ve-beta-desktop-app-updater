import { memo } from 'react';
import s from './heroSection.module.scss';
import { Link } from 'react-router-dom';

const HeroSection = () => {
	return (
		<main className={s.heroSectionContainer}>
			<h1 className={s.titleOne}>
				AI that’s always <span className={s.bold}>ON</span> <br /> Acts before you ask
			</h1>
			<p className={s.titleTwo}>
				Your living intelligence remembers everything, sees what you see, figures out your
				goals, and doesn’t stop until they're done.
			</p>
			<Link to="/verify-user" className={s.getStartedLink}>
				Get Started
			</Link>
		</main>
	);
};

export default memo(HeroSection);
