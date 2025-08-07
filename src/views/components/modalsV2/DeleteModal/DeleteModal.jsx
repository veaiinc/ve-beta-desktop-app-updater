import React, { useState } from 'react';
import ReactModal from '..';
import './deleteModal.scss';

const DeleteModal = ({
	isOpen,
	onClose,
	onConfirm,
	title = 'Delete Form?',
	description,
	warning = 'This action cannot be undone, and all responses collected will be permanently removed.',
	cancelText = 'Cancel',
	confirmText = 'Delete Permanently',
	itemType = 'form',
	responseCount = 0,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const getDescription = () => {
		if (description) return description;

		if (responseCount > 0) {
			return `This ${itemType} has ${responseCount} response${
				responseCount === 1 ? '' : 's'
			}.`;
		}

		return `Are you sure you want to delete this ${itemType}?`;
	};

	const handleConfirm = async () => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			await onConfirm();
		} catch (error) {
			console.error('Delete operation failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			shouldCloseOnOverlayClick={true}
			customStyles={{
				content: {
					zIndex: 9999,
				},
				overlay: {
					zIndex: 9998,
				},
			}}
		>
			<div className="delete-modal">
				<div className="delete-modal__header-group">
					<h1 className="delete-modal__title">{title}</h1>
					<p className="delete-modal__desc">{getDescription()}</p>
				</div>
				<div className="delete-modal__desc-warning-group">
					<p className="delete-modal__warning">{warning}</p>
				</div>
				<div className="delete-modal__button-group">
					<button
						className="delete-modal__button delete-modal__button--cancel"
						onClick={onClose}
						disabled={isLoading}
					>
						{cancelText}
					</button>
					<button
						className="delete-modal__button delete-modal__button--delete"
						onClick={handleConfirm}
						disabled={isLoading}
					>
						{isLoading ? 'Deleting...' : confirmText}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default DeleteModal;
