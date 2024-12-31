import { Divider, Tooltip } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import { ReactComponent as ListIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardIcon } from '../../../../assets/svg/tasks/board.svg';
import ToggleSlider from '../../input/slider';
import { ReactComponent as DownArrow } from '../../../../assets/svg/Settings/Downarrowwhite.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';

const OptionsDropDown = ({ properties, togglePropertyVisibility }) => {
	const [info, setInfo] = useState({
		groupDropDownOpen: false,
		orderDropDownOpen: false,
		selected: null,
		hiddenProperties: [],
		shownProperties: [],
	});

	// const updateOptionDropDownInfo = (key, value) => {
	// 	setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	// };

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

	const handleShowAll = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			shownProperties: properties,
			hiddenProperties: [],
		}));
	};

	const handleHideAll = () => {
		const titleProperty = properties.find((prop) => prop.value === 'title');
		setInfo((prevInfo) => ({
			...prevInfo,
			shownProperties: titleProperty ? [titleProperty] : [],
			hiddenProperties: titleProperty
				? properties.filter((p) => p.value !== 'title')
				: properties,
		}));
	};

	const handleVisibilityChange = (index, value) => {
		togglePropertyVisibility(index, value);
	};

	// return (
	// 	<div className={`listView-options-dropdown-container`}>
	// 		<div className="view-selection-wrapper">
	// 			<input type="radio" name="view-type" defaultChecked id="list-view-radio" />
	// 			<label htmlFor="list-view-radio" className="view-selection">
	// 				<ListIcon />
	// 				<span className="view-name">List</span>
	// 			</label>
	// 			<input type="radio" name="view-type" id="board-view-radio" />
	// 			<label htmlFor="board-view-radio" className="view-selection">
	// 				<BoardIcon />
	// 				<span className="view-name">Board</span>
	// 			</label>
	// 		</div>
	// 		<div className="group-container text-bright">
	// 			<span>Grouping</span>
	// 			<DropDown
	// 				containerStyles={{ right: '0', width: '153px' }}
	// 				options={properties}
	// 				valueSelector="propName"
	// 				selected="tags"
	// 				open={info?.groupDropDownOpen}
	// 				defaultValue={'No grouping'}
	// 				closeDropdown={() => updateOptionDropDownInfo('groupDropDownOpen', false)}
	// 			>
	// 				<div
	// 					className="dropdown"
	// 					onClick={() =>
	// 						updateOptionDropDownInfo('groupDropDownOpen', !info?.groupDropDownOpen)
	// 					}
	// 				>
	// 					<span className="dropdown-text">{'No grouping'}</span>
	// 					<DownArrow
	// 						style={{
	// 							transform: info?.groupDropDownOpen
	// 								? 'rotate(180deg)'
	// 								: 'rotate(0deg)',
	// 						}}
	// 					/>
	// 				</div>
	// 			</DropDown>
	// 		</div>
	// 		<div className="order-container text-bright">
	// 			<span>Ordering</span>
	// 			<DropDown
	// 				containerStyles={{ right: '0', width: '153px' }}
	// 				options={properties}
	// 				valueSelector="propName"
	// 				selected=""
	// 				open={info?.orderDropDownOpen}
	// 				defaultValue={'Manual'}
	// 				closeDropdown={() => updateOptionDropDownInfo('orderDropDownOpen', false)}
	// 			>
	// 				<div
	// 					className="dropdown"
	// 					onClick={() =>
	// 						updateOptionDropDownInfo('orderDropDownOpen', !info?.orderDropDownOpen)
	// 					}
	// 				>
	// 					<span className="dropdown-text">{'No ordering'}</span>
	// 					<DownArrow
	// 						style={{
	// 							transform: info?.orderDropDownOpen
	// 								? 'rotate(180deg)'
	// 								: 'rotate(0deg)',
	// 						}}
	// 					/>
	// 				</div>
	// 			</DropDown>
	// 		</div>
	// 		<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />
	// 		<div className="sub-issues-container">
	// 			<span className="text-fade">Show sub-issues</span>
	// 			<ToggleSlider onChange={() => {}} value={false} />
	// 		</div>
	// 		<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />

	// 		<span className="list-heading text-bright">List option</span>
	// 		<div className="empty-group-container">
	// 			<span className="text-fade">Show empty group</span>
	// 			<ToggleSlider onChange={() => {}} value={false} />
	// 		</div>
	// 		<div className="properties-container">
	// 			<span className="text-fade">Display properties</span>
	// 			<div className="properties-wrapper">
	// 				{properties
	// 					? properties.map((property, index) => (
	// 							<div
	// 								className={`property-item text-fade ${
	// 									property.show ? `selected` : ``
	// 								}`}
	// 								onClick={() => togglePropertyVisibility(index, !property.show)}
	// 								key={index}
	// 							>
	// 								{property?.label}
	// 							</div>
	// 					  ))
	// 					: ''}
	// 			</div>
	// 		</div>
	// 		<Divider style={{ backgroundColor: '#1D1D1D', margin: '0' }} />
	// 		<div className="resent-btn-container">
	// 			<button className="btn-reset">Reset to dafault</button>
	// 		</div>
	// 	</div>
	// );

	return (
		<Tooltip
			placement="bottomLeft"
			title={
				<div className="options-dropdown-container">
					<div className="options-dropdown-header">
						<span className="options-dropdown-header-title-wrapper">
							{/* back */}
							<span className="options-dropdown-header-title">Properties</span>
						</span>
						<CrossSvg className="cursor-pointer" />
					</div>
					{info?.shownProperties?.length > 0 && (
						<div className="options-dropdown-body-show-container-header">
							<span className="section-title">Shown in List</span>
							<button className="btn-show-all" onClick={handleHideAll}>
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
								<OpenEye onClick={() => handleVisibilityChange(value, false)} />
								<ChevronRightThinSvg />
							</div>
						))}
					</div>

					{info?.hiddenProperties?.length > 0 && (
						<div className="options-dropdown-body-hide-container-header">
							<span className="section-title">Hidden in List</span>
							<button className="btn-show-all" onClick={handleShowAll}>
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
									onClick={() => handleVisibilityChange(value, true)}
								/>
								<ChevronRightThinSvg />
							</div>
						))}
					</div>
					<div className="options-dropdown-footer">
						<span className="add-new-property-title">Add new property</span>
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
