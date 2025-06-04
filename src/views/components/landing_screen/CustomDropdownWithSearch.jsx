import React, { useState, useRef, useEffect } from 'react';
import '../../../assets/scss/landingScreen/contactus/customDropdownWithSearch.scss';
import { ReactComponent as ArrowDown } from '../../../assets/svg/CaretDown.svg';

const CustomDropdownWithSearch = ({ options, value, onChange, placeholder = 'Please select' }) => {
	const [isOpen, setIsOpen] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
				setSearchTerm('');
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleOptionClick = (optionValue) => {
		onChange(optionValue);
		setIsOpen(false);
		setSearchTerm('');
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
		if (!isOpen) setSearchTerm('');
	};

	const filteredOptions = options
		.filter((option) => option.value !== '')
		.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="custom-dropdown" ref={dropdownRef}>
			<div
				className={`custom-dropdown__toggle ${isOpen ? 'open' : ''}`}
				onClick={toggleDropdown}
			>
				<div className="custom-dropdown__toggle-content">
					<input
						autoFocus={isOpen}
						type="text"
						className="custom-dropdown__search-inside"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onClick={(e) => e.stopPropagation()}
					/>
					<span
						className={`custom-dropdown__toggle-value ${!value ? 'placeholder' : ''}`}
					>
						{options.find((opt) => opt.value === value)?.label || placeholder}
					</span>
				</div>
				<span className="custom-dropdown__toggle-arrow">
					<ArrowDown />
				</span>
			</div>

			{isOpen && (
				<div className={`custom-dropdown__menu open`}>
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
					{filteredOptions.length === 0 && (
						<div className="custom-dropdown__no-results">No results found</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CustomDropdownWithSearch;
