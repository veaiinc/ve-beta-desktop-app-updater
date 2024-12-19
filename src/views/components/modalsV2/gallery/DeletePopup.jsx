import React from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/gallery/modals/deletePopup.scss';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as WarningSvg } from '../../../../assets/svg/gallery/warning.svg';

const DeletePopup = ({ open, closeModal, title, paragraph, handleDelete }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="deletePopupContainer">
				<div className="deletePopupCloseButton" onClick={closeModal}>
					<CrossSvg style={{ cursor: 'pointer' }} />
				</div>
				<div style={{ alignSelf: 'center' }}>
					<WarningSvg />
				</div>
				<div className="deletePopupContent">
					<div className="deletePopupHeading">Delete {title}</div>
					<div className="deletePopupParagraph">
						You cannot undo this. All your {paragraph} and information will be lost .
					</div>
				</div>
				<div style={{ alignSelf: 'flex-end' }}>
					<button
						className="deletePopupDeleteButton"
						onClick={handleDelete}
						style={{ cursor: 'pointer' }}
					>
						Delete
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default DeletePopup;
