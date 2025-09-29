import { memo } from 'react';
import s from './partnerSection.module.scss';

const PartnerSection = () => {
	return (
		<section className={s.partnerSection}>
			<div className={s.container}>
				<h2 className={s.heading}>Your true partner</h2>
				<p className={s.subheading}>For work, for life, for everything you do.</p>
			</div>
		</section>
	);
};

export default memo(PartnerSection);
