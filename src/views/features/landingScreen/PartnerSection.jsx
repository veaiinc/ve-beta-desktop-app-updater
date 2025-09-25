import { memo } from 'react';
import AnimatedGlowBackground from '../../components/globalComponents/AnimatedGlowBackground';
import s from './partnerSection.module.scss';

const PartnerSection = () => {
	return (
		<AnimatedGlowBackground variant="subtle" intensity="low" className={s.partnerSection}>
			<div className={s.container}>
				<h2 className={s.heading}>Your true partner</h2>
				<p className={s.subheading}>For work, for life, for everything you do.</p>
			</div>
		</AnimatedGlowBackground>
	);
};

export default memo(PartnerSection);
