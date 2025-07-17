import React, { memo } from 'react';
import ReactModal from '../../modalsV2';

const texts = {
	immediate: {
		heading: 'These images only shows in Published Albums',
		title1: 'Users will see images from these albums ',
		title2: 'Users can’t see images from these albums',
	},
	all: {
		heading: 'Image Visibility Based on Album Status',
		title1: 'Images in these albums are visible to users: ',
		title2: 'Images in these albums are hidden from users:',
	},
};
const NotifyPopup = ({ info, setinfo }) => {
	const closePopup = () => {
		setinfo((prev) => ({
			...prev,
			isNotifyPopupOpen: false,
		}));
	};
	return info?.notifyType === 'immediate' || info?.notifyType === 'all' ? (
		<ReactModal isOpen={info?.isNotifyPopupOpen || false} closeModal={closePopup}>
			<div className="notify-popup">
				<h1>Are you sure you want to refresh?</h1>

				<div className="options_div">
					<button className="back-to-gallery-button">Cancel</button>
					<button className="re-upload-button">Yes, Continue</button>
				</div>
			</div>
		</ReactModal>
	) : null;
};

export default memo(NotifyPopup);
