import { useState, memo } from 'react';
import '../../../assets/scss/dropdown/dropdown.scss';
import DownArrow from '../../../assets/svg/chat/downArrow.svg?react';
import Instagram from '../../../assets/svg/chat/instagram.svg?react';
import Tick from '../../../assets/svg/chat/tick.svg?react';
const DropDown = ({
	containerStyle,
	dropDownStyle,
	selectedValue,
	uniqueIdKey,
	onChange,
	options,
	iconComponent,
	valueSelector,
	selectedPageId,
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

								{selectedPageId === option?.pageId ? (
									<span style={{ display: 'flex', alignItems: 'center' }}>
										<Tick />
									</span>
								) : (
									''
								)}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};
export default memo(DropDown);
