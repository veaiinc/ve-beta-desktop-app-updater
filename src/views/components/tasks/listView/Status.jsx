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
	options = [],
	labelField = 'label',
	valueField = 'value',
	handleEditPropertyChange,
	colors,
}) => {
	const [info, setInfo] = useState({
		options,
		todoOptions: [],
		inProgressOptions: [],
		completedOptions: [],
		open: false,
		selected: null,
	});

	useEffect(() => {
		setInfo((prevInfo) => {
			// Try to find the selected option
			let selectedOption = prevInfo?.options?.find((item) => item?._id === value);

			// If no match found and setDefault is true, use first option
			if (!selectedOption && setDefault && prevInfo?.options?.length > 0) {
				selectedOption = prevInfo.options[0];
				// Update parent with new default value
				onOptionClick?.(selectedOption?._id);
			}

			return {
				...prevInfo,
				selected: selectedOption,
			};
		});
	}, [value, setDefault, options, onOptionClick]);

	useEffect(() => {
		const todoOptions = [];
		const inProgressOptions = [];
		const completedOptions = [];

		options?.forEach((item) => {
			if (item?.group === 'todo') {
				todoOptions?.push(item);
			} else if (item?.group === 'inProgress') {
				inProgressOptions?.push(item);
			} else {
				completedOptions?.push(item);
			}
		});

		setInfo((prevInfo) => ({
			...prevInfo,
			todoOptions,
			inProgressOptions,
			completedOptions,
			options,
		}));
	}, [options]);

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
								options: info?.todoOptions,
							},
							{
								group: 'InProgress',
								options: info?.inProgressOptions,
							},
							{
								group: 'Completed',
								options: info?.completedOptions,
							},
						]?.map((item) => (
							<div className="status-option-container" key={item?.group}>
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
	);
};

export default memo(Status);
