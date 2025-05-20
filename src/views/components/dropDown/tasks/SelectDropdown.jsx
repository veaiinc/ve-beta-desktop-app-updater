/* eslint-disable react-hooks/exhaustive-deps */
import { memo } from 'react';
import '../../../../assets/scss/tasks/select.scss';
import TickIcon from '../../../../assets/svg/tasks/tick.svg?react';
const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

const getBackgroundColor = (colorKey) => {
	return colors?.[colorKey]?.color || 'transparent';
};
const SelectDropdown = ({ options = [], selected, onOptionClick, disabled = false, title }) => {
	return (
		<div className="select-options-dropdown" onClick={(e) => e.stopPropagation()}>
			<div className="select-options-dropdown-header">
				<div className="select-options-dropdown-header-title">{title}</div>
			</div>
			{!disabled && (
				<div className="select-options-dropdown-body">
					<div className="select-options-dropdown-body-options">
						{options?.map((option) => (
							<div
								className={`select-list-item ${
									option?._id === selected ? 'selected' : ''
								}`}
								key={option?._id}
								onClick={() => onOptionClick?.(option?._id)}
							>
								<div className="select-list-item-tag-wrapper">
									<div className="select-option-item">
										<div
											className="select-option-dot"
											style={{
												backgroundColor: getBackgroundColor(option?.color),
											}}
										/>
										<div className="select-option-label-wrapper">
											<div className="select-option-label">
												{option?.label}
											</div>
											{option?._id === selected && <TickIcon />}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(SelectDropdown);
