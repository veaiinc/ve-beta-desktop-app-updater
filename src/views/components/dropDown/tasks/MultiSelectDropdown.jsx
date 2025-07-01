import { memo } from 'react';
import '../../../../assets/scss/tasks/select.scss';
import { ReactComponent as TickIcon } from '../../../../assets/svg/tasks/tick.svg';

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

const MultiSelectDropdown = ({
	options = [],
	selected = [],
	onOptionClick,
	disabled = false,
	title,
	renderOptionExtra,
	labelField = 'tagName',
}) => {
	const isSelected = (optionId) => {
		return Array.isArray(selected) && selected.includes(optionId);
	};

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
								className="select-list-item"
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
												{option?.[labelField]}
											</div>
											{isSelected(option?._id) && <TickIcon />}
										</div>
									</div>
									{renderOptionExtra && (
										<div className="select-option-extra">
											{renderOptionExtra(option)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(MultiSelectDropdown);
