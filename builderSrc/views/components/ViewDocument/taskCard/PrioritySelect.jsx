import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as ArrowDown } from '../../../../assets/svg/dropDown.svg';
import './TaskCard.scss';

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
		const selected = options.find((option) => option._id === value);
		return selected || options[0] || null;
	};

	const getStatusColor = (option) => {
		// Get the status from label or _id
		const status = (option?.label || option?._id || '').toLowerCase();

		switch (status) {
			case 'pending':
				return '#f59e0b'; // Orange
			case 'in progress':
			case 'inprogress':
			case 'in_progress':
				return '#3b82f6'; // Blue
			case 'completed':
			case 'complete':
				return '#10b981'; // Green
			case 'cancelled':
			case 'canceled':
				return '#ef4444'; // Red
			case 'high':
			case 'urgent':
				return '#ef4444'; // Red for priority
			case 'medium':
			case 'normal':
				return '#f59e0b'; // Orange for priority
			case 'low':
				return '#10b981'; // Green for priority
			default:
				return '#6b7280'; // Gray for unknown
		}
	};

	const selectedOption = getSelectedOption();

	return (
		<div className="priority-select" ref={dropdownRef}>
			<div className="priority-select__trigger" onClick={() => setIsOpen(!isOpen)}>
				<div className="priority-select__selected">
					<div
						className="priority-select__color-dot"
						style={{ backgroundColor: getStatusColor(selectedOption) }}
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
										style={{ backgroundColor: getStatusColor(option) }}
									/>
									<span className="priority-select__option-label">
										{option.label}
									</span>
								</div>
								{option._id === value && (
									<div className="priority-select__checkmark"></div>
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
