import { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/select.scss';
import { Tooltip } from 'antd';
import SelectDropdown from '../../dropDown/tasks/SelectDropdown';

const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

const tooltipStyles = {
	body: { minWidth: 'fit-content' },
};

const Select = ({
	value,
	options = [],
	title,
	showTitle = false,
	onOptionClick,
	// colors = [],
	disabled = false,
}) => {
	const [info, setInfo] = useState({
		// selectedOption: options?.find((option) => option?._id === value) || null,
		selectedOption: null,
		open: false,
	});

	useEffect(() => {
		if (options?.length) {
			setInfo((prev) => ({
				...prev,
				selectedOption: options?.find((option) => option?._id === value) || null,
			}));
		}
	}, [value, options]);

	const handleOptionClick = (optionId) => {
		if (!optionId) return;
		onOptionClick?.(optionId);
		setInfo((prev) => ({ ...prev, open: false }));
	};

	const handleDropdown = (isOpen) => {
		if (disabled) return;
		setInfo((prev) => ({
			...prev,
			open: isOpen,
		}));
	};

	const getBackgroundColor = (colorKey) => {
		return colors?.[colorKey]?.color || 'transparent';
	};

	return (
		<div className="select-options-wrapper filter-wrapper">
			<Tooltip
				title={
					<SelectDropdown
						options={options}
						selected={value}
						onOptionClick={handleOptionClick}
						disabled={disabled}
						title={title}
					/>
				}
				placement="bottomLeft"
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				styles={tooltipStyles}
				overlayClassName="select-dropdown-wrapper"
				open={!disabled && info?.open}
				onClick={(e) => {
					e?.stopPropagation();
				}}
				onOpenChange={(open) => {
					if (!open) {
						handleDropdown(false);
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
						className="select-selected-wrapper"
						onClick={() => {
							handleDropdown(!info?.open);
						}}
					>
						{info?.selectedOption ? (
							<div className="select-option-item">
								<div
									className="select-option-dot"
									style={{
										backgroundColor: getBackgroundColor(
											info?.selectedOption?.color,
										),
									}}
								/>
								<div className="select-option-label">
									{info?.selectedOption?.label}
								</div>
							</div>
						) : (
							<div className="select-option-item">
								<div className="select-option-label">Select an option</div>
							</div>
						)}
					</div>
				</Tooltip>
			</Tooltip>
		</div>
	);
};

export default memo(Select);
