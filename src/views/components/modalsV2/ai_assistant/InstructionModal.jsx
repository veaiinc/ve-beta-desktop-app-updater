import React, { memo } from 'react';
import ReactModal from '../index';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/tasks/dustBin.svg';
import '../../../../assets/scss/ai_assistant/modal/instructionModal.scss';
import ActionButton from '../../ai_assistant/ActionButton';
import InputComponent from '../../ai_assistant/InputComponent';
import TextareaComponent from '../../ai_assistant/TextareaComponent';
import Spinner from '../../loaders/Spinner';

const InstructionModal = ({
	isOpen,
	onClose,
	onActionClick,
	showDelete,
	onDeleteClick,
	title = '',
	instruction = '',
	onTitleChange,
	onInstructionChange,
	isActionbtnLoading,
	isDeletebtnLoading,
	instructionEditing,
}) => {
	const handleTitleChange = (e) => {
		if (onTitleChange) {
			onTitleChange(e.target.value);
		}
	};

	const handleInstructionChange = (e) => {
		if (onInstructionChange) {
			onInstructionChange(e.target.value);
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
		>
			<div className="instruction-modal">
				<div className="instruction-modal-header">
					<h2>{instructionEditing ? 'Edit Instruction' : 'Add Instruction'}</h2>
					<CloseSvg onClick={onClose} />
				</div>
				<div className="instruction-modal-body">
					<InputComponent
						placeholder="Title"
						value={title}
						onChange={handleTitleChange}
					/>

					<TextareaComponent
						placeholder="Add Instructions"
						value={instruction}
						onChange={handleInstructionChange}
					/>
				</div>
				<div className="instruction-modal-footer">
					<div>
						{showDelete && (
							<button
								onClick={onDeleteClick ? onDeleteClick : onClose}
								className="instruction-modal-footer-delete-button"
								disabled={isDeletebtnLoading}
							>
								<DeleteSvg />
							</button>
						)}
					</div>
					<ActionButton
						onClick={onActionClick ? onActionClick : onClose}
						disabled={
							title?.trim()?.length === 0 ||
							instruction?.trim()?.length === 0 ||
							isActionbtnLoading
						}
					>
						{isActionbtnLoading ? (
							<span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
								{instructionEditing ? 'Updating' : 'Creating'}{' '}
								<Spinner width="15px" height="15px" />
							</span>
						) : instructionEditing ? (
							'Update instruction'
						) : (
							'Add and make active'
						)}
					</ActionButton>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(InstructionModal);
