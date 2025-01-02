import { Tooltip } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import Context from '../../../../context/context';

const OptionsDropDown = ({ properties, updateListViewInfo, taskPreferences }) => {
	const {
		companyInfo: { updateTaskPreferences },
	} = useContext(Context);
	const [info, setInfo] = useState({
		groupDropDownOpen: false,
		orderDropDownOpen: false,
		selected: null,
		hiddenProperties: [],
		shownProperties: [],
		isOpen: false,
	});

	useEffect(() => {
		const shownArray = [];
		const hiddenArray = [];
		properties.forEach((property) => {
			if (property.show) {
				shownArray.push(property);
			} else {
				hiddenArray.push(property);
			}
		});
		setInfo((prevInfo) => ({
			...prevInfo,
			shownProperties: shownArray,
			hiddenProperties: hiddenArray,
		}));
	}, [properties]);

	const updatePropertyPreference = useCallback(
		(propName, value) => {
			const newProperties = properties?.map((property) => {
				if (property?.value === propName) {
					return { ...property, ...value };
				}
				return property;
			});
			updateListViewInfo('properties', newProperties);

			const newTaskPreferences = {
				...taskPreferences,
				[propName]: { ...taskPreferences[propName], ...value },
			};
			updateListViewInfo('taskPreferences', newTaskPreferences);
			updateTaskPreferences(newTaskPreferences);
		},
		[properties, updateListViewInfo, taskPreferences, updateTaskPreferences],
	);

	const handleShowAll = useCallback(() => {
		const newProperties = properties?.map((property) => ({
			...property,
			show: true,
		}));

		updateListViewInfo('properties', newProperties);

		const newTaskPreferences = { ...taskPreferences };
		newProperties.forEach((property) => {
			newTaskPreferences[property.value] = {
				...newTaskPreferences[property.value],
				show: true,
			};
		});
		updateListViewInfo('taskPreferences', newTaskPreferences);
		updateTaskPreferences(newTaskPreferences);
	}, [properties, updateListViewInfo, taskPreferences, updateTaskPreferences]);

	const handleHideAll = useCallback(() => {
		const newProperties = properties?.map((property) => ({
			...property,
			show: property.value === 'title',
		}));

		updateListViewInfo('properties', newProperties);

		const newTaskPreferences = { ...taskPreferences };
		newProperties.forEach((property) => {
			newTaskPreferences[property.value] = {
				...newTaskPreferences[property.value],
				show: property.value === 'title',
			};
		});
		updateListViewInfo('taskPreferences', newTaskPreferences);
		updateTaskPreferences(newTaskPreferences);
	}, [properties, updateListViewInfo, taskPreferences, updateTaskPreferences]);

	const handleDropdownVisibility = useCallback((visible) => {
		setInfo((prev) => ({ ...prev, isOpen: visible }));
	}, []);

	const handleClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, isOpen: false }));
	}, []);

	return (
		<Tooltip
			placement="bottomLeft"
			open={info.isOpen}
			onOpenChange={handleDropdownVisibility}
			title={
				<div className="options-dropdown-container">
					<div className="options-dropdown-header">
						<span className="options-dropdown-header-title-wrapper">
							<span className="options-dropdown-header-title">Properties</span>
						</span>
						<CrossSvg className="cursor-pointer" onClick={handleClose} />
					</div>
					{info?.shownProperties?.length > 0 && (
						<div className="options-dropdown-body-show-container-header">
							<span className="section-title">Shown in List</span>
							<button
								className="btn-show-all"
								onClick={handleHideAll}
								disabled={info?.shownProperties?.length <= 1}
							>
								Hide all
							</button>
						</div>
					)}
					<div className="options-dropdown-property-container">
						{info?.shownProperties?.map(({ Icon = null, label, value }) => (
							<div className="property-listItem" key={value}>
								<SixDotsSvg />
								{Icon ? <Icon /> : ''}
								<span className="property-listItem-title">{label}</span>
								{value === 'title' ? (
									<OpenEye className="crossed-eye-icon" />
								) : (
									<OpenEye
										onClick={() =>
											updatePropertyPreference(value, { show: false })
										}
									/>
								)}
								<ChevronRightThinSvg />
							</div>
						))}
					</div>

					{info?.hiddenProperties?.length > 0 && (
						<div className="options-dropdown-body-hide-container-header">
							<span className="section-title">Hidden in List</span>
							<button
								className="btn-show-all"
								onClick={handleShowAll}
								disabled={info?.hiddenProperties?.length === 0}
							>
								Show all
							</button>
						</div>
					)}
					<div className="options-dropdown-property-container">
						{info?.hiddenProperties?.map(({ Icon = null, label, value }) => (
							<div className="property-listItem" key={value}>
								<SixDotsSvg />
								{Icon ? <Icon /> : ''}
								<span className="property-listItem-title">{label}</span>
								<CrossedOpenEye
									className="crossed-eye-icon"
									onClick={() => updatePropertyPreference(value, { show: true })}
								/>
								<ChevronRightThinSvg />
							</div>
						))}
					</div>
					<div className="options-dropdown-footer">
						<PlusSvg className="add-new-property-icon" />
						<span className="add-new-property-title">Add new property</span>
						<ChevronRightThinSvg />
					</div>
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
