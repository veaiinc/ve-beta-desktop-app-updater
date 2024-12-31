/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, memo, useState, useEffect } from 'react';
import '../../../../assets/scss/tasks/person.scss';
import { Select, Tooltip } from 'antd';

const Person = ({
	value,
	parseValue = false,
	showLabel = false,
	title,
	customListItemStyle = {},
	onOptionClick,
	options = [],
	multiSelect = false,
	disabled = false,
}) => {
	const [info, setInfo] = useState({
		value: null,
	});

	useEffect(() => {
		if (!value || (Array.isArray(value) && value.length === 0)) {
			setInfo({ value: null });
			return;
		}

		let newVal = value;
		if (parseValue) {
			newVal = Array.isArray(value)
				? value.map((v) => ({ value: v?._id, label: v?.name }))
				: { value: value?._id, label: value?.name };
		}
		setInfo({
			value: newVal,
		});
	}, [parseValue, value]);

	const parsedValueAndLabel = useCallback(
		(value, type) => {
			if (type === 'reverse') {
				let parsed = null;
				if (multiSelect) {
					parsed = value?.map((item) => ({ _id: item?.value, name: item?.label }));
				} else {
					parsed = value ? { _id: value?.value, name: value?.label } : null;
				}
				return parsed;
			} else {
				let parsed = null;
				if (multiSelect) {
					parsed = value?.map((item) => ({ value: item?._id, label: item?.name }));
				} else {
					parsed = value ? { value: value?._id, label: value?.name } : null;
				}
				return parsed;
			}
		},
		[multiSelect],
	);

	const renderPerson = (option) => {
		return (
			<div className="person-tag" style={customListItemStyle}>
				<div className="person-tag-avatar" style={{ display: 'flex', flexShrink: 0 }}>
					{/* <img src={profile || ''} alt="" /> */}
					<div
						className="person-tag-avatar-icon"
						style={{ flexShrink: 0, width: '20px', height: '20px' }}
					>
						{option?.label?.[0]?.toUpperCase()}
					</div>
				</div>
				{showLabel ? <div className="person-tag-label">{option?.label}</div> : ''}
			</div>
		);
	};

	const customOnOptionClick = (value) => {
		if (parseValue) {
			const parsed = parsedValueAndLabel(value, 'reverse');
			onOptionClick(parsed);
			return;
		}
		onOptionClick(value);
	};

	return (
		<Tooltip title={title} placement="bottom">
			<Select
				placeholder={
					!value || (Array.isArray(value) && value.length === 0)
						? disabled
							? 'No data'
							: `Select ${title || 'person'}`
						: undefined
				}
				options={options}
				variant="borderless"
				labelInValue
				showSearch={false}
				disabled={disabled}
				onClick={(e) => {
					e.stopPropagation();
				}}
				style={{
					width:
						(!info?.value && !value) || (Array.isArray(value) && value.length === 0)
							? '130px'
							: 'fit-content',
					color: disabled ? '#8c8c8c' : '#e5e5e5',
				}}
				className={`person-select ${disabled ? 'disabled' : ''}`}
				dropdownStyle={{ backgroundColor: 'transparent', width: '220px' }}
				{...(multiSelect ? { tagRender: renderPerson } : { labelRender: renderPerson })}
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
										{option?.label?.[0]?.toUpperCase()}
									</div>
								)}
							</div>
							<div className="person-dropdown-menu-option-label">{option?.label}</div>
						</div>
					);
				}}
				suffixIcon={<></>}
				mode={multiSelect ? 'multiple' : undefined}
				onChange={customOnOptionClick}
				value={info?.value}
			/>
		</Tooltip>
	);
};

export default memo(Person);
