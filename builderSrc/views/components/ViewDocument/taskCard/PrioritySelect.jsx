import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as ArrowDown } from '../../../../assets/svg/dropDown.svg';

const PrioritySelect = ({ value, onOptionClick, options = [] }) => {
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
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleOptionClick = (option) => {
		onOptionClick(option._id);
		setIsOpen(false);
	};

	const getSelectedOption = () => {
		return options.find((option) => option._id === value) || options[0];
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'high':
				return '#ef4444';
			case 'medium':
				return '#f59e0b';
			case 'low':
				return '#10b981';
			default:
				return '#10b981';
		}
	};

	const selectedOption = getSelectedOption();

	return (
		<div className="priority-select" ref={dropdownRef}>
			<div className="priority-select__trigger" onClick={() => setIsOpen(!isOpen)}>
				<div className="priority-select__selected">
					<div
						className="priority-select__color-dot"
						style={{ backgroundColor: getPriorityColor(selectedOption?._id) }}
					/>
					<span className="priority-select__label">
						{selectedOption?.label || 'Select Priority'}
					</span>
				</div>
				<div className={`priority-select__arrow ${isOpen ? 'open' : ''}`}>
					<ArrowDown className={`toggle-icon ${isOpen ? 'open' : ''}`} />
				</div>
			</div>

			{isOpen && (
				<div className="priority-select__dropdown">
					<div className="priority-select__title">Priority</div>
					<div className="priority-select__options">
						{options.map((option) => (
							<div
								key={option._id}
								className={`priority-select__option ${
									option._id === value ? 'selected' : ''
								}`}
								onClick={() => handleOptionClick(option)}
							>
								<div className="priority-select__option-content">
									<div
										className="priority-select__color-dot"
										style={{ backgroundColor: getPriorityColor(option._id) }}
									/>
									<span className="priority-select__option-label">
										{option.label}
									</span>
								</div>
								{option._id === value && (
									<div className="priority-select__checkmark">✓</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default PrioritySelect;
