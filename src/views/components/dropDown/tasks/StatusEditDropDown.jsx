import React, { memo, useState } from 'react';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import '../../../../assets/scss/dropdown/tasks/statusEditDropDown.scss';

const StatusEditDropDown = ({ handleEditPropertyChange, handleClose }) => {
	const [info, setInfo] = useState({
		addNewProperty: {
			show: false,
			group: null,
			label: '',
		},
	});
	return (
		<div className="options-property-edit-container">
			<div className="options-property-edit-header">
				<ArrowLeftSvg
					className="cursor-pointer"
					onClick={() => handleEditPropertyChange(null)}
				/>
				<span className="options-property-edit-header-title">Edit property</span>
				<CrossSvg className="cursor-pointer" onClick={handleClose} />
			</div>
			<div className="property-edit-section">
				<div className="property-edit-section-body">
					<div className="property-edit-section-body-item">
						<div className="property-edit-section-body-item-title">Name</div>
						<div className="property-edit-section-body-item-value">Status</div>
					</div>
					<div className="property-edit-section-body-item">
						<div className="property-edit-section-body-item-title">Shown as</div>
						<div className="property-edit-section-body-item-value">Status</div>
					</div>
				</div>
			</div>
			<div className="property-edit-section">
				<div className="property-edit-section-title-wrapper">
					<span className="property-edit-section-title">To-do</span>
					<PlusSvg
						className="add-new-property-icon"
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								addNewProperty: {
									show: !info?.addNewProperty?.show,
									group: 'todo',
									label: '',
								},
							}))
						}
						style={{
							transform: info?.addNewProperty?.show ? 'rotate(-45deg)' : '',
						}}
					/>
				</div>
				{info?.addNewProperty?.show ? (
					<input
						className="property-add-input-field"
						placeholder="Add new property"
						value={info?.addNewProperty?.label}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								addNewProperty: {
									...prev?.addNewProperty,
									label: e?.target?.value,
								},
							}))
						}
					/>
				) : (
					''
				)}
				<div className="property-edit-section-body">
					<div className="property-edit-section-option-item">
						<div className="drag-handle-icon">
							<SixDotsSvg />
						</div>
						<span className="property-edit-section-body-option-wrapper">
							<span className="status-option-container">
								<span className="status-option-dot"></span>
								<span className="status-option-label">Status</span>
							</span>
						</span>
						<ChevronRightThinSvg />
					</div>
					<div className="property-edit-section-option-item">
						<SixDotsSvg />
						<span className="property-edit-section-body-option-wrapper">
							<span className="status-option-container">
								<span className="status-option-dot"></span>
								<span className="status-option-label">Status</span>
							</span>
						</span>
						<ChevronRightThinSvg />
					</div>
					<div className="property-edit-section-option-item">
						<SixDotsSvg />
						<span className="property-edit-section-body-option-wrapper">
							<span className="status-option-container">
								<span className="status-option-dot"></span>
								<span className="status-option-label">Status</span>
							</span>
						</span>
						<ChevronRightThinSvg />
					</div>
				</div>
			</div>
			<div className="property-edit-section">
				<div className="property-edit-section-title-wrapper">
					<span className="property-edit-section-title">In Progress</span>
					<PlusSvg className="add-new-property-icon" />
				</div>
				<div className="property-edit-section-body">
					<div className="property-edit-section-option-item">
						<div className="drag-handle-icon">
							<SixDotsSvg />
						</div>
						<span className="property-edit-section-body-option-wrapper">
							<span className="status-option-container">
								<span className="status-option-dot"></span>
								<span className="status-option-label">Status</span>
							</span>
						</span>
						<ChevronRightThinSvg />
					</div>
				</div>
			</div>
			<div className="property-edit-section">
				<div className="property-edit-section-title-wrapper">
					<span className="property-edit-section-title">Completed</span>
					<PlusSvg className="add-new-property-icon" />
				</div>
				<div className="property-edit-section-body">
					<div className="property-edit-section-option-item">
						<div className="drag-handle-icon">
							<SixDotsSvg />
						</div>
						<span className="property-edit-section-body-option-wrapper">
							<span className="status-option-container">
								<span className="status-option-dot"></span>
								<span className="status-option-label">Status</span>
							</span>
						</span>
						<ChevronRightThinSvg />
					</div>
				</div>
			</div>
			<div className="property-edit-footer">
				<OpenEye />
				<span className="property-edit-footer-title">Show in view</span>
			</div>
		</div>
	);
};

export default memo(StatusEditDropDown);
