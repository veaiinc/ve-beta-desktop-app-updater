/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/select.scss';
import { Tooltip } from 'antd';
import { ReactComponent as SixDotsIcon } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';

const Select = ({ value, options = [], title, showTitle = false, onOptionClick, colors = [] }) => {
	const [info, setInfo] = useState({
		selectedOption: null,
		value: 'option1',
		open: false,
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			selectedOption: options.find((option) => option._id === value),
		}));
	}, [value]);

	const handleOptionClick = (value) => {
		onOptionClick(value);
		setInfo((prev) => ({ ...prev, open: false }));
	};

	const handleDropdown = (value) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			open: value,
		}));
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
										backgroundColor:
											colors?.[info?.selectedOption?.color]?.backgroundColor,
									}}
								>
									{info?.selectedOption?.label}
								</div>
							) : (
								<input type="text" placeholder="Search for an option..." />
							)}
						</div>
						<div className="select-options-dropdown-body">
							<div className="select-options-dropdown-body-title">
								Select an option
							</div>
							<div className="select-options-dropdown-body-options">
								{options.map((option) => (
									<div
										className="select-list-item"
										key={option._id}
										onClick={() => handleOptionClick(option?._id)}
									>
										<SixDotsIcon />
										<div className="select-list-item-tag-wrapper">
											<div
												className="select-list-item-tag"
												style={{
													backgroundColor:
														colors?.[option?.color]?.backgroundColor,
												}}
											>
												{option.label}
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
					</div>
				}
				placement="bottom"
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				overlayStyle={{ minWidth: 'fit-content' }}
				overlayClassName="select-dropdown-wrapper"
				open={info?.open}
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
									backgroundColor:
										colors?.[info?.selectedOption?.color]?.backgroundColor,
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
