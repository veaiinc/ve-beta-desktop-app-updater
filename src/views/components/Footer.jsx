import React from 'react';
import '../../assets/scss/footer.scss';
import VE from '../../assets/svg/ve.svg?react';
import Email from '../../assets/svg/footer/email.svg?react';
import Instagram from '../../assets/svg/footer/instagram.svg?react';
import LinkedIn from '../../assets/svg/footer/linkedIn.svg?react';
import Youtube from '../../assets/svg/footer/youtube.svg?react';
import FooterText from '../../assets/svg/footer/footertext.svg?react';
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
