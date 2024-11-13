import React from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/gallery/modals/deletePopup.scss';

const DeletePopup = ({ open, closeModal, title, paragraph, handleDelete }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="deletePopupMainContainer">
				<div className="headingContainer">
					<p className="heading">{title}</p>
					<p className="paragraph">{paragraph}</p>
				</div>
				<div className="buttonContainer">
					<p style={{ backgroundColor: '#EA4F4F' }} onClick={handleDelete}>
						Yes, Delete
					</p>
					<p onClick={closeModal}>Cancel</p>
				</div>
			</div>
		</ReactModal>
	);
};

export default DeletePopup;
