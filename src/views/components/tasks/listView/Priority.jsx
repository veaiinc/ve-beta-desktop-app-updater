import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';
import { Tooltip } from 'antd';

const Priority = ({
	value,
	onOptionClick,
	customListItemStyle = {},
	setDefault = true,
	title = 'Priority',
	showTitle = false,
}) => {
	const [info, setInfo] = useState({
		options: [
			{
				value: 'high',
				label: 'High',
				color: '#673932',
			},
			{
				value: 'medium',
				label: 'Medium',
				color: '#2F4469',
			},
			{
				value: 'low',
				label: 'Low',
				color: '#373737',
			},
		],
		isDropdownOpen: false,
		selected: setDefault ? 'low' : null,
	});
	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selected: prevInfo?.options.find(
				(item) => item.value === (value ? value : setDefault ? 'low' : null),
			),
		}));
	}, [value, setDefault]);

	return (
		<div className="listItem-priority">
			<DropDown
				title={'Change priority'}
				options={info?.options}
				selected={value}
				onOptionClick={onOptionClick}
				valueSelector="value"
			>
				<Tooltip
					title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
					placement="bottom"
					overlayClassName="tooltip-overlay-container"
					color="transparent"
				>
					<div
						className={`currentItem`}
						style={{ ...customListItemStyle, backgroundColor: info?.selected?.color }}
					>
						{value ? (
							<p className="listItem-label">{info?.selected?.label}</p>
						) : (
							<p className="listItem-label">Select priority</p>
						)}
					</div>
				</Tooltip>
			</DropDown>
		</div>
	);
};

export default memo(Priority);
