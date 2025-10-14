import React, { memo } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/gallery/modals/deletePopup.scss';

const customStyles = {
	content: { zIndex: 10001 },
	overlay: { zIndex: 10000 },
};

const DeleteAlbumImagesPopup = ({
	open,
	closeModal,
	galleryId,
	title,
	paragraph,
	handleDeleteImages,
}) => {
	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="deletePopupMainContainer">
				<div className="headingContainer">
					<p className="heading">{title}</p>
					<p className="paragraph">{paragraph}</p>
				</div>
				<div className="buttonContainer">
					<p style={{ backgroundColor: '#EA4F4F' }} onClick={() => handleDeleteImages()}>
						Yes, Delete
					</p>
					<p onClick={closeModal}>Cancel</p>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(DeleteAlbumImagesPopup);
