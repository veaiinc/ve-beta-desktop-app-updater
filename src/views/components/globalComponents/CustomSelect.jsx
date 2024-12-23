import React, { useState, useRef, useEffect, memo } from 'react';
import '../../../assets/scss/globalComponents/customSelect.scss';

const CustomSelect = ({
	value,
	onChange,
	options = [],
	disabled = false,
	maxTagCount = 3,
	placeholder = 'Select Item...',
	style,
	className = '',
	containerClassName = '',
	dropdownClassName = '',
	tagClassName = '',
	optionClassName = '',
	selectedOptionClassName = '',
	moreTagClassName = '',
	placeholderClassName = '',
	...rest
}) => {
	const selectRef = useRef(null);
	const [info, setInfo] = useState({
		isOpen: false,
		hoveredItem: null,
		selectedItems: options.filter((opt) => value.includes(opt.value)),
		displayedTags: options.filter((opt) => value.includes(opt.value)).slice(0, maxTagCount),
		hiddenTags: options.filter((opt) => value.includes(opt.value)).slice(maxTagCount),
	});

	useEffect(() => {
		const selectedItems = options.filter((opt) => value.includes(opt.value));
		setInfo((prev) => ({
			...prev,
			selectedItems,
			displayedTags: selectedItems.slice(0, maxTagCount),
			hiddenTags: selectedItems.slice(maxTagCount),
		}));
	}, [value, maxTagCount, options]);

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

	const handleRemoveItem = (itemValue) => onChange(value.filter((v) => v !== itemValue));

	const handleHover = (hoveredItem) => setInfo((prev) => ({ ...prev, hoveredItem }));

	const handleOptionSelect = (optionValue) => {
		const newValue = value.includes(optionValue)
			? value.filter((v) => v !== optionValue)
			: [...value, optionValue];
		onChange(newValue);
		setInfo((prev) => ({ ...prev, isOpen: false }));
	};

	return (
		<>
			<div className={`parent-select ${containerClassName}`} ref={selectRef}>
				<div
					className={`select-bar ${disabled ? 'disabled' : 'enabled'} ${
						info.isOpen ? 'open' : 'closed'
					} ${className}`}
					onClick={handleToggleOpen}
				>
					<div className="flex flex-wrap gap-2">
						{info?.displayedTags?.map((item) => (
							<span key={item?.value} className={`tag-item ${tagClassName}`}>
								{item?.label}
								{!disabled && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveItem(item?.value);
										}}
										className="remove-button"
									>
										×
									</button>
								)}
							</span>
						))}
						{info?.hiddenTags?.length > 0 && (
							<div
								className="hidden-tags-container"
								onMouseEnter={() => handleHover('hidden')}
								onMouseLeave={() => handleHover(null)}
							>
								<span className={`more-tags ${moreTagClassName}`}>
									+{info?.hiddenTags?.length} more
								</span>
								{info.hoveredItem === 'hidden' && (
									<div className={`hidden-tags-dropdown ${dropdownClassName}`}>
										{info?.hiddenTags?.map((item) => (
											<div
												key={item?.value}
												className={`hidden-tag-item ${optionClassName}`}
											>
												{item?.label}
											</div>
										))}
									</div>
								)}
							</div>
						)}
						{info?.selectedItems?.length === 0 && (
							<span className={`placeholder-text ${placeholderClassName}`}>
								{placeholder}
							</span>
						)}
					</div>
				</div>

				{info.isOpen && !disabled && (
					<div
						className={`absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto ${dropdownClassName}`}
					>
						{options.map((option) => (
							<div
								key={option.value}
								className={`px-4 py-2 cursor-pointer ${
									value.includes(option.value)
										? `bg-blue-50 text-blue-800 ${selectedOptionClassName}`
										: `hover:bg-gray-50 ${optionClassName}`
								}`}
								onClick={() => handleOptionSelect(option.value)}
							>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
};
export default memo(CustomSelect);
