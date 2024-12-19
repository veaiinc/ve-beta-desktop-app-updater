import React from 'react';
import ReactModal from '../index';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import '../../../../assets/scss/gallery/reusablePopups.scss';

const MainPopup = (props) => {
	const {
		heading,
		placeholder,
		value,
		onChange,
		onClose,
		onSubmit,
		inputType = 'text',
		open,
	} = props;

	return (
		<ReactModal isOpen={open} closeModal={onClose} modalType={'center'}>
			<div className="mainPopupContainer">
				<div className="mainPopupContent">
					<div className="mainPopupHeading">
						<div className="mainPopupHeadingText">{heading}</div>
						<div
							className="mainPopupCloseButton"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onClose();
							}}
						>
							<CrossSvg />
						</div>
					</div>
					<div style={{ position: 'relative' }}>
						<input
							type={inputType}
							value={value}
							onChange={onChange}
							className="mainPopupInput"
							placeholder=""
							{...(inputType === 'date' ? { 'data-placeholder': placeholder } : {})}
						/>
						<label className="floating-label">{placeholder}</label>
					</div>
				</div>
				<div style={{ alignSelf: 'flex-end' }}>
					<button className="mainPopupSaveButton" onClick={onSubmit}>
						Save
					</button>
				</div>
			</div>
		</ReactModal>
	);
};
export default MainPopup;
