import React, { memo, useCallback, useContext } from 'react';
import '../../../../assets/scss/subscriptions/exoiredSubscriptionModal.scss';
import ReactModal from '../index';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Arrow } from '../../../../assets/svg/subscription/diagonalArrow.svg';
import { useNavigate } from 'react-router-dom';
const ExpiredSubscriptionModal = () => {
	let {
		subscriptionInfo: { validateExpiryData, updateSubscriptionState, expiredSubscriptionModal },
	} = useContext(Context);
	const navigate = useNavigate();
	const closeModal = useCallback(() => {
		updateSubscriptionState({ expiredSubscriptionModal: false });
	}, []);
	const handleRenewSubscirption = useCallback(() => {
		navigate('/subscription');
		closeModal();
	}, []);
	return (
		<ReactModal
			isOpen={expiredSubscriptionModal}
			closeModal={closeModal}
			// customStyles={customStyles}
		>
			<div className="expiredSubscriptionParentContainerModal">
				<div className="expiredSubscriptionModalHeader">
					<span className="expiredModalHeaderText">
						Your Plan has been <br></br>Expired !
					</span>
					<span className="closeExpiredModalWrapper" onClick={closeModal}>
						<Close />
					</span>
				</div>
				<span className="expiredSubText">
					Renew now to continue enjoying uninterrupted access to premium features and
					services.
				</span>
				<div className="expiredActionBtnContainer">
					<div className="renewSubscriptionContainer" onClick={handleRenewSubscirption}>
						Renew Now
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
	);
};
export default memo(ExpiredSubscriptionModal);
