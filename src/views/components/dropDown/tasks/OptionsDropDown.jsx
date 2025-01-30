import { Tooltip } from 'antd';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as ListSvg } from '../../../../assets/svg/tasks/listDotsAndLines.svg';
import { ReactComponent as FolderSvg } from '../../../../assets/svg/tasks/folder.svg';
import { ReactComponent as GridSvg } from '../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as DuplicateIcon } from '../../../../assets/svg/tasks/duplicate.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/svg/tasks/dustBin.svg';
import PropertiesDropDown from './PropertiesDropDown';
import GroupDropDown from './GroupDropDown';
import LayoutDropDown from './LayoutDropDown';

const OptionsDropDown = ({
	properties,
	taskPreferences,
	colors,
	viewData,
	updateViewInfo,
	updateTaskInfo,
	openDropDown,
	closeDropDown,
	handleDeleteView,
	handleDuplicateView,
	prefix,
	layoutOptions,
}) => {
	const [info, setInfo] = useState({
		selected: null,
		isOpen: false,
		pendingLabel: viewData?.label,
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			pendingLabel: viewData?.label,
		}));
	}, [viewData?.label]);

	const handleDropdownVisibility = useCallback(
		(visible) => {
			setInfo((prev) => ({ ...prev, isOpen: visible }));
			if (!visible) {
				setInfo((prev) => ({ ...prev, selected: null }));
				closeDropDown();
			}
		},
		[closeDropDown],
	);

	const handleClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, isOpen: false, selected: null }));
		closeDropDown();
	}, [closeDropDown]);

	const handleOptionChange = (option) => {
		setInfo((prev) => ({ ...prev, selected: option }));
	};

	const handleBack = useCallback(() => {
		console.log('handleBack');
		setInfo((prev) => ({ ...prev, selected: null }));
	}, []);

	const handleLayoutChange = useCallback(
		(option) => {
			updateViewInfo({ view: option });
		},
		[updateViewInfo],
	);

	const handleViewNameChange = useCallback((e) => {
		setInfo((prev) => ({
			...prev,
			pendingLabel: e.target.value,
		}));
	}, []);

	const handleViewNameKeyDown = useCallback(
		(e) => {
			if (e.key === 'Enter') {
				e.target.blur();
				updateViewInfo({ label: info.pendingLabel });
			}
		},
		[info.pendingLabel, updateViewInfo],
	);

	const handleViewNameBlur = useCallback(() => {
		updateViewInfo({ label: info.pendingLabel });
	}, [info.pendingLabel, updateViewInfo]);

	const handlePropertyToggle = useCallback(
		(property) => {
			// Get current visible properties
			const currentVisibleProperties = properties.filter((prop) => prop.show);

			// If trying to hide the last visible property, prevent it
			if (property.show && currentVisibleProperties.length === 1) {
				return;
			}

			// Update the view with the new property visibility
			const updatedProperties = properties.map((prop) => {
				if (prop.value === property.value) {
					return { ...prop, show: !prop.show };
				}
				return prop;
			});

			updateViewInfo({
				properties: updatedProperties,
			});
		},
		[properties, updateViewInfo],
	);

	const optionsMapper = useMemo(
		() => ({
			properties: (
				<PropertiesDropDown
					properties={properties}
					updateTaskInfo={updateTaskInfo}
					taskPreferences={taskPreferences}
					colors={colors}
					handleClose={handleClose}
					handleBack={handleBack}
					handlePropertyToggle={handlePropertyToggle}
				/>
			),
			group: (
				<GroupDropDown
					handleClose={handleClose}
					handleBack={handleBack}
					properties={properties}
				/>
			),
			layout: (
				<LayoutDropDown
					handleBack={handleBack}
					handleClose={handleClose}
					handleLayoutChange={handleLayoutChange}
					view={viewData?.view}
					layoutOptions={layoutOptions}
				/>
			),
		}),
		[
			properties,
			updateTaskInfo,
			taskPreferences,
			colors,
			handleClose,
			handleBack,
			handleLayoutChange,
			viewData,
			handlePropertyToggle,
		],
	);

	return (
		<Tooltip
			placement="bottomRight"
			open={info?.isOpen || openDropDown}
			onOpenChange={handleDropdownVisibility}
			title={
				<div className="option-dropDown-wrapper">
					{info?.selected ? (
						optionsMapper?.[info.selected]
					) : (
						<div className="view-options">
							<div className="view-options-header">
								<span className="view-options-header-title">View Options</span>
								<CrossSvg onClick={handleClose} className="cursor-pointer" />
							</div>
							<div className="view-options-body">
								<div className="view-details">
									<input
										type="text"
										className="view-details-nameInput"
										placeholder="View Name"
										value={info.pendingLabel}
										onChange={handleViewNameChange}
										onKeyDown={handleViewNameKeyDown}
										onBlur={handleViewNameBlur}
									/>
									<div className="view-details-listItem">
										<FolderSvg />
										<span className="view-details-listItem-label">Source</span>
										<span className="view-details-listItem-value">Tasks</span>
									</div>
									<div
										className="view-details-listItem"
										onClick={() => handleOptionChange('layout')}
									>
										<GridSvg />
										<span className="view-details-listItem-label">Layout</span>
										<span className="view-details-listItem-value">
											{
												layoutOptions.find(
													(option) => option?.value === viewData?.view,
												)?.label
											}
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
										<span className="view-options-list-item-label">
											Properties
										</span>
										<span className="view-options-list-item-value">
											{
												properties?.filter((property) => property.show)
													?.length
											}{' '}
											Shown
											<ChevronRightThinSvg />
										</span>
									</div>
									{/* <div
										className="view-options-list-item"
										onClick={() => handleOptionChange('group')}
									>
										<ListSvg width={16} height={16} />
										<span className="view-options-list-item-label">Group</span>
										<span className="view-options-list-item-value">
											None
											<ChevronRightThinSvg />
										</span>
									</div> */}
									<div className="view-options-list-item">
										<span className="view-options-list-item-label">
											ID Prefix
										</span>
										<input
											className="id-prefix-input"
											readOnly
											defaultValue={prefix || 'NONE'}
										/>
									</div>
								</div>
								<div className="view-options-footer">
									<div
										className="view-options-list-item"
										onClick={() => handleDuplicateView(viewData?._id)}
									>
										<DuplicateIcon />
										<span className="view-options-list-item-label">
											Duplicate View
										</span>
									</div>
									<div
										className="view-options-list-item"
										onClick={() => handleDeleteView(viewData?._id)}
									>
										<DeleteIcon className="task-delete-icon" />
										<span className="view-options-list-item-label">
											Delete View
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
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
