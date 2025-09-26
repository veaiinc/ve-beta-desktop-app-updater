import { memo, useCallback, useContext, useRef, useState, useEffect } from 'react';
import '../../../../assets/scss/subscriptions/exoiredSubscriptionModal.scss';
import ReactModal from '../index';
import Context from '../../../../context/context';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import Spinner from '../../loaders/Spinner';
import logout from '../../../../helpers/logout';
import useBroadcastChannel from '../../../../hooks/useBroadcastChannel';

const ExpiredTokenModal = () => {
	const intervalRef = useRef(null);
	const channel = useBroadcastChannel();
	const {
		subscriptionInfo: { updateTokenExpiryState, expiredTokenModal },
	} = useContext(Context);

	const [info, setInfo] = useState({
		countDown: 3,
	});

	const closeModal = useCallback(() => {
		updateTokenExpiryState({ expiredTokenModal: false });
	}, []);

	useEffect(() => {
		if (expiredTokenModal) {
			intervalRef.current = setInterval(() => {
				if (info.countDown === 0) {
					logout();
					channel.postMessage('reload');
					closeModal();
				} else {
					setInfo((prev) => ({ ...prev, countDown: prev.countDown - 1 }));
				}
			}, 1000);
			return () => clearInterval(intervalRef.current);
		}
	}, [expiredTokenModal, info.countDown]);

	return (
		<ReactModal
			isOpen={expiredTokenModal}
			closeModal={closeModal}
			// customStyles={customStyles}
		>
			<div className="expiredSubscriptionParentContainerModal">
				<div className="expiredSubscriptionModalHeader">
					<span className="expiredModalHeaderText">
						Your session has <br></br>Expired !
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
						Logging Out in {info.countDown}s
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
