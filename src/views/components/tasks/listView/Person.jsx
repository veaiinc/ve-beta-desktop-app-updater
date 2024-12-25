import React, { useCallback, memo, useState, useEffect } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import '../../../../assets/scss/tasks/person.scss';
import DropDown from '../../dropDown/tasks/DropDown';
import { Select, Tooltip } from 'antd';

const Person = ({
	value,
	parseValue = false,
	showName = false,
	title,
	customListItemStyle = {},
	onOptionClick,
	persons = [],
	multiSelect = false,
	disabled = false,
}) => {
	const [info, setInfo] = useState({
		value: [],
	});

	useEffect(() => {
		if (parseValue && value) {
			const valueArray = Array.isArray(value) ? value : value ? [value] : [];
			setInfo({
				value: valueArray?.length > 0 ? parsedValueAndLabel(valueArray) : valueArray,
			});
		}
	}, [parseValue, value]);

	const parsedValueAndLabel = useCallback(
		(value, type) => {
			if (type === 'reverse') {
				const parsed = value?.map((item) => ({ _id: item?.value, name: item?.label }));
				return multiSelect ? parsed : parsed.at(-1);
			} else {
				const parsed = value?.map((item) => ({ value: item?._id, label: item?.name }));
				return multiSelect ? parsed : parsed.at(-1);
			}
		},
		[multiSelect],
	);

	const customOnOptionClick = (value) => {
		const valueArray = Array.isArray(value) ? value : [value];

		if (parseValue) {
			const parsed = parsedValueAndLabel(valueArray, 'reverse');
			onOptionClick(parsed);
			return;
		}
		onOptionClick(multiSelect ? valueArray : valueArray[0]);
	};

	return (
		<Tooltip title={title} placement="bottom">
			<Select
				placeholder={`Select ${title || 'person'}`}
				options={persons}
				variant="borderless"
				labelInValue
				showSearch={false}
				disabled={disabled}
				onClick={(e) => {
					if (!disabled) {
						e.stopPropagation();
					}
				}}
				style={{
					width: info?.value?.length === 0 ? '180px' : 'fit-content',
					color: '#e5e5e5',
				}}
				className="person-select"
				dropdownStyle={{ backgroundColor: 'transparent', width: '220px' }}
				tagRender={(option) => {
					return (
						<div className="person-tag" style={customListItemStyle}>
							<div
								className="person-tag-avatar"
								style={{ display: 'flex', flexShrink: 0 }}
							>
								{/* <img src={profile || ''} alt="" /> */}
								<div
									className="person-tag-avatar-icon"
									style={{ flexShrink: 0, width: '20px', height: '20px' }}
								>
									{option?.label?.[0].toUpperCase()}
								</div>
							</div>
							{showName ? (
								<div className="person-tag-label">{option?.label}</div>
							) : (
								''
							)}
						</div>
					);
				}}
				dropdownRender={(menu) => {
					return (
						<div className="person-dropdown-menu">
							<div className="person-dropdown-menu-header">
								<div className="person-dropdown-menu-header-title">{title}</div>
							</div>
							<div className="person-dropdown-menu-body">{menu}</div>
						</div>
					);
				}}
				optionRender={(option) => {
					return (
						<div className="person-dropdown-menu-option">
							<div className="person-dropdown-menu-option-avatar">
								{option?.image ? (
									<img src={option?.image} alt="" />
								) : (
									<div className="person-dropdown-menu-option-avatar-icon">
										{option?.label?.[0].toUpperCase()}
									</div>
								)}
							</div>
							<div className="person-dropdown-menu-option-label">{option?.label}</div>
						</div>
					);
				}}
				suffixIcon={<></>}
				mode={'multiple'}
				onChange={customOnOptionClick}
				value={info?.value}
			/>
		</Tooltip>
	);
};

export default memo(Person);
