import React, { memo } from 'react';
import '../../../assets/scss/shareAndEarn/shareAndEarn.scss';
import { ReactComponent as Copy } from '../../../assets/svg/shareAndEarn/copy.svg';
import devices from '../../../assets/images/shareAndEarn/devices.png';

const ShareAndEarn = () => {
	return (
		<div className="shareAndEarnParentContainer">
			<div className="shareAndEarnTextContainer">
				<h1 className="shareAndEarnMainText">
					Get your friends to Ve and earn while you're at it!
				</h1>
				<h2 className="shareEarnSubText">
					You get 10% cash back and your friends receive 10% discount when you refer them
				</h2>
			</div>
			<div className="refferalLinkContainer">
				<h3 className="refferalLinkText">Your Affiliate Link</h3>
				<div className="linkInputContainer">
					<input type="text" defaultValue={'https://ve.co/new-referral/XjuYklOP'} />
					<button className="linkCopyButton">
						<Copy />
						<span>Copy</span>
					</button>
				</div>
			</div>
			<div className="imageContainer">
				<div className="image">
					<img src={devices} alt="" />
				</div>
				<h2 className="imageTitle">Your Success Blueprint</h2>
				<h3 className="imageSubText">
					We made it super easy to earn money by referring Ve. Just use our kit—it has
					everything you need to start making cash without any hassle.
				</h3>
				<button className="getKitButton">
					<span>Get the kit</span>
				</button>
			</div>
		</div>
	);
};

export default memo(ShareAndEarn);
