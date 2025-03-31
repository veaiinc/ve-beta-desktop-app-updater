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
	showTitle = false,
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

	// Add debug logging for option rendering
	const optionRender = useCallback((option) => {
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
	}, []);

	return (
		<Tooltip
			title={
				showTitle
					? info?.value && (
							<div className="person-tooltip-container">{`${title} ${
								Array.isArray(info?.value)
									? `${info?.value?.[0]?.label} ${
											info?.value?.length > 1
												? `+${info?.value?.length - 1} more`
												: ''
									  }`
									: info?.value?.label
							}`}</div>
					  )
					: ''
			}
			placement="bottom"
			overlayClassName="person-tooltip-wrapper"
			color="transparent"
		>
			<Select
				placeholder={
					!value || (Array.isArray(value) && value.length === 0)
						? disabled
							? 'No data'
							: `${title || 'person'}`
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
							? '100px'
							: 'fit-content',
					color: disabled ? 'var(--secondary-font)' : 'var(--primary-font)',
				}}
				className={`person-select ${disabled ? 'disabled' : ''}`}
				popupClassName="person-select-dropdown"
				dropdownStyle={{
					backgroundColor: 'var(--card-over-card)',
					width: '220px',
				}}
				notFoundContent="No options available"
				onDropdownVisibleChange={(open) => {
					// Remove console.log
				}}
				{...(multiSelect ? { tagRender: renderPerson } : { labelRender: renderPerson })}
				dropdownRender={(menu) => {
					// Remove console.log
					return (
						<div className="person-dropdown-menu">
							<div className="person-dropdown-menu-header">
								<div className="person-dropdown-menu-header-title">{title}</div>
							</div>
							<div className="person-dropdown-menu-body">{menu}</div>
						</div>
					);
				}}
				optionRender={optionRender}
				suffixIcon={<></>}
				mode={multiSelect ? 'multiple' : undefined}
				listHeight={256}
				menuItemSelectedIcon={null}
				virtual={false}
				onChange={customOnOptionClick}
				value={info?.value}
			/>
		</Tooltip>
	);
};

export default memo(Person);
