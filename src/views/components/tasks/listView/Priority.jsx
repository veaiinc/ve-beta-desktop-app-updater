import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';

const Priority = ({ value, onOptionClick, customListItemStyle = {}, setDefault = true }) => {
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
		selected: null,
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
				<div
					className={`currentItem`}
					style={{ ...customListItemStyle, backgroundColor: info?.selected?.color }}
				>
					<p className="listItem-label">{info?.selected?.label || 'Select priority'}</p>
				</div>
			</DropDown>
		</div>
	);
};

export default memo(Priority);
