import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/earlyAccess.module.scss';
import { Link } from 'react-router-dom';

const EarlyAccess = () => {
	return (
		<div className={s.earlyAccess}>
			<div className={s.container}>
				<p className={s.heading}>
					Your partner <br />
					in everthing
				</p>
				<Link to="/verify-user" className={s.ctaButton}>
					Get Started
				</Link>
			</div>
		</div>
	);
};

export default memo(EarlyAccess);
