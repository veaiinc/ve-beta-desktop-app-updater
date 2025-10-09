// import React from 'react';
import { useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/gallery/modals/deletePopup.scss';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as WarningSvg } from '../../../../assets/svg/gallery/warning.svg';
import { message } from '../../globalComponents/CustomToast';
const DeletePopup = ({
	open,
	closeModal,
	title,
	paragraph,
	handleDelete,
	isTagDelete,
	deleteType,
	handleDeleteTypeChange,
	currentTitle = null,
}) => {
	const [inputValue, setInputValue] = useState('');
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};

	const handleDeleteConfirm = () => {
		if (inputValue === currentTitle) {
			handleDelete();
		} else {
			message.error('Invalid input');
		}
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
				{!isTagDelete && (
					<>
						{currentTitle && (
							<div className="deletePopupParagraph">
								Copy and paste "{currentTitle}" to Permanently Delete {title}.
							</div>
						)}
						<input
							className="deletePopupInput"
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder={`Paste here`}
						/>
					</>
				)}

				<div className="deletePopupContent">
					{/* <div className="deletePopupHeading">Delete {title}</div> */}
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
							onClick={handleDeleteConfirm}
							disabled={!inputValue.trim()}
							style={{
								cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
								opacity: inputValue.trim() ? 1 : 0.5,
							}}
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
