import { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/status.scss';
import { ReactComponent as PencilWithLine } from '../../../../assets/svg/tasks/pencilWithLine.svg';
import { Tooltip } from 'antd';
import StatusDropdown from '../../dropDown/tasks/StatusDropdown';

const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

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
	// colors,
	title = 'Status',
	showTitle = false,
	disabled = false,
}) => {
	const [info, setInfo] = useState({
		selected: null,
		open: false,
	});

	useEffect(() => {
		setInfo((prevInfo) => {
			const allOptions = [
				...(options.todo || []),
				...(options.inProgress || []),
				...(options.completed || []),
			];

			const selectedOption = allOptions.find((item) => item?._id === value);
			if (selectedOption) {
				return { ...prevInfo, selected: selectedOption };
			}

			if (value) {
				const defaultStatus = allOptions.find((item) => item?.isDefault);
				if (defaultStatus && defaultStatus._id !== prevInfo.selected?._id) {
					onOptionClick?.(defaultStatus._id); // ✅ Safe to update since it's different
					return { ...prevInfo, selected: defaultStatus };
				}
			}

			if (setDefault && !value) {
				const defaultStatus = allOptions.find((item) => item?.isDefault);
				if (defaultStatus && defaultStatus._id !== prevInfo.selected?._id) {
					onOptionClick?.(defaultStatus._id);
					return { ...prevInfo, selected: defaultStatus };
				}

				if (options.todo?.length > 0 && options.todo[0]._id !== prevInfo.selected?._id) {
					onOptionClick?.(options.todo[0]._id);
					return { ...prevInfo, selected: options.todo[0] };
				}
			}

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
			open={!disabled && info?.open}
			onOpenChange={(open) => {
				if (!open) {
					handleDropdown(false);
				}
			}}
			title={
				<StatusDropdown
					colors={colors}
					options={options}
					selected={info?.selected?._id}
					onOptionClick={customOnOptionClick}
					labelField={labelField}
					valueField={valueField}
				/>
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
				<div className="listItem-status filter-wrapper">
					<div
						className={`select-listItem`}
						style={{
							...customListItemStyle,
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
