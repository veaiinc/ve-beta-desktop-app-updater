import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/status.scss';
import { ReactComponent as PencilWithLine } from '../../../../assets/svg/tasks/pencilWithLine.svg';
import { Tooltip } from 'antd';

const Status = ({
	value,
	showLabel = true,
	customListItemStyle = {},
	onOptionClick,
	setDefault = true,
	defaultValue = 'todo',
	options = { todo: [], inProgress: [], completed: [] },
	labelField = 'label',
	valueField = 'value',
	handleEditPropertyChange,
	colors,
	title = 'Status',
	showTitle = false,
	showEditProperty = false,
}) => {
	const [info, setInfo] = useState({
		selected: null,
		open: false,
	});

	useEffect(() => {
		setInfo((prevInfo) => {
			// Find the selected option from all groups
			const allOptions = [
				...(options.todo || []),
				...(options.inProgress || []),
				...(options.completed || []),
			];

			// First try to find the selected option by value
			const selectedOption = allOptions.find((item) => item?._id === value);

			if (selectedOption) {
				return {
					...prevInfo,
					selected: selectedOption,
				};
			}

			// If value exists but no matching status found, use default status
			if (value) {
				const defaultStatus = allOptions.find((item) => item?.isDefault);
				if (defaultStatus) {
					// Notify parent about falling back to default
					onOptionClick?.(defaultStatus._id);
					return {
						...prevInfo,
						selected: defaultStatus,
					};
				}
			}

			// If setDefault is true and no value is selected
			if (setDefault && !value) {
				// First try to find the default status
				const defaultStatus = allOptions.find((item) => item?.isDefault);

				// If found default status, use it
				if (defaultStatus) {
					onOptionClick?.(defaultStatus._id);
					return {
						...prevInfo,
						selected: defaultStatus,
					};
				}

				// Fallback to first todo item if no default status found
				if (options.todo?.length > 0) {
					onOptionClick?.(options.todo[0]._id);
					return {
						...prevInfo,
						selected: options.todo[0],
					};
				}
			}

			// Keep previous selection if nothing else matches
			return prevInfo;
		});
	}, [value, options, setDefault, onOptionClick]);

	const customOnOptionClick = (value) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			open: false,
		}));
		onOptionClick(value);
	};

	const handleDropdown = (value) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			open: value,
		}));
	};

	return (
		<Tooltip
			open={info?.open}
			onOpenChange={(open) => {
				if (!open) {
					handleDropdown(false);
				}
			}}
			title={
				<div className="status-dropdown-container" onClick={(e) => e?.stopPropagation()}>
					<div className="status-dropdown-header-wrapper">
						<span
							className="select-listItem"
							style={{
								backgroundColor: colors?.[info?.selected?.color]?.backgroundColor,
							}}
						>
							<span
								className="select-listItem-color"
								style={{ backgroundColor: colors?.[info?.selected?.color]?.color }}
							></span>
							<span className="select-listItem-label">
								{info?.selected?.[labelField] || (!value ? 'Select status' : '')}
							</span>
						</span>
					</div>
					<div className="status-dropdown-body-wrapper">
						{[
							{
								group: 'To-do',
								options: options.todo || [],
							},
							{
								group: 'InProgress',
								options: options.inProgress || [],
							},
							{
								group: 'Completed',
								options: options.completed || [],
							},
						]?.map((item, index) => (
							<div
								className={`status-option-container ${
									!(index === 2) || showEditProperty ? 'border-bottom' : ''
								}`}
								key={item?.group}
							>
								<div className="option-heading">{item?.group}</div>
								<div className="option-list">
									{item?.options?.map((option) => (
										<span
											key={option?._id}
											className="select-listItem"
											style={{
												backgroundColor:
													colors?.[option?.color]?.backgroundColor,
											}}
											onClick={() => {
												customOnOptionClick(option?._id);
											}}
										>
											<span
												className="select-listItem-color"
												style={{
													backgroundColor: colors?.[option?.color]?.color,
												}}
											></span>
											<span className="select-listItem-label">
												{option?.label}
											</span>
										</span>
									))}
								</div>
							</div>
						))}
					</div>
					{showEditProperty && (
						<div
							className="status-dropdown-footer-wrapper"
							onClick={() => {
								handleDropdown(false);
								handleEditPropertyChange({ propName: 'status' });
							}}
						>
							<PencilWithLine />
							<span className="status-dropdown-footer-text">Edit property</span>
						</div>
					)}
				</div>
			}
			placement="bottom"
			overlayClassName="status-dropdown"
			color="transparent"
			trigger={['click']}
			onClick={(e) => {
				e?.stopPropagation();
			}}
		>
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				<div className="listItem-status">
					<div
						className={`select-listItem`}
						style={{
							...customListItemStyle,
							backgroundColor: colors?.[info?.selected?.color]?.backgroundColor,
						}}
						onClick={() => {
							handleDropdown(true);
						}}
					>
						<span
							className="select-listItem-color"
							style={{
								backgroundColor: colors?.[info?.selected?.color]?.color,
							}}
						></span>
						{showLabel ? (
							<p className="select-listItem-label">
								{info?.selected?.[labelField] || (!value ? 'Select status' : '')}
							</p>
						) : (
							''
						)}
					</div>
				</div>
			</Tooltip>
		</Tooltip>
	);
};

export default memo(Status);
