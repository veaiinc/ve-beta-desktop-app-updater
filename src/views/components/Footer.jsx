import React from 'react';
import '../../assets/scss/footer.scss';
import { ReactComponent as VE } from '../../assets/svg/ve.svg';
import { ReactComponent as Email } from '../../assets/svg/footer/email.svg';
import { ReactComponent as Instagram } from '../../assets/svg/footer/instagram.svg';
import { ReactComponent as LinkedIn } from '../../assets/svg/footer/linkedIn.svg';
import { ReactComponent as Youtube } from '../../assets/svg/footer/youtube.svg';
import { ReactComponent as FooterText } from '../../assets/svg/footer/footertext.svg';
const Footer = () => {
	return (
		<div className="footerParentContainer">
			<div className="footerInnerContiner">
				<div className="footerTopContentContainer">
					<div className="iconContianer">
						<VE />
						<div className="footerBtnContainer">
							<div className="footerBtn">What’s New?</div>
							<div className="footerBtn">Discover</div>
							<div className="footerBtn">Help</div>
						</div>
					</div>

					<div className="socialMediaBtnGroup">
						<span className="socialMediaBtnHolder">
							<Instagram />
						</span>
						<span className="socialMediaBtnHolder">
							<Email />
						</span>
						<span className="socialMediaBtnHolder">
							<LinkedIn />
						</span>
						<span className="socialMediaBtnHolder">
							<Youtube />
						</span>
					</div>
				</div>
				<div className="footerTextSvg">
					<FooterText />
				</div>
			</div>
		</div>
	);
};

export default Footer;
