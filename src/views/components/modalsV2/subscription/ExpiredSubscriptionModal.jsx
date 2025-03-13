import React, { memo, useCallback, useContext, useState } from 'react';
import '../../../../assets/scss/subscriptions/exoiredSubscriptionModal.scss';
import ReactModal from '../index';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Arrow } from '../../../../assets/svg/subscription/diagonalArrow.svg';
import AddOnCards from '../../settings/planbilling/addOnCards';

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};
const ExpiredSubscriptionModal = () => {
	let {
		subscriptionInfo: {
			validateExpiryData,
			updateSubscriptionState,
			expiredSubscriptionModal,
			getAllSubscriptionPlan,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		isAddOnOpen: false,
	});

	const closeModal = useCallback(() => {
		updateSubscriptionState({ expiredSubscriptionModal: false });
	}, []);
	const handleRenewSubscirption = useCallback(async () => {
		closeModal();
		getAllSubscriptionPlan();
		setInfo((prev) => ({
			...prev,
			isAddOnOpen: true,
		}));
	}, []);

	const handleCloseAddOn = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			isAddOnOpen: false,
		}));
	}, []);

	return (
		<>
			<ReactModal
				isOpen={expiredSubscriptionModal}
				closeModal={closeModal}
				customStyles={customStyles}
			>
				<div className="expiredSubscriptionParentContainerModal">
					<div className="expiredSubscriptionModalHeader">
						{validateExpiryData?.isExpired ? (
							<span className="expiredModalHeaderText">
								Your Plan has been <br></br>Expired !
							</span>
						) : (
							<span className="expiredModalHeaderText">
								You may have either crossed the provided limit ,check your plan
								once!
							</span>
						)}
						<span className="closeExpiredModalWrapper" onClick={closeModal}>
							<Close />
						</span>
					</div>
					<span className="expiredSubText">
						Renew now to continue enjoying uninterrupted access to premium features and
						services.
					</span>
					<div className="expiredActionBtnContainer">
						<div
							className="renewSubscriptionContainer"
							onClick={handleRenewSubscirption}
						>
							Upgrade Now
							<Arrow />
						</div>
						<div
							className="contactSupportButton"
							onClick={() => (window.location.href = 'mailto:support@ve.ai')}
						>
							Contact support
						</div>
					</div>
				</div>
				;
			</ReactModal>
			<AddOnCards
				isOpen={info?.isAddOnOpen}
				closeModal={handleCloseAddOn}
				subscriptionState={'upgradeSubscription'}
			/>
		</>
	);
};
export default memo(ExpiredSubscriptionModal);
