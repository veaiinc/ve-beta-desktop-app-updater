import { memo } from 'react';
import s from './glassFooter.module.scss';
import { ReactComponent as GlassFooter } from '../../../assets/svg/landingScreen/GlassFooter.svg';
import { ReactComponent as FooterMobile } from '../../../assets/svg/landingScreen/footerMobile.svg';

const GlassFooterSection = ({ isMobileFooter = false }) => {
	return (
		<div className={`${s.glassFooterSection} ${isMobileFooter ? s.mobileFooterContainer : ''}`}>
			{/* Desktop Footer */}
			<GlassFooter className={s.glassFooter} />

			{/* Mobile Footer */}
			<FooterMobile className={s.mobileFooter} />
		</div>
	);
};

export default memo(GlassFooterSection);
