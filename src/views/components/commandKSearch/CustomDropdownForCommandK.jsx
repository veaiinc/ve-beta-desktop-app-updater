import React, { useState, useRef, useEffect, memo } from 'react';
import '../../../assets/scss/commandKSearch/customDropdownStyles.scss';
import ArrowDown from '../../../assets/svg/CaretDown.svg?react';

const CustomDropdown = ({ options, value, onChange, placeholder = 'Please select' }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleOptionClick = (optionValue) => {
		onChange(optionValue);
		setIsOpen(false);
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	// Filter out empty value options
	const filteredOptions = options.filter((option) => option.value !== '');

	return (
		<div className={'command-k-search-custom-dropdown'} ref={dropdownRef}>
			<div className={`toggle ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>
				<span className={`toggle-value ${!value ? 'placeholder' : ''}`}>
					{options.find((opt) => opt.value === value)?.label || placeholder}
				</span>
				<span className="toggle-arrow">
					<ArrowDown />
				</span>
			</div>

			<div className={`menu ${isOpen ? 'open' : ''}`}>
				{filteredOptions.map((option) => (
					<div
						key={option.value}
						className={`menu-item ${value === option.value ? 'selected' : ''}`}
						onClick={() => handleOptionClick(option.value)}
					>
						{option.label}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(CustomDropdown);
