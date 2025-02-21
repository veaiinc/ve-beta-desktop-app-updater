import React, { useState } from 'react';
import { Modal } from 'antd';
import ReactModal from '../modalsV2';
import '../../../assets/scss/accessPopups/accessDeniedPopup.scss';

const AccessDeniedPopup = ({ open, closeModal }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="access-denied-popup-container">
				<div className="access-denied-popup-content">
					<div className="access-denied-popup-title">Access Denied</div>
					<div className="access-denied-popup-description">
						Please reach out to your administrator to gain access to this module.
					</div>
				</div>
				{/* <div className="access-denied-popup-buttons">
					<button className="access-denied-contact-button">Contact Support</button>
					<button className="access-denied-popup-button">Renew Now</button>
				</div> */}
			</div>
		</ReactModal>
	);
};

export default AccessDeniedPopup;
