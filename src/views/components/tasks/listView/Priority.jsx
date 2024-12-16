import React, { memo, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { ReactComponent as UpArrow } from '../../../../assets/svg/tasks/upArrowRed.svg';
import { ReactComponent as ParallelLines } from '../../../../assets/svg/tasks/parallelLines.svg';
import { ReactComponent as DownArrow } from '../../../../assets/svg/tasks/downArrowGreen.svg';
import DropDown from '../../dropDown/tasks/DropDown';

const Priority = ({
	value = 'low',
	showLabel = false,
	onOptionClick,
	customListItemStyle = {},
}) => {
	const [info] = useState({
		options: [
			{
				label: 'high',
				icon: <UpArrow />,
			},
			{
				label: 'medium',
				icon: <ParallelLines />,
			},
			{
				label: 'low',
				icon: <DownArrow />,
			},
		],
		isDropdownOpen: false,
	});

	return (
		<div className="listItem-priority">
			<DropDown
				title={'Change priority'}
				options={info?.options}
				selected={value}
				onOptionClick={onOptionClick}
			>
				<div
					className={`currentIcon ${showLabel ? `listItem-border` : ``}`}
					style={customListItemStyle}
				>
					{info?.options.find((item) => item?.label === value)?.icon}
					{showLabel ? <p className="listItem-label">{value}</p> : ''}
				</div>
			</DropDown>
		</div>
	);
};

export default memo(Priority);
