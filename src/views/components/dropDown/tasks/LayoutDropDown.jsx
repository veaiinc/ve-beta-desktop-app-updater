import React, { memo } from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import '../../../../assets/scss/dropdown/tasks/layoutDropDown.scss';

const LayoutDropDown = ({ handleBack, handleClose, handleLayoutChange, layoutOptions, view }) => {
	return (
		<div className="layout-drop-down">
			<div className="layout-drop-down-header">
				<ArrowLeftSvg className="cursor-pointer" onClick={handleBack} />
				<span className="layout-drop-down-header-title">Layout</span>
				<CrossSvg className="cursor-pointer" onClick={handleClose} />
			</div>
			<div className="layout-drop-down-body">
				{layoutOptions.map((option) => (
					<div
						className={`layout-drop-down-body-item ${
							option?.value === view ? 'active-layout' : ''
						}`}
						key={option?.value}
						onClick={() => handleLayoutChange(option?.value)}
					>
						{option?.icon}
						<span className="layout-drop-down-body-item-title">{option?.label}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(LayoutDropDown);
