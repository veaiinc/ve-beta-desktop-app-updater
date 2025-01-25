import React, { memo } from 'react';
import ReactModal from '../index';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/tasks/dustBin.svg';
import '../../../../assets/scss/ai_assistant/instructionModal.scss';
import ActionButton from '../../ai_assistant/ActionButton';
import InputComponent from '../../ai_assistant/InputComponent';
import TextareaComponent from '../../ai_assistant/TextareaComponent';
const InstructionModal = ({
	isOpen,
	onClose,
	onActionClick,
	showDelete,
	onDeleteClick,
	title,
	instruction,
	onTitleChange,
	onInstructionChange,
	isActionbtnLoading,
	isDeletebtnLoading,
}) => {
	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
		>
			<div className="instruction-modal">
				<div className="instruction-modal-header">
					<h2>Instructions</h2>
					<CloseSvg onClick={onClose} />
				</div>
				<div className="instruction-modal-body">
					<InputComponent placeholder="Title" value={title} onChange={onTitleChange} />

					<TextareaComponent
						placeholder="Add Instructions"
						value={instruction}
						onChange={onInstructionChange}
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
						Add and make active
					</ActionButton>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(InstructionModal);
