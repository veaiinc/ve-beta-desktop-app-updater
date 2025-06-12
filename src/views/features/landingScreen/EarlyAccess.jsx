import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/earlyAccess.module.scss';
import { useNavigate } from 'react-router-dom';

const EarlyAccess = () => {
	const navigate = useNavigate();
	return (
		<div className={s.earlyAccess}>
			<div className={s.container}>
				{/* <p className={s.subHeading}>Explore.</p> */}
				<p className={s.heading}>Own your memory</p>
				<button className={s.ctaButton} onClick={() => navigate('/verify-user')}>
					Request Early Access
				</button>
			</div>
		</div>
	);
};

export default memo(EarlyAccess);
