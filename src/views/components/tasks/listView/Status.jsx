import React, { useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

import { ReactComponent as Check } from '../../../../assets//svg/tasks/checkmark.svg';
import { ReactComponent as CheckGreen } from '../../../../assets//svg/tasks/checkGreen.svg';
import { ReactComponent as Timer } from '../../../../assets//svg/tasks/timer.svg';
import { ReactComponent as Spinner } from '../../../../assets//svg/tasks/spinner.svg';
import { ReactComponent as CircleHollow } from '../../../../assets/svg/tasks/circleHollowThin.svg';
import { ReactComponent as Cross } from '../../../../assets//svg/tasks/cross.svg';
import DropDown from '../../dropDown/tasks/DropDown';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import { options } from '../../../features/workflow_builder/workflowContantsHelpers';

const Status = ({ value = 'todo', showLabel = false, customListItemStyle = {}, onOptionClick }) => {
	const [info, setInfo] = useState({
		options: [
			{
				label: 'On hold',
				value: 'onHold',
				color: '#5A5A5A',
			},
			{
				label: 'Todo',
				value: 'todo',
				color: '#7D4F27',
			},
			{
				label: 'In progress',
				value: 'inProgress',
				color: '#2F4469',
			},
			{ label: 'Completed', value: 'completed', color: '#2C593F' },
			// {
			// 	label: 'canceled',
			// 	color: <Cross />,
			// },
		],
		selected: null,
		isDropdownOpen: false,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selected: prevInfo?.options?.find((option) => option.value === value),
		}));
	}, [value]);

	const updateStatusInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	};

	return (
		// <div className="listItem-status">
		// 	<DropDown
		// 		title={'Change status'}
		// 		options={info?.options}
		// 		valueSelector="value"
		// 		selected={value}
		// 		onOptionClick={onOptionClick}
		// 	>
		// 		<div
		// 			className={`currentIcon ${showLabel ? `listItem-border` : ``}`}
		// 			style={customListItemStyle}
		// 		>
		// 			{info?.options.find((item) => item.value === value)?.icon}
		// 			{showLabel ? <p className="listItem-label">{value}</p> : ''}
		// 		</div>
		// 	</DropDown>
		// </div>
		<HeadersDropDownComp
			options={options}
			showIcon={false}
			containerStyle={{
				display: 'flex',
				padding: '4px 6px',
				alignItems: 'center',
				gap: '4px',
				borderRadius: '4px',
				backgroundColor: info?.selected?.color,
				width: 'fit-content',
				color: '#E8E8E8',
				textAlign: 'center',
				fontFamily: 'Inter',
				fontSize: '12px',
				fontStyle: 'normal',
				fontWeight: 300,
				lineHeight: 'normal',
				border: 'none',
			}}
			// dropDownStyle={{ ...dropDownStyle }}
			// dropDownTextStyling={{ ...dropDownTextStyling }}
			selectedValue={info?.selected?.label}
			// onChangeFunc={}
			showSelectedValueTick={true}
			uniqueIdentifierForTickIcon={'value'}
			// selectedValueObj={value}
			// selectedValueStyle={{
			// 	...selectedValueStyling,
			// }}
		/>
	);
};

export default Status;
