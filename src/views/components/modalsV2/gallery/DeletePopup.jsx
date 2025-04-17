import React from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/gallery/modals/deletePopup.scss';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as WarningSvg } from '../../../../assets/svg/gallery/warning.svg';
const DeletePopup = ({
	open,
	closeModal,
	title,
	paragraph,
	handleDelete,
	isTagDelete,
	deleteType,
	handleDeleteTypeChange,
}) => {
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};
	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={customStyles}
		>
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
				{isTagDelete ? (
					<div className="deletePopupButtonContainer">
						{isTagDelete && (
							<div className="deletePopupSelectContainer">
								<select value={deleteType} onChange={handleDeleteTypeChange}>
									<option value="delete_images">Delete Tag and Images </option>
									<option value="remove_images">Delete Tag</option>
								</select>
							</div>
						)}
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
				) : (
					<div style={{ alignSelf: 'flex-end' }}>
						<button
							className="deletePopupDeleteButton"
							onClick={handleDelete}
							style={{ cursor: 'pointer' }}
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</ReactModal>
	);
};

export default DeletePopup;
