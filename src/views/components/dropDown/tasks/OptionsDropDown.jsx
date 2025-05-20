import { Tooltip } from 'antd';
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import HorizontalMoreIcon from '../../../../assets/svg/tasks/horizontalDotsThin.svg?react';
import CrossSvg from '../../../../assets/svg/gallery/cross.svg?react';
import ChevronRightThinSvg from '../../../../assets/svg/tasks/chevronRightThin.svg?react';
import ListSvg from '../../../../assets/svg/tasks/listDotsAndLines.svg?react';
import FolderSvg from '../../../../assets/svg/tasks/folder.svg?react';
import GridSvg from '../../../../assets/svg/tasks/grid.svg?react';
import DuplicateIcon from '../../../../assets/svg/tasks/duplicate.svg?react';
import DeleteIcon from '../../../../assets/svg/tasks/dustBin.svg?react';
import PropertiesDropDown from './PropertiesDropDown';
import GroupDropDown from './GroupDropDown';
import LayoutDropDown from './LayoutDropDown';
import ThreeDotsSvg from '../../../../assets/svg/my_templates/ThreeDotsSvg';
import Context from '../../../../context/context';
// import CrossSvg from '../../../../assets/svg/docs/CrossSvg';

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
	tabLength,
}) => {
	const {
		tasks: { updateTaskPrefix, updateSelectedView },
	} = useContext(Context);

	const [info, setInfo] = useState({
		selected: null,
		isOpen: false,
		pendingLabel: viewData?.label,
		pendingPrefix: prefix,
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			pendingLabel: viewData?.label,
			pendingPrefix: prefix,
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
		setInfo((prev) => ({ ...prev, selected: null }));
	}, []);

	const handleLayoutChange = useCallback(
		(option) => {
			updateViewInfo({ viewType: option });
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
		if (info.pendingLabel !== viewData?.label) {
			updateViewInfo({ label: info.pendingLabel });
		}
	}, [info.pendingLabel, updateViewInfo, viewData?.label]);

	const handlePrefixChange = useCallback((e) => {
		if (e.target?.value?.trim()?.length > 4) {
			return;
		}

		setInfo((prev) => ({
			...prev,
			pendingPrefix: e.target.value?.trim()?.toUpperCase(),
		}));
	}, []);

	const handlePrefixKeyDown = useCallback(
		(e) => {
			if (e.key === 'Enter') {
				e.target.blur();
			}
		},
		[info.pendingPrefix, updateTaskPrefix],
	);

	const handlePrefixBlur = useCallback(() => {
		if (!info?.pendingPrefix?.trim()) {
			setInfo((prevInfo) => ({ ...prevInfo, pendingPrefix: prefix }));
			return;
		}
		if (info.pendingPrefix !== prefix) {
			updateTaskPrefix({ input: { prefix: info?.pendingPrefix } });
		}
	}, [info.pendingPrefix, updateTaskPrefix, prefix]);

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
					group={viewData?.group}
					viewType={viewData?.viewType}
					updateViewInfo={updateViewInfo}
				/>
			),
			layout: (
				<LayoutDropDown
					handleBack={handleBack}
					handleClose={handleClose}
					handleLayoutChange={handleLayoutChange}
					view={viewData?.viewType}
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
			handlePropertyToggle,
			viewData?.group,
			viewData?.viewType,
			updateViewInfo,
			handleLayoutChange,
			layoutOptions,
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
						<div className="view-options" style={{ color: 'var(--primary-font)' }}>
							<div className="view-options-header">
								<span className="view-options-header-title">View Options</span>
								<CrossSvg onClick={handleClose} className="cursor-pointer" />
								{/* <CrossSvg onClick={handleClose} /> */}
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
													(option) =>
														option?.value === viewData?.viewType,
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
										<ListSvg
											width={16}
											height={16}
											style={{ stroke: 'var(--primary-font)' }}
										/>
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
									{viewData?.viewType === 'board' && (
										<div
											className="view-options-list-item"
											onClick={() => handleOptionChange('group')}
										>
											<ListSvg
												width={16}
												height={16}
												style={{ stroke: 'var(--primary-font)' }}
											/>
											<span className="view-options-list-item-label">
												Group
											</span>
											<span className="view-options-list-item-value">
												{properties?.find(
													(property) =>
														property?.value === viewData?.group,
												)?.label || 'None'}
												<ChevronRightThinSvg />
											</span>
										</div>
									)}

									<div className="view-options-list-item">
										<span className="view-options-list-item-label">
											ID Prefix
										</span>
										<input
											className="id-prefix-input"
											value={info.pendingPrefix}
											onChange={handlePrefixChange}
											onKeyDown={handlePrefixKeyDown}
											onBlur={handlePrefixBlur}
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
									{tabLength > 1 && (
										<div
											className="view-options-list-item"
											onClick={() => handleDeleteView(viewData?._id)}
										>
											<DeleteIcon className="task-delete-icon" />
											<span className="view-options-list-item-label">
												Delete View
											</span>
										</div>
									)}
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
			<div className="btn-options">
				<ThreeDotsSvg />
			</div>
		</Tooltip>
	);
};

export default memo(OptionsDropDown);
