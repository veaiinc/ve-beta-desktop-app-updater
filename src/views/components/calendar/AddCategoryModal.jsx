import React, { memo, useCallback, useRef } from 'react';
import '../../../assets/scss/calendar/addCategoryModal.scss';

const AddCategoryModal = ({
	handleCategoryModalToggle,
	isCategoryEditable,
	name,
	type,
	color,
	colorsArray,
	handelCategoryLabelDataChange,
	handleModalActionClick,
}) => {
	const modalRef = useRef(null);

	const handleOutSideClick = useCallback((e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			handleCategoryModalToggle(false);
		}
	}, []);

	return (
		<div className="categoryModal">
			<div className="modalDialogue" onClick={(e) => handleOutSideClick(e)}>
				<div className="modalContent" ref={modalRef} onClick={(e) => e.stopPropagation()}>
					<div className="modalBody">
						{isCategoryEditable ? (
							<div className="warningContainer">
								<h2>Warning</h2>
								<p>
									If you change the name and type it will reflect everywhere where
									all are connected
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
									Color coding your Categories helps you to spot it a lot easier
									when you need it.
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
							<button onClick={() => handleCategoryModalToggle(false)}>
								Go back
							</button>
							<button className="primaryButton" onClick={handleModalActionClick}>
								{isCategoryEditable ? 'Change' : 'Add'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AddCategoryModal);
