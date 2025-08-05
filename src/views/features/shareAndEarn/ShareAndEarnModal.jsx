import { memo, useContext, useState, useEffect } from 'react';
import ReactModal from '../../components/modalsV2';
import { ReactComponent as Copy } from '../../../assets/svg/shareAndEarn/copy.svg';
import { message } from '../../components/globalComponents/CustomToast';
import Context from '../../../context/context';
import { REFERRAL_BASE_URL } from '../../../helpers/ConstantUrls';
import './shareAndEarnModal.scss';

const ShareAndEarnModal = ({ isOpen, closeModal }) => {
	const {
		subscriptionInfo: { getShareAndEarn, referralData },
	} = useContext(Context);

	const [copyText, setCopyText] = useState('Copy');

	const referralDetails = referralData?.referralDetails;
	const referralLink = referralDetails?.referralCode
		? `${REFERRAL_BASE_URL}/${referralDetails.referralCode}`
		: '';
	const displayValue = referralDetails?.referralCode || '';

	useEffect(() => {
		if (isOpen) {
			fetchData();
		}
	}, [isOpen]);

	const fetchData = async () => {
		try {
			const response = await getShareAndEarn();

			if (!response?.referralDetails) {
				message.error('Invalid response received');
				closeModal();
				return;
			}
		} catch (error) {
			message.error(error.message || 'Something went wrong.');
			closeModal();
		}
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(referralLink);
		message.success('Copied to clipboard');
		setCopyText('Copied!');

		// Reset the text back to "Copy" after 2 seconds
		setTimeout(() => {
			setCopyText('Copy');
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
				<div className="modalHeader">
					<h1 className="modalMainText">
						Get your friends to Ve and earn while you're at it!
					</h1>
					<h2 className="modalSubText">
						Get {referralDetails?.referralPlan?.referrerRewardInPercentage || 10}% on
						your friends 1st payment
					</h2>
				</div>

				<div className="referralCodeContainer">
					<div className="codeInputWrapper">
						<div className="codeInput">
							<span className="codeText" onClick={handleCopyLink}>
								{displayValue}
							</span>
						</div>
					</div>

					<button className="copyButton" onClick={handleCopyLink}>
						<div className="copyIcon">
							<Copy />
						</div>
						<span className="copyText">{copyText}</span>
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ShareAndEarnModal);
