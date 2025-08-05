import React, { memo, useCallback, useContext } from 'react';
import '../../../../assets/scss/subscriptions/exoiredSubscriptionModal.scss';
import ReactModal from '../index';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import Spinner from '../../loaders/Spinner';
import logout from '../../../../helpers/logout';
import useBroadcastChannel from '../../../../hooks/useBroadcastChannel';

const ExpiredTokenModal = () => {
	const channel = useBroadcastChannel();
	const {
		subscriptionInfo: { updateTokenExpiryState, expiredTokenModal },
	} = useContext(Context);
	const closeModal = useCallback(() => {
		updateTokenExpiryState({ expiredTokenModal: false });
	}, []);

	return (
		<ReactModal
			isOpen={expiredTokenModal}
			closeModal={closeModal}
			// customStyles={customStyles}
		>
			<div className="expiredSubscriptionParentContainerModal">
				<div className="expiredSubscriptionModalHeader">
					<span className="expiredModalHeaderText">
						Your token has been <br></br>Expired !
					</span>
					<span className="closeExpiredModalWrapper" onClick={closeModal}>
						<Close />
					</span>
				</div>
				<span className="expiredSubText">
					Re login to enjoy uninterrupted access to premium features and services.
				</span>
				<div className="expiredActionBtnContainer">
					<div className="renewSubscriptionContainer">
						Logging Out in 5s
						<Spinner width={'16px'} height={'16px'} />
					</div>
					<div
						className="contactSupportButton"
						onClick={() => {
							logout();
							channel.postMessage('reload');
						}}
					>
						Log out
					</div>
				</div>
			</div>
			;
		</ReactModal>
	);
};
export default memo(ExpiredTokenModal);
