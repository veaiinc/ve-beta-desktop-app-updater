import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/gallery/modals/shareModal.scss';
import { ReactComponent as Copy } from '../../../../assets/svg/gallery/copy.svg';
import { ReactComponent as Mail } from '../../../../assets/svg/gallery/mail.svg';
import ToggleSlider from '../../input/slider';

const ShareModal = ({ open, closeModal }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'right'}>
			<div className="shareMainContainer">
				<div className="shareHeadingContainer">
					<b className="shareHeading">Share</b>
					<p className="subheading">
						You can share your gallery and manage Gallery Protection
					</p>
				</div>
				<p className="line"></p>
				<div className="galleryLinkContainer">
					<p>Gallery link</p>
					<div className="galleryLinkInputContainer">
						<div className="galleryLinkInput">
							<input placeholder="tussgabscgausgcharxyz//ail.com" />
							<div>
								<Copy />
							</div>
						</div>
						<div className="shareViaMail">
							<input placeholder="Share via mail" />
							<div>
								<Mail />
							</div>
						</div>
					</div>
				</div>
				<p className="line"></p>
				<div className="optionsContainer">
					<div className="optionsToggleContainer">
						<ToggleSlider />
						<p>Gallery protection</p>
					</div>
					<p>Protect your gallery with Client & Guest PIN</p>
				</div>
				<div className="optionsContainer">
					<div className="optionsToggleContainer">
						<ToggleSlider />
						<p>Download</p>
					</div>
					<p>Who all can download the photos</p>
				</div>
				<div className="optionsContainer">
					<p>Visitors Details Form</p>
					<div className="toggleContainer">
						<div style={{ width: '32px' }}>
							<ToggleSlider />
						</div>
						<p>
							If enabled, guests will be required to input their name, email ID, and
							mobile number after entering a Pin or completing a face scan.
						</p>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ShareModal);
