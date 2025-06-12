import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
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
const BYTES_PER_GB = 1073741824;
const ExpiredSubscriptionModal = () => {
	let {
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
	useEffect(() => {
		if (expiredSubscriptionType === 'Classic-Gallery') {
			setInfo((prev) => ({
				...prev,
				dataUsed: Number((storageUsedInBytes / BYTES_PER_GB).toFixed(2)),
				dataLimit: Number((storageLimitInBytes / BYTES_PER_GB).toFixed(2)),
			}));
		} else if (expiredSubscriptionType === 'Lite-Gallery') {
			setInfo((prev) => ({
				...prev,
				dataUsed: currentPlan?.liteImageUsed,
				dataLimit: currentPlan?.liteImageLimit,
			}));
		} else if (expiredSubscriptionType === 'Tenants') {
			setInfo((prev) => ({
				...prev,
				dataUsed: currentPlan?.tenantUsers,
				dataLimit: currentPlan?.tenantUsersLimit,
			}));
		} else if (expiredSubscriptionType === 'Knowledge-Agent') {
			setInfo((prev) => ({
				...prev,
				dataUsed: currentPlan?.knowledgeAgentUsed,
				dataLimit: currentPlan?.knowledgeAgentLimit,
			}));
		} else if (expiredSubscriptionType === 'Conversational-Agent') {
			setInfo((prev) => ({
				...prev,
				dataUsed: currentPlan?.conversationalAgentUsed,
				dataLimit: currentPlan?.conversationalAgentLimit,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				dataUsed: null,
				dataLimit: null,
			}));
		}
	}, [expiredSubscriptionType]);
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
								You have reached the limit of your{' '}
								{`${
									expiredSubscriptionType === 'Tenants'
										? 'Tenants Users Count'
										: expiredSubscriptionType
								}`}
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
										width: `${Math.min(
											(info?.dataUsed / info?.dataLimit) * 100,
											100,
										)}%`,
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
