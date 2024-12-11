import React, { memo } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/calendar/modal/updateCategoryModal.scss';

const updateCategoryModal = ({
	open,
	closeModal,
	isCategoryEditable,
	colorsArray,
	color,
	name,
	type,
	handelCategoryLabelDataChange,
}) => {
	const customCloseModal = () => {
		closeModal();
		handelCategoryLabelDataChange('name', '');
		handelCategoryLabelDataChange('type', '');
		handelCategoryLabelDataChange('color', '');
	};
	return (
		<ReactModal
			isOpen={open}
			closeModal={customCloseModal}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
		>
			<div className="modalContent">
				<div className="modalBody">
					{isCategoryEditable ? (
						<div className="warningContainer">
							<h2>Warning</h2>
							<p>
								If you change the name and type it will reflect everywhere where all
								are connected
							</p>
						</div>
					) : (
						''
					)}

					<div className="inputContainer">
						<div className="inputWrapper">
							<label htmlFor="">Name</label>
							<input
								type="text"
								placeholder="Meeting"
								value={name}
								onChange={(e) =>
									handelCategoryLabelDataChange('name', e.target.value)
								}
							/>
						</div>
						<div className="inputWrapper">
							<label htmlFor="">Type</label>
							<input
								type="text"
								placeholder="Google meet"
								value={type}
								onChange={(e) =>
									handelCategoryLabelDataChange('type', e.target.value)
								}
							/>
						</div>
					</div>
					<div className="colorPickerContainer">
						<div className="textWrapper">
							<h3>Pick a color</h3>
							<p>
								Color coding your Categories helps you to spot it a lot easier when
								you need it.
							</p>
						</div>
						<div className="colorPicker">
							{colorsArray
								? colorsArray.map((colorCode) => (
										<label
											htmlFor={colorCode}
											className="colorCircle"
											style={{ backgroundColor: colorCode }}
											key={colorCode}
										>
											<input
												type="radio"
												name="color"
												value={colorCode}
												id={colorCode}
												checked={colorCode == color}
												onChange={(e) =>
													handelCategoryLabelDataChange(
														'color',
														e.target.value,
													)
												}
											/>
											<div className="innerCircle"></div>
										</label>
								  ))
								: ''}
						</div>
					</div>
					<div className="actionsContainer">
						<button onClick={closeModal}>Go back</button>
						<button className="primaryButton" onClick={customCloseModal}>
							{isCategoryEditable ? 'Change' : 'Add'}
						</button>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(updateCategoryModal);
