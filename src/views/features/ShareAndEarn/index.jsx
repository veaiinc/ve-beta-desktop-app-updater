import React, { memo, useEffect, useState } from 'react';
import { SubscriptionState } from '../../../context/subscription/state';
import '../../../assets/scss/shareAndEarn/shareAndEarn.scss';
import { ReactComponent as Copy } from '../../../assets/svg/shareAndEarn/copy.svg';
import devices from '../../../assets/images/shareAndEarn/devices.png';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ShareAndEarn = () => {
	const { getShareAndEarn, referralData } = SubscriptionState({});
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getShareAndEarn();
				if (!response || !response.referralDetails) {
					message.error(response);
					navigate('/home');
					return;
				}
				setIsLoading(false);
			} catch (error) {
				message.error('Something went wrong. Redirecting to home page.');
				navigate('/home');
			}
		};
		fetchData();
	}, [getShareAndEarn, navigate]);
	const handleCopyLink = () => {
		navigator.clipboard.writeText(referralLink);
		message.success('Copied to clipboard');
	};

	if (isLoading) {
		return null;
	}

	const referralDetails = referralData?.referralDetails;
	const referralLink = referralDetails?.referralCode
		? `https://ve.ai?referralCode=${referralDetails.referralCode}`
		: '';

	return (
		<div className="shareAndEarnParentContainer">
			<div className="shareAndEarnTextContainer">
				<h1 className="shareAndEarnMainText">
					Get your friends to Ve and earn while you're at it!
				</h1>
				<h2 className="shareEarnSubText">
					You get {referralDetails?.referralPlan?.refereeRewardInPercentage}% and your
					friends receive {referralDetails?.referralPlan?.referrerRewardInPercentage}%
					discount when you refer them
				</h2>
			</div>
			<div className="refferalLinkContainer">
				<h3 className="refferalLinkText">Your Affiliate Code</h3>
				<div className="linkInputContainer">
					<input type="text" defaultValue={referralLink} readOnly />
					<button className="linkCopyButton" onClick={handleCopyLink}>
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
