import { memo, useContext, useState, useEffect } from 'react';
import ReactModal from '../../components/modalsV2';
import { ReactComponent as Copy } from '../../../assets/svg/shareAndEarn/copy.svg';
import { message } from '../../components/globalComponents/CustomToast';
import Context from '../../../context/context';
import { REFERRAL_BASE_URL } from '../../../helpers/ConstantUrls';
import './shareAndEarnModal.scss';
import Skeleton from 'react-loading-skeleton';

const ShareAndEarnModal = ({ isOpen, closeModal }) => {
	const {
		subscriptionInfo: { getShareAndEarn, referralData },
	} = useContext(Context);
	const [info, setInfo] = useState({
		copyText: 'Copy',
		isLoading: false,
	});

	const referralDetails = referralData?.referralDetails;
	const referralLink = referralDetails?.referralCode
		? `${REFERRAL_BASE_URL}/${referralDetails.referralCode}`
		: '';
	const displayValue = referralDetails?.referralCode || '';

	useEffect(() => {
		if (isOpen && !referralData?.referralDetails) {
			fetchData();
		}
	}, [isOpen, referralData]);

	const fetchData = async () => {
		try {
			setInfo((prev) => ({ ...prev, isLoading: true }));
			const response = await getShareAndEarn();

			if (!response?.referralDetails) {
				message.error('Invalid response received');
				closeModal();
				return;
			}
			setInfo((prev) => ({ ...prev, isLoading: false }));
		} catch (error) {
			setInfo((prev) => ({ ...prev, isLoading: false }));
			message.error(error.message || 'Something went wrong.');
			closeModal();
		}
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(referralLink);
		message.success('Copied to clipboard');
		setInfo((prev) => ({ ...prev, copyText: 'Copied!' }));

		// Reset the text back to "Copy" after 2 seconds
		setTimeout(() => {
			setInfo((prev) => ({ ...prev, copyText: 'Copy' }));
		}, 2000);
	};

	const customStyles = {
		content: {
			width: '580px',
			maxWidth: '90vw',
			height: 'auto',
			maxHeight: '90vh',
			overflow: 'auto',
		},
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			customStyles={customStyles}
			shouldCloseOnOverlayClick={true}
		>
			<div className="shareAndEarnModalContainer">
				<div className="shareHeader">
					<h1 className="shareHeaderText">
						Get your friends to Ve and earn while you're at it!
					</h1>
					<h2 className="shareHeaderSubText">
						Get {referralDetails?.referralPlan?.referrerRewardInPercentage || 10}% on
						your friends 1st payment
					</h2>
				</div>

				<div className="referralCodeContainer">
					<div className="codeInputWrapper">
						<div className="codeInput">
							<span className="codeText" onClick={handleCopyLink}>
								{info?.isLoading ? (
									<Skeleton width={200} height={20} baseColor="var(--card)" highlightColor="gray" />
								) : (
									displayValue
								)}
							</span>
						</div>
					</div>

					<button
						className="copyButton"
						onClick={handleCopyLink}
						disabled={info?.isLoading}
					>
						<div className="copyIcon">
							<Copy />
						</div>
						<span className="copyText">{info?.copyText}</span>
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ShareAndEarnModal);
