import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as ArrowDown } from '../../../../assets/svg/dropDown.svg';
import './TaskCard.scss';

const StatusSelection = ({
	value,
	onOptionClick,
	options = [
		{ id: 'pending', label: 'Pending', color: '#f59e0b' },
		{ id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
		{ id: 'completed', label: 'Completed', color: '#10b981' },
		{ id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
	],
	placeholder = 'Select Status',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

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
		onOptionClick(option.label);
		setIsOpen(false);
	};

	const getSelectedOption = () => {
		return options.find((option) => option.label === value) || options[0];
	};

	const selectedOption = getSelectedOption();

	return (
		<div className="status-selection" ref={dropdownRef}>
			<div className="status-selection__trigger" onClick={() => setIsOpen(!isOpen)}>
				<div className="status-selection__selected">
					<div
						className="status-selection__color-dot"
						style={{ backgroundColor: selectedOption?.color || '#888888' }}
					/>
					<span className="status-selection__label">{value || placeholder}</span>
				</div>
				<div className={`status-selection__arrow ${isOpen ? 'open' : ''}`}>
					<ArrowDown />
				</div>
			</div>

			{isOpen && (
				<div className="status-selection__dropdown">
					<div className="status-selection__title">Status</div>

					<div className="status-selection__options">
						{options.map((option) => (
							<div
								key={option.id}
								className={`status-selection__option ${
									option.label === value ? 'selected' : ''
								}`}
								onClick={() => handleOptionClick(option)}
							>
								<div className="status-selection__option-content">
									<div
										className="status-selection__color-dot"
										style={{ backgroundColor: option.color || '#888888' }}
									/>
									<span className="status-selection__option-label">
										{option.label}
									</span>
								</div>
								{option.label === value && (
									<div className="status-selection__checkmark"></div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default StatusSelection;
