/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/select.scss';
import { Tooltip } from 'antd';
import { ReactComponent as SixDotsIcon } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';

const Select = ({
	value,
	options = [],
	title,
	showTitle = false,
	onOptionClick,
	colors = [],
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
		return colors?.[colorKey]?.backgroundColor || 'transparent';
	};

	return (
		<div className="select-options-wrapper">
			<Tooltip
				title={
					<div className="select-options-dropdown" onClick={(e) => e.stopPropagation()}>
						<div className="select-options-dropdown-header">
							{info?.selectedOption ? (
								<div
									className="select-list-item-tag"
									style={{
										backgroundColor: getBackgroundColor(
											info.selectedOption.color,
										),
									}}
								>
									{info.selectedOption.label}
								</div>
							) : (
								<input type="text" placeholder="Search for an option..." />
							)}
						</div>
						{!disabled && (
							<div className="select-options-dropdown-body">
								<div className="select-options-dropdown-body-title">
									Select an option
								</div>
								<div className="select-options-dropdown-body-options">
									{options?.map((option) => (
										<div
											className="select-list-item"
											key={option?._id}
											onClick={() => handleOptionClick(option?._id)}
										>
											<SixDotsIcon />
											<div className="select-list-item-tag-wrapper">
												<div
													className="select-list-item-tag"
													style={{
														backgroundColor: getBackgroundColor(
															option?.color,
														),
													}}
												>
													{option?.label}
												</div>
											</div>
											<HorizontalMoreIcon
												style={{
													width: '20px',
													height: '20px',
													stroke: '#E8E8E8',
													opacity: 0.5,
												}}
											/>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				}
				placement="bottom"
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				overlayStyle={{ minWidth: 'fit-content' }}
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
						{value ? (
							<div
								className="select-option-item"
								style={{
									backgroundColor: getBackgroundColor(
										info?.selectedOption?.color,
									),
								}}
							>
								{info?.selectedOption?.label}
							</div>
						) : (
							<div className="select-option-item">Select an option</div>
						)}
					</div>
				</Tooltip>
			</Tooltip>
		</div>
	);
};

export default memo(Select);
