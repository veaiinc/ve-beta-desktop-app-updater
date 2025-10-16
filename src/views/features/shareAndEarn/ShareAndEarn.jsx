import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/shareAndEarn/shareAndEarn.scss';
import { ReactComponent as Copy } from '../../../assets/svg/shareAndEarn/copy.svg';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import { message } from '../../components/globalComponents/CustomToast';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { SHARE_AND_EARN_KIT_URL, REFERRAL_BASE_URL } from '../../../helpers/ConstantUrls';
import { copyToClipboard } from '../../../helpers/clipboardHelper';

const ShareAndEarn = () => {
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const {
		subscriptionInfo: { getShareAndEarn, referralData },
	} = useContext(Context);
	const referralDetails = referralData?.referralDetails;
	const referralLink = referralDetails?.referralCode
		? `${REFERRAL_BASE_URL}/${referralDetails.referralCode}`
		: '';
	const displayValue = referralDetails?.referralCode || '';

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await getShareAndEarn();

			if (!response?.referralDetails) {
				message.error('Invalid response received');
				navigate('/home');
				return;
			}
			setIsLoading(false);
		} catch (error) {
			message.error(error.message || 'Something went wrong. Redirecting to home page.');
			navigate('/home');
		}
	};
	const handleCopyLink = async () => {
		if (!referralLink) {
			message.error('No referral link available to copy');
			return;
		}

		try {
			const success = await copyToClipboard(referralLink, {
				onSuccess: () => {
					message.success('Copied to clipboard');
				},
				onError: (error) => {
					console.error('Copy failed:', error);
					message.error('Failed to copy to clipboard. Please try again.');
				},
			});

			if (!success) {
				message.error('Failed to copy to clipboard. Please try again.');
			}
		} catch (error) {
			console.error('Copy error:', error);
			message.error('Failed to copy to clipboard. Please try again.');
		}
	};
	return (
		<>
			{isLoading ? (
				<UpdatedPageLoader />
			) : (
				<div className="shareAndEarnParentContainer">
					<div className="shareAndEarnTextContainer">
						<h1 className="shareAndEarnMainText">
							Get your friends to Ve and earn while you're at it!
						</h1>
						<h2 className="shareEarnSubText">
							You get {referralDetails?.referralPlan?.referrerRewardInPercentage}% and
							your friends receive{' '}
							{referralDetails?.referralPlan?.refereeRewardInPercentage}% discount
							when you refer them
						</h2>
					</div>
					<div className="refferalLinkContainer">
						<h3 className="refferalLinkText">Your Affiliate Code</h3>
						<div className="linkInputContainer">
							<input type="text" defaultValue={displayValue} readOnly />
							<button className="linkCopyButton" onClick={handleCopyLink}>
								<Copy />
								<span>Copy</span>
							</button>
						</div>
					</div>
					<div className="imageContainer">
						<div className="image">
							<img
								src={'https://ap.images.ve.ai/public/dashboard/devices.png'}
								alt="share and earn"
							/>
						</div>
						<h2 className="imageTitle">Your Success Blueprint</h2>
						<h3 className="imageSubText">
							We made it super easy to earn money by referring Ve. Just use our kit—it
							has everything you need to start making cash without any hassle.
						</h3>
						<button
							className="getKitButton"
							onClick={() => window.open(SHARE_AND_EARN_KIT_URL, '_blank')}
						>
							<span>Get the kit</span>
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(ShareAndEarn);
