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
				<p className={s.description}>
					Power every tool with your Ambient Memory — via MCP. Or simply download your
					entire memory anytime fully encrypted, fully yours!
				</p>
				<button className={s.ctaButton} onClick={() => navigate('/verify-user')}>
					Connect with MCP
				</button>
			</div>
		</div>
	);
};

export default memo(EarlyAccess);
