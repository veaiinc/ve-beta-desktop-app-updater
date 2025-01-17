import { Tooltip } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as ListSvg } from '../../../../assets/svg/tasks/listDotsAndLines.svg';
import { ReactComponent as FolderSvg } from '../../../../assets/svg/tasks/folder.svg';
import { ReactComponent as GridSvg } from '../../../../assets/svg/tasks/grid.svg';

import Context from '../../../../context/context';
import StatusEditDropDown from './StatusEditDropDown';
import PropertiesDropDown from './PropertiesDropDown';

const OptionsDropDown = ({
	properties,
	updateListViewInfo,
	taskPreferences,
	editingProperty,
	handleEditPropertyChange,
	colors,
}) => {
	const [info, setInfo] = useState({
		selected: null,
		isOpen: false,
	});

	const handleDropdownVisibility = useCallback(
		(visible) => {
			setInfo((prev) => ({ ...prev, isOpen: visible }));
			if (!visible) {
				handleEditPropertyChange(null);
			}
		},
		[handleEditPropertyChange],
	);

	const handleClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, isOpen: false, selected: null }));
		handleEditPropertyChange(null);
	}, [handleEditPropertyChange]);

	const handleOptionChange = (option) => {
		setInfo((prev) => ({ ...prev, selected: option }));
	};

	const handleBack = useCallback(() => {
		console.log('handleBack');
		setInfo((prev) => ({ ...prev, selected: null }));
	}, []);

	const optionsMapper = useMemo(
		() => ({
			properties: (
				<PropertiesDropDown
					properties={properties}
					updateListViewInfo={updateListViewInfo}
					taskPreferences={taskPreferences}
					editingProperty={editingProperty}
					handleEditPropertyChange={handleEditPropertyChange}
					colors={colors}
					handleClose={handleClose}
					handleBack={handleBack}
				/>
			),
			group: <div>Group</div>,
		}),
		[
			properties,
			updateListViewInfo,
			taskPreferences,
			editingProperty,
			handleEditPropertyChange,
			colors,
			handleClose,
			handleBack,
		],
	);

	return (
		<Tooltip
			placement="bottomRight"
			open={info.isOpen}
			onOpenChange={handleDropdownVisibility}
			title={
				info?.selected ? (
					optionsMapper?.[info.selected]
				) : (
					<div className="view-options">
						<div className="view-options-header">
							<span className="view-options-header-title">View Options</span>
							<CrossSvg />
						</div>
						<div className="view-options-body">
							<div className="view-details">
								<input
									type="text"
									className="view-details-nameInput"
									placeholder="View Name"
								/>
								<div className="view-details-listItem">
									<FolderSvg />
									<span className="view-details-listItem-label">Source</span>
									<span className="view-details-listItem-value">Tasks</span>
								</div>
								<div className="view-details-listItem">
									<GridSvg />
									<span className="view-details-listItem-label">Layout</span>
									<span className="view-details-listItem-value">
										List
										<ChevronRightThinSvg />
									</span>
								</div>
							</div>
							<div className="view-options-list">
								<div
									className="view-options-list-item"
									onClick={() => handleOptionChange('properties')}
								>
									<ListSvg width={16} height={16} />
									<span className="view-options-list-item-label">Properties</span>
									<span className="view-options-list-item-value">
										{properties?.filter((property) => property.show)?.length}{' '}
										Shown
										<ChevronRightThinSvg />
									</span>
								</div>
								<div
									className="view-options-list-item"
									onClick={() => handleOptionChange(null)}
								>
									<ListSvg width={16} height={16} />
									<span className="view-options-list-item-label">Group</span>
									<span className="view-options-list-item-value">
										None
										<ChevronRightThinSvg />
									</span>
								</div>
								<div className="view-options-list-item">
									<span className="view-options-list-item-label">ID Prefix</span>
									<input
										className="id-prefix-input"
										readOnly
										defaultValue={'PREFIXID'}
									/>
								</div>
							</div>
						</div>
					</div>
				)
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			overlayStyle={{ minWidth: 'fit-content' }}
			overlayClassName="options-dropdown-tooltip"
		>
			<button className="btn-options">
				<HorizontalMoreIcon style={{ width: '20px', height: '20px' }} />
			</button>
		</Tooltip>
	);
};

export default memo(OptionsDropDown);
