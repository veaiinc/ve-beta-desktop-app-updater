import React, { useState, memo } from 'react';
import '../../../assets/scss/dropdown/dropdown.scss';
import { ReactComponent as DownArrow } from '../../../assets/svg/chat/downArrow.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/chat/instagram.svg';
import { ReactComponent as Tick } from '../../../assets/svg/chat/tick.svg';
const DropDown = ({
	containerStyle,
	dropDownStyle,
	selectedValue,
	uniqueIdKey,
	onChange,
	options,
	iconComponent,
	valueSelector,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggleDropdown = () => setIsOpen(!isOpen);
	const handleOptionClick = (option) => {
		onChange(option);
		setIsOpen(false);
	};
	const handleClose = () => {
		setIsOpen(false);
	};
	return (
		<div className="dropdown-comp">
			<div className="dropdown-header" style={containerStyle || {}} onClick={toggleDropdown}>
				{iconComponent}
				<span className="selectedPage">{selectedValue}</span>
				<DownArrow />
			</div>
			{isOpen && (
				<>
					<div className="dropdown-overlay" onClick={handleClose}></div>
					<div className="dropdown-menu" style={dropDownStyle || {}}>
						{options.map((option, index) => (
							<div
								key={index}
								className="dropdown-item"
								onClick={() => handleOptionClick(option)}
							>
								<div
									style={{
										display: 'flex',
										gap: '16px',
										alignItems: 'center',
										flex: 1,
									}}
								>
									<Instagram />
									<span>
										{valueSelector === 'itself'
											? option
											: option?.[valueSelector]}
									</span>
								</div>

								{
									<span style={{ display: 'flex', alignItems: 'center' }}>
										<Tick />
									</span>
								}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};
export default memo(DropDown);
