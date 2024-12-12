import React, { memo, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/calendar/modal/updateCategoryModal.scss';

const UpdateCategoryModal = ({
	show,
	handleClose,
	isCategoryEditable,
	color,
	name,
	type,
	handelCategoryLabelDataChange,
}) => {
	const [info, setInfo] = useState({
		colorsArray: [
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
	});
	return (
		<ReactModal
			isOpen={show}
			closeModal={handleClose}
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
							{info?.colorsArray
								? info?.colorsArray.map((colorCode) => (
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
						<button onClick={handleClose}>Go back</button>
						<button className="primaryButton" onClick={handleClose}>
							{isCategoryEditable ? 'Change' : 'Add'}
						</button>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UpdateCategoryModal);
