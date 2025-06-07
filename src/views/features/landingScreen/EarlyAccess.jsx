import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/earlyAccess.module.scss';

const EarlyAccess = () => {
	return (
		<div className={s.earlyAccess}>
			<div className={s.container}>
				{/* <p className={s.subHeading}>Explore.</p> */}
				<p className={s.heading}>Own yor memory</p>
				<button className={s.ctaButton}>Request Early Access</button>
			</div>
		</div>
	);
};

export default memo(EarlyAccess);
