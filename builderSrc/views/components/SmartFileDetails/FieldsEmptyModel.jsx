import React, { memo } from 'react';
import ReactModal from '../ui-components/modal';
import { ReactComponent as Warning } from '../../../assets/svg/smartFile/red-warning.svg';
import '../../../assets/scss/smart-file-components/fieldsEmptyModal.scss';
import { ReactComponent as Warn } from '../../../assets/svg/document/warn.svg';

const FieldsEmptyModel = ({
	isOpen,
	closeModal,
	emptyFields = [],
	onFillFields,
	onContinueAnyway,
}) => {
	const handleFillFields = () => {
		if (onFillFields) {
			onFillFields();
		}
		closeModal();
	};

	const handleContinueAnyway = () => {
		if (onContinueAnyway) {
			onContinueAnyway();
		}
		closeModal();
	};

	const handleClose = () => {
		closeModal();
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001, backgroundColor: 'var(--backdrop)' },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="fieldsEmptyModalParentContainer">
				<Warning />
				<div className="fieldsEmptyModalTextContainer">
					<span className="fieldsEmptyModalHeaderText">Input Field Is Empty</span>
					<span className="fieldsEmptyModalSubtext">
						You haven't filled in the following required field(s). Providing this
						information helps us personalize your experience.
					</span>
					<div className="emptyFieldsList">
						<div className="missingFieldsHeader">
							<Warn />
							<span>Missing Fields :</span>
						</div>
						<div className="missingFieldsDescription">
							(This list will be dynamic based on what's missing)
						</div>
						<ul className="missingFieldsUl">
							{emptyFields.map((field, index) => (
								<li
									key={index}
									className={`missingFieldLi${
										field.includes('Selected Subtotal for')
											? ' subtotalError'
											: ''
									}`}
								>
									{field} :
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="fieldsEmptyModalQuestion">
					Would you like to go back and complete them, or continue without filling?
				</div>

				<div className="fieldsEmptyModalFooterContainer">
					<div className="fillFieldsBtn" onClick={handleFillFields}>
						Fill the Input
					</div>
					<div className="continueAnywayBtn" onClick={handleContinueAnyway}>
						Continue Anyway
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(FieldsEmptyModel);
