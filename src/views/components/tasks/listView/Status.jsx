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
	setDefault = false,
	options = { todo: [], inProgress: [], completed: [] },
	labelField = 'label',
	valueField = 'value',
	title = 'Status',
	showTitle = false,
	disabled = false,
	placement = 'bottom',
}) => {
	const [info, setInfo] = useState({
		selected: null,
		open: false,
		allOptions: [],
		defaultStatus: null,
	});

	useEffect(() => {
		const allOptions = [
			...(options.todo || []),
			...(options.inProgress || []),
			...(options.completed || []),
		];
		const defaultStatus = allOptions.find((item) => item?.isDefault);
		setInfo((prevInfo) => ({
			...prevInfo,
			allOptions,
			defaultStatus,
		}));
	}, [options]);

	useEffect(() => {
		const selectedOption = info?.allOptions?.find((item) => item?._id === value);
		if (selectedOption) {
			setInfo((prevInfo) => ({
				...prevInfo,
				selected: selectedOption,
			}));
		} else {
			if (setDefault) {
				onOptionClick?.(info?.defaultStatus?._id);
			} else {
				setInfo((prevInfo) => ({
					...prevInfo,
					selected: info?.defaultStatus,
				}));
			}
		}
	}, [value, info?.allOptions]);

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
			placement={placement}
			classNames={{ root: 'status-dropdown' }}
			color="transparent"
			trigger={['click']}
			arrow={false}
			onClick={(e) => {
				e?.stopPropagation();
			}}
		>
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
				placement="bottom"
				classNames={{ root: 'tooltip-overlay-container' }}
				color="transparent"
			>
				<div
					className="listItem-status filter-wrapper"
					onClick={() => {
						if (!disabled) {
							handleDropdown(true);
						}
					}}
				>
					<div
						className={`select-listItem`}
						style={{
							...customListItemStyle,
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
