import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';

const Status = ({ value = 'todo', showLabel = true, customListItemStyle = {}, onOptionClick }) => {
	const [info, setInfo] = useState({
		options: [
			{
				label: 'On hold',
				value: 'onHold',
				color: '#939393',
				backgroundColor: '#373737',
			},
			{
				label: 'Todo',
				value: 'todo',
				color: '#939393',
				backgroundColor: '#5A5A5A',
			},
			{
				label: 'In progress',
				value: 'inProgress',
				color: '#3E70C7',
				backgroundColor: '#2F4469',
			},
			{
				label: 'Completed',
				value: 'completed',
				color: '#3B9D59',
				backgroundColor: '#375841',
			},
		],
		isDropdownOpen: false,
		selected: null,
	});
	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selected: prevInfo?.options.find((item) => item.value === value),
		}));
	}, [value]);

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
					className={`currentItem`}
					style={{
						...customListItemStyle,
						backgroundColor: info?.selected?.backgroundColor,
					}}
				>
					{/* {info?.options.find((item) => item.value === value)?.icon} */}
					<span
						style={{
							backgroundColor: info?.selected?.color,
							width: '10px',
							height: '10px',
							borderRadius: '50%',
						}}
					></span>
					{showLabel ? <p className="listItem-label">{info?.selected?.label}</p> : ''}
				</div>
			</DropDown>
		</div>
	);
};

export default memo(Status);
