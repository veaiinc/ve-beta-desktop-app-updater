import React, { useState, useRef, useEffect } from 'react';
import '../../../assets/scss/landingScreen/contactus/customDropdown.scss';

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
		<div className="custom-dropdown" ref={dropdownRef}>
			<div
				className={`custom-dropdown__toggle ${isOpen ? 'open' : ''}`}
				onClick={toggleDropdown}
			>
				<span className={`custom-dropdown__toggle-value ${!value ? 'placeholder' : ''}`}>
					{options.find((opt) => opt.value === value)?.label || placeholder}
				</span>
				<span className="custom-dropdown__toggle-arrow">{isOpen ? '▲' : '▼'}</span>
			</div>

			<div className={`custom-dropdown__menu ${isOpen ? 'open' : ''}`}>
				{filteredOptions.map((option) => (
					<div
						key={option.value}
						className={`custom-dropdown__menu-item ${
							value === option.value ? 'selected' : ''
						}`}
						onClick={() => handleOptionClick(option.value)}
					>
						{option.label}
					</div>
				))}
			</div>
		</div>
	);
};

export default CustomDropdown;
