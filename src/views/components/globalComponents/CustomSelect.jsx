import React, { useState, useRef, useEffect, memo } from 'react';
import '../../../assets/scss/globalComponents/customSelect.scss';

// Standard format for internal use
const standardizeOption = (option, formatConfig) => {
	const { valueKey = 'value', labelKey = 'label', ...restConfig } = formatConfig;

	return {
		value: option[valueKey],
		label: option[labelKey],
		originalData: option,
		...Object.keys(restConfig).reduce((acc, key) => {
			acc[key] = option[restConfig[key]];
			return acc;
		}, {}),
	};
};

// CustomSelect component
const CustomSelect = ({
	value,
	onChange,
	options = [],
	isMulti = false,
	disabled = false,
	maxTagCount = 3,
	placeholder = 'Select Item...',
	formatConfig = {
		valueKey: 'value',
		labelKey: 'label',
	},
	className = '',
	containerClassName = '',
	dropdownClassName = '',
	tagClassName = '',
	optionClassName = '',
	selectedOptionClassName = '',
	moreTagClassName = '',
	placeholderClassName = '',
}) => {
	const selectRef = useRef(null);

	// Standardize options
	const standardizedOptions = options?.map((opt) => standardizeOption(opt, formatConfig));

	// Handle both single and multi-select values
	const standardizeValue = (val) => {
		if (!val) return isMulti ? [] : null;
		if (isMulti) {
			return Array.isArray(val)
				? val.map((v) => standardizeOption(v, formatConfig))
				: [standardizeOption(val, formatConfig)];
		}
		return standardizeOption(val, formatConfig);
	};

	// Standardize the initial value
	const standardizedValue = standardizeValue(value);

	const [info, setInfo] = useState({
		isOpen: false,
		hoveredItem: null,
		selectedItems: standardizedOptions.filter((opt) =>
			isMulti
				? (standardizedValue || []).some((v) => v.value === opt.value)
				: standardizedValue?.value === opt.value,
		),
		displayedTags: [],
		hiddenTags: [],
	});

	useEffect(() => {
		const standardizedValue = standardizeValue(value);
		const selectedItems = standardizedOptions.filter((opt) =>
			isMulti
				? (standardizedValue || []).some((v) => v.value === opt.value)
				: standardizedValue?.value === opt.value,
		);

		setInfo((prev) => ({
			...prev,
			selectedItems,
			displayedTags: selectedItems.slice(0, maxTagCount),
			hiddenTags: selectedItems.slice(maxTagCount),
		}));
	}, [value, maxTagCount, options, isMulti, formatConfig]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setInfo((prev) => ({ ...prev, isOpen: false }));
			}
		};
		if (info.isOpen) document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [info.isOpen]);

	const handleToggleOpen = () =>
		!disabled && setInfo((prev) => ({ ...prev, isOpen: !prev.isOpen }));

	const handleRemoveItem = (itemValue) => {
		const newValue = isMulti
			? info.selectedItems
					.filter((item) => item.value !== itemValue)
					.map((item) => item.originalData)
			: null;
		onChange(newValue);
	};

	const handleHover = (hoveredItem) => setInfo((prev) => ({ ...prev, hoveredItem }));

	const handleOptionSelect = (option) => {
		let newValue;
		if (isMulti) {
			const isSelected = info.selectedItems.some((item) => item.value === option.value);
			newValue = isSelected
				? info.selectedItems
						.filter((item) => item.value !== option.value)
						.map((item) => item.originalData)
				: [...info.selectedItems.map((item) => item.originalData), option.originalData];
		} else {
			newValue = option.originalData;
			setInfo((prev) => ({ ...prev, isOpen: false }));
		}
		onChange(newValue);
	};

	return (
		<div className={`select-container ${containerClassName}`} ref={selectRef}>
			<div
				className={`select-input ${disabled ? 'select-disabled' : ''} ${
					info.isOpen ? 'select-open' : ''
				} ${className}`}
				onClick={handleToggleOpen}
			>
				<div className="select-values">
					{info.displayedTags.map((item) => (
						<span key={item.value} className={`select-tag ${tagClassName}`}>
							{item.label}
							{!disabled && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveItem(item.value);
									}}
									className="select-remove"
								>
									×
								</button>
							)}
						</span>
					))}
					{info.hiddenTags.length > 0 && (
						<div
							className="select-more"
							onMouseEnter={() => handleHover('hidden')}
							onMouseLeave={() => handleHover(null)}
						>
							<span className={`select-more-tag ${moreTagClassName}`}>
								+{info.hiddenTags.length} more
							</span>
							{info.hoveredItem === 'hidden' && (
								<div className={`select-dropdown ${dropdownClassName}`}>
									{info.hiddenTags.map((item) => (
										<div
											key={item.value}
											className={`select-option ${optionClassName}`}
										>
											{item.label}
										</div>
									))}
								</div>
							)}
						</div>
					)}
					{info.selectedItems.length === 0 && (
						<span className={`select-placeholder ${placeholderClassName}`}>
							{placeholder}
						</span>
					)}
				</div>
			</div>

			{info.isOpen && !disabled && (
				<div className={`select-dropdown ${dropdownClassName}`}>
					{standardizedOptions.map((option) => (
						<div
							key={option.value}
							className={`select-option ${
								info.selectedItems.some((item) => item.value === option.value)
									? `select-option-selected ${selectedOptionClassName}`
									: optionClassName
							}`}
							onClick={() => handleOptionSelect(option)}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
export default memo(CustomSelect);
