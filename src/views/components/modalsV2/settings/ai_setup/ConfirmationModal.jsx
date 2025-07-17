import React, { memo } from 'react';
import ReactModal from '../..';
import '../../../../../assets/scss/settings/aiSetup/confirmationModal.scss';
import Spinner from '../../../loaders/Spinner';
const ConfirmationModal = ({ open, close, onConfirm, title, description, loading = false }) => {
	return (
		<ReactModal isOpen={open} closeModal={close} customStyles={{ overlay: { zIndex: 1003 } }}>
			<div className="confirmationModalContainer">
				{title && <h1 className="title">{title}</h1>}
				{description && <p className="description">{description}</p>}
				<div className="buttonContainer">
					<button className="cancelButton" onClick={close}>
						Cancel
					</button>
					<button className="confirmButton" onClick={onConfirm} disabled={loading}>
						{loading ? <Spinner /> : 'Confirm'}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ConfirmationModal);
