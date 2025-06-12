import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/subscriptions/exoiredSubscriptionModal.scss'; // Note: Typo 'exoired' should be 'expired'
import ReactModal from '../index';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Arrow } from '../../../../assets/svg/subscription/diagonalArrow.svg';
import AddOnCards from '../../settings/planbilling/addOnCards';

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};

const BYTES_PER_GB = 1073741824;

const ExpiredSubscriptionModal = () => {
	const {
		profileInfo: { tenantUserAccessControls },
		subscriptionInfo: {
			validateExpiryData,
			updateSubscriptionState,
			expiredSubscriptionModal,
			getAllSubscriptionPlan,
			expiredSubscriptionType,
			currentPlan,
		},
	} = useContext(Context);

	const isAdmin = tenantUserAccessControls?.role === 'admin';

	const [info, setInfo] = useState({
		isAddOnOpen: false,
		dataUsed: null,
		dataLimit: null,
	});

	// Mapper for subscription types to dataUsed and dataLimit
	const subscriptionTypeConfig = {
		'Classic-Gallery': {
			dataUsed: currentPlan?.storageUsedInBytes
				? Number((currentPlan.storageUsedInBytes / BYTES_PER_GB).toFixed(2))
				: 0,
			dataLimit: currentPlan?.storageLimitInBytes
				? Number((currentPlan.storageLimitInBytes / BYTES_PER_GB).toFixed(2))
				: 0,
		},
		'Lite-Gallery': {
			dataUsed: currentPlan?.liteImageUsed ?? 0,
			dataLimit: currentPlan?.liteImageLimit ?? 0,
		},
		Tenants: {
			dataUsed: currentPlan?.tenantUsers ?? 0,
			dataLimit: currentPlan?.tenantUsersLimit ?? 0,
		},
		'Knowledge-Agent': {
			dataUsed: currentPlan?.knowledgeAgentUsed ?? 0,
			dataLimit: currentPlan?.knowledgeAgentLimit ?? 0,
		},
		'Conversational-Agent': {
			dataUsed: currentPlan?.conversationalAgentUsed ?? 0,
			dataLimit: currentPlan?.conversationalAgentLimit ?? 0,
		},
	};

	useEffect(() => {
		const config = subscriptionTypeConfig[expiredSubscriptionType] || {
			dataUsed: null,
			dataLimit: null,
		};

		setInfo((prev) => ({
			...prev,
			dataUsed: config.dataUsed,
			dataLimit: config.dataLimit,
		}));
	}, [expiredSubscriptionType, currentPlan]);

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
	}, [closeModal, getAllSubscriptionPlan]);

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
								Your Plan has been <br />
								Expired!
							</span>
						) : (
							<span className="expiredModalHeaderText">
								You have reached the limit of your{' '}
								{expiredSubscriptionType === 'Tenants'
									? 'Tenants Users Count'
									: expiredSubscriptionType}
								.
							</span>
						)}
						<span className="closeExpiredModalWrapper" onClick={closeModal}>
							<Close />
						</span>
					</div>
					{expiredSubscriptionType && (
						<div className="progressBarMainContainer">
							<div className="progressBarTextContainer">
								{info?.dataUsed} out of {info?.dataLimit}
							</div>
							<div className="progressBarContainer">
								<div
									className="progressBar"
									style={{
										width: `${
											info?.dataLimit
												? Math.min(
														(info.dataUsed / info.dataLimit) * 100,
														100,
												  )
												: 0
										}%`,
									}}
								/>
							</div>
						</div>
					)}
					<span className="expiredSubText">
						{isAdmin
							? 'Upgrade your plan to continue.'
							: 'Contact your Admin to upgrade the current plan.'}
					</span>
					{isAdmin && (
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
					)}
				</div>
			</ReactModal>
			<AddOnCards
				isOpen={info?.isAddOnOpen}
				closeModal={handleCloseAddOn}
				subscriptionState={currentPlan?.isPaidPlan ? 'addOnPlans' : 'upgradeSubscription'}
			/>
		</>
	);
};

export default memo(ExpiredSubscriptionModal);
