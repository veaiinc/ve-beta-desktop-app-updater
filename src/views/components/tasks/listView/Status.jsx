import React, { useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

import { ReactComponent as Check } from '../../../../assets//svg/tasks/checkmark.svg';
import { ReactComponent as CheckGreen } from '../../../../assets//svg/tasks/checkGreen.svg';
import { ReactComponent as Timer } from '../../../../assets//svg/tasks/timer.svg';
import { ReactComponent as Spinner } from '../../../../assets//svg/tasks/spinner.svg';
import { ReactComponent as CircleHollow } from '../../../../assets/svg/tasks/circleHollowThin.svg';
import { ReactComponent as Cross } from '../../../../assets//svg/tasks/cross.svg';
import DropDown from '../../dropDown/tasks/DropDown';

const Status = ({ value = 'todo', showLabel = false, customListItemStyle = {}, onOptionClick }) => {
	const [info, setInfo] = useState({
		options: [
			{
				label: 'On hold',
				value: 'onHold',
				icon: <Spinner />,
			},
			{
				label: 'Todo',
				value: 'todo',
				icon: <CircleHollow />,
			},
			{
				label: 'In progress',
				value: 'inProgress',
				icon: <Timer />,
			},
			{ label: 'Completed', value: 'completed', icon: <CheckGreen /> },
			// {
			// 	label: 'canceled',
			// 	icon: <Cross />,
			// },
		],
		isDropdownOpen: false,
	});

	const updateStatusInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	return (
		<div className="listItem-status">
			<DropDown
				title={'Change status'}
				options={info?.options}
				valueSelector="value"
				selected={value}
				onOptionClick={onOptionClick}
			>
				<div
					className={`currentIcon ${showLabel ? `listItem-border` : ``}`}
					style={customListItemStyle}
				>
					{info?.options.find((item) => item.value === value)?.icon}
					{showLabel ? <p className="listItem-label">{value}</p> : ''}
				</div>
			</DropDown>
		</div>
	);
};

export default Status;
