import { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/multiSelect.scss';
import { Tooltip } from 'antd';
import MultiSelectDropdown from '../../dropDown/tasks/MultiSelectDropdown';

const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

const MultiSelect = ({
	value = [],
	options = [],
	title = 'Select tags',
	showTitle = false,
	onOptionClick,
	disabled = false,
	labelField = 'tagName',
}) => {
	const [selectedOptions, setSelectedOptions] = useState(Array.isArray(value) ? value : []);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setSelectedOptions(Array.isArray(value) ? value : []);
	}, [JSON.stringify(value)]);

	const handleOptionClick = (optionId) => {
		if (!optionId) return;

		const isRemoving = Array.isArray(selectedOptions) && selectedOptions.includes(optionId);
		const newSelectedOptions = isRemoving
			? Array.isArray(selectedOptions)
				? selectedOptions.filter((id) => id !== optionId)
				: []
			: [...(Array.isArray(selectedOptions) ? selectedOptions : []), optionId];

		const uniqueOptions = Array.from(new Set(newSelectedOptions));
		setSelectedOptions(uniqueOptions);
		onOptionClick?.(uniqueOptions);

		// Show toast message
		const selectedTag = options.find((opt) => opt._id === optionId);
	};

	const handleDropdownVisibleChange = (visible) => {
		setIsOpen(visible);
	};

	const getBackgroundColor = (colorKey) => {
		return colors?.[colorKey]?.color || 'transparent';
	};

	const displayOptions = Array.from(new Set(selectedOptions));

	return (
		<div className="select-wrapper">
			<Tooltip
				title={
					<MultiSelectDropdown
						options={options || []}
						selected={displayOptions}
						onOptionClick={handleOptionClick}
						disabled={disabled}
						title={title}
						labelField={labelField}
					/>
				}
				placement="bottom"
				arrow={false}
				trigger="click"
				color="transparent"
				overlayStyle={{ minWidth: 'fit-content' }}
				overlayClassName="select-dropdown-wrapper"
				open={!disabled && isOpen}
				onClick={(e) => {
					e?.stopPropagation();
				}}
				onOpenChange={(open) => {
					if (!open) {
						setIsOpen(false);
					}
				}}
			>
				<Tooltip
					title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
					placement="bottom"
					overlayClassName="tooltip-overlay-container"
					color="transparent"
				>
					<div
						className="select-trigger"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
					>
						<div className="select-selected-wrapper">
							{displayOptions?.length > 0 ? (
								<div className="select-option-tags">
									{displayOptions.map((optionId) => {
										const option = options?.find(
											(opt) => opt?._id === optionId,
										);
										return option ? (
											<div className="select-option-item" key={optionId}>
												<div
													className="select-option-dot"
													style={{
														backgroundColor: getBackgroundColor(
															option?.color,
														),
													}}
												/>
												<div className="select-option-label">
													{option?.[labelField]}
												</div>
											</div>
										) : null;
									})}
								</div>
							) : (
								<div className="select-option-tags">
									<div className="select-option-item">
										<div className="select-option-label">Select Options</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</Tooltip>
			</Tooltip>
		</div>
	);
};

export default memo(MultiSelect);
