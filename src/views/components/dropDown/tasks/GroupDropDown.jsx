import React, { memo, useState } from 'react';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as DustbinOutlined } from '../../../../assets/svg/tasks/dustBin.svg';
import ToggleSwitch from '../../../../views/components/input/slider';

import '../../../../assets/scss/dropdown/tasks/groupDropDown.scss';

const GroupDropDown = ({ handleClose, handleBack }) => {
	const [info, setInfo] = useState({
		hideEmptyGroups: false,
		groupBy: 'status',
	});
	return (
		<div className="group-dropDown">
			{info.groupBy ? (
				<>
					<div className="group-dropDown-header">
						<ArrowLeftSvg className="cursor-pointer" onClick={handleBack} />
						<span className="group-dropDown-header-title">Group</span>
						<CrossSvg className="cursor-pointer" onClick={handleClose} />
					</div>
					<div className="group-dropDown-options">
						<div className="group-dropDown-options-item">
							<span className="group-dropDown-options-item-label">Group by</span>
							<span className="group-dropDown-options-item-value">
								Status
								<ChevronRightThinSvg />
							</span>
						</div>
						<div className="group-dropDown-options-item">
							<span className="group-dropDown-options-item-label">Status by</span>
							<span className="group-dropDown-options-item-value">
								Option
								<ChevronRightThinSvg />
							</span>
						</div>
						<div className="group-dropDown-options-item">
							<span className="group-dropDown-options-item-label">Sort</span>
							<span className="group-dropDown-options-item-value">
								Ascending
								<ChevronRightThinSvg />
							</span>
						</div>
						<div className="group-dropDown-options-item">
							<span className="group-dropDown-options-item-label">
								Hide empty groups
							</span>
							<ToggleSwitch
								on={info.hideEmptyGroups}
								onChange={(value) => setInfo({ ...info, hideEmptyGroups: value })}
							/>
						</div>
					</div>
					<div className="group-drag-list">
						<div className="group-drag-list-header">
							<span className="group-drag-list-header-title">Visible groups</span>
							<button className="group-drag-list-header-button">Hide all</button>
						</div>
						<div className="group-drag-list-item">
							<span className="group-drag-list-item-label">Status</span>
							<span className="group-drag-list-item-value">Option</span>
						</div>
					</div>
					<div className="group-drag-list">
						<div className="group-drag-list-header">
							<span className="group-drag-list-header-title">Hidden groups</span>
							<button className="group-drag-list-header-button">Show all</button>
						</div>
						<div className="group-drag-list-item">
							<span className="group-drag-list-item-label">Status</span>
							<span className="group-drag-list-item-value">Option</span>
						</div>
					</div>
					<div className="group-dropDown-footer">
						<button className="group-dropDown-footer-button">
							<DustbinOutlined />
							Remove grouping
						</button>
					</div>
				</>
			) : (
				<>
					<div className="group-dropDown-header">
						<ArrowLeftSvg className="cursor-pointer" onClick={handleBack} />
						<span className="group-dropDown-header-title">Group</span>
						<CrossSvg className="cursor-pointer" onClick={handleClose} />
					</div>
					<div className="group-dropDown-select">
						<input
							className="group-dropDown-select-search"
							placeholder="Search for property type"
						/>
						<div className="group-dropDown-select-options">
							<div className="group-dropDown-select-option">
								<span className="group-dropDown-select-option-label">Status</span>
								<span className="group-dropDown-select-option-value">Option</span>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default memo(GroupDropDown);
