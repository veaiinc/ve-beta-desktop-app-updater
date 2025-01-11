import { Tooltip } from 'antd';
import React, { memo, useState, useCallback, useEffect } from 'react';
import { ReactComponent as DustbinOutlined } from '../../../../assets/svg/tasks/dustBin.svg';
import '../../../../assets/scss/dropdown/tasks/propertyEditDropDown.scss';

const PropertyEditDropDown = ({ children, colors, value, onDelete, onUpdate }) => {
	const [info, setInfo] = useState({
		selectedColor: value?.color || null,
		label: value?.label || '',
		isOpen: false,
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			selectedColor: value?.color,
			label: value?.label,
		}));
	}, [value?.color, value?.label]);

	const handleVisibleChange = useCallback(
		(visible) => {
			setInfo((prev) => ({
				...prev,
				isOpen: visible,
			}));

			// Update label when closing if it has changed
			if (!visible && info.label.trim() !== value.label) {
				onUpdate({ label: info.label.trim() });
			}
		},
		[info.label, value.label, onUpdate],
	);

	const handleLabelChange = useCallback((e) => {
		e.stopPropagation();
		const newLabel = e.target.value;
		setInfo((prev) => ({
			...prev,
			label: newLabel,
		}));
	}, []);

	const handleLabelKeyDown = useCallback(
		(e) => {
			e.stopPropagation();
			if (e.key === 'Enter') {
				e.preventDefault();
				if (info.label.trim() !== value.label) {
					onUpdate({ label: info.label.trim() });
				}
			}
		},
		[info.label, value.label, onUpdate],
	);

	// Handle color selection
	const handleColorSelect = useCallback(
		(e, colorId) => {
			e.stopPropagation();
			if (colorId !== info.selectedColor) {
				setInfo((prev) => ({
					...prev,
					selectedColor: colorId,
				}));
				onUpdate({ color: colorId });
			}
		},
		[info.selectedColor, onUpdate],
	);

	const handleDelete = useCallback(
		(e) => {
			e.stopPropagation();
			onDelete();
		},
		[onDelete],
	);

	return (
		<Tooltip
			title={
				<div
					className="property-edit-dropdown-wrapper"
					onClick={(e) => e.stopPropagation()}
				>
					<input
						type="text"
						className="property-edit-dropdown-input"
						placeholder="Enter new property name"
						value={info.label}
						onChange={handleLabelChange}
						onKeyDown={handleLabelKeyDown}
						onClick={(e) => e.stopPropagation()}
					/>
					<button className="delete-button option-item" onClick={handleDelete}>
						<DustbinOutlined height={16} width={16} className="delete-icon" />
						<span className="option-text">Delete</span>
					</button>
					{/* <span className="change-group option-item">Change Group</span> */}
					<div className="colors-wrapper">
						<span className="colors-title">Colors</span>
						<div className="colors-list">
							{Object.entries(colors)?.map(([key, color]) => (
								<span
									key={key}
									className="color-item"
									style={{
										backgroundColor: color?.backgroundColor,
										borderColor:
											info.selectedColor === key
												? '#F2F2F3'
												: color?.backgroundColor,
									}}
									onClick={(e) => handleColorSelect(e, key)}
								/>
							))}
						</div>
					</div>
				</div>
			}
			trigger={['click']}
			placement="bottomRight"
			overlayClassName="property-edit-dropdown-container"
			color="transparent"
			destroyTooltipOnHide={false}
			forceRender={true}
			open={info.isOpen}
			onOpenChange={handleVisibleChange}
		>
			<div onClick={() => handleVisibleChange(!info.isOpen)}>{children}</div>
		</Tooltip>
	);
};

export default memo(PropertyEditDropDown);
