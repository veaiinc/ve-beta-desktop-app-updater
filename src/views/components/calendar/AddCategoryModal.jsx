import '../../../assets/scss/calendar/addCategoryModal.scss';
import React, { memo, useCallback, useRef, useState } from 'react';

const AddCategoryModal = ({ handleCategoryModalClose, isCategoryEditable }) => {
	const [info, setInfo] = useState({
		colors: [
			'#CF824B',
			'#89AC4F',
			'#4F9BAC',
			'#7E78C9',
			'#C378C9',
			'#5E8BE2',
			'#CF4B92',
			'#7A7A7A',
			'#B08D8D',
			'#D76262',
		],
		selectedColor: null,
	});
	const modalRef = useRef(null);

	const handleSelectedColorChange = useCallback((colorCode) => {
		setInfo((previnfo) => ({ ...previnfo, selectedColor: colorCode }));
	}, []);

	const handleOutSideClick = useCallback((e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			handleCategoryModalClose();
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
								<input type="text" placeholder="Meeting" />
							</div>
							<div className="inputWrapper">
								<label htmlFor="">Type</label>
								<input type="text" placeholder="Google meet" />
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
								{info?.colors
									? info.colors.map((colorCode) => (
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
													onChange={(e) =>
														handleSelectedColorChange(e.target.value)
													}
												/>
												<div className="innerCircle"></div>
											</label>
									  ))
									: ''}
							</div>
						</div>
						<div className="actionsContainer">
							<button onClick={handleCategoryModalClose}>Go back</button>
							<button className="primaryButton">Add</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AddCategoryModal);
