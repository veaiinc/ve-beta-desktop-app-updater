import React, { useCallback } from 'react';
import Notification from './Notification';
import '../../../assets/scss/notification/uploadLogoNotification.scss';
import Close from '../../../assets/svg/close.svg?react';
import Warning from '../../../assets/svg/notification/notificationWarning.svg?react';
import { useNavigate } from 'react-router-dom';
const UploadLogoNotification = ({ onClose, open }) => {
	const navigate = useNavigate();

	const uploadLogoBtnClickRedirection = useCallback(() => {
		navigate('/settings/public-information');
	}, []);

	return (
		<Notification open={open} onClose={onClose} width={417}>
			<div className="uploadLogoNotificationContainer">
				<div className="uploadLogoContentContainer">
					<Warning />
					<div className="actualContentHolder">
						<div className="uploadLogoHeaderTextWrapper">
							<span className="uploadLogoNotificationHeader">
								Failed to send Smart FIle
							</span>
							<span className="uploadLogoNotificationHeaderSubText">
								Upload Logo in Account Settings to use this feature
							</span>
						</div>
						<div className="uploadLogoFooterContainer">
							<div
								className="uploadLogoNotificationBtn"
								onClick={uploadLogoBtnClickRedirection}
							>
								Upload logo
							</div>
							<div className="mayBeLaterButton" onClick={onClose}>
								Maybe, Later
							</div>
						</div>
					</div>
					<span className="svgHolder" onClick={onClose}>
						<Close />
					</span>
				</div>
			</div>
		</Notification>
	);
};

export default UploadLogoNotification;
