import React, { useEffect, useState } from 'react';
import DropDown from '../../dropDown/tasks/DropDown';
import { ReactComponent as Cube } from '../../../../assets/svg/tasks/cube.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import '../../../../assets/scss/tasks/listItems.scss';

const WorkFlow = ({ value, title, workflows = [], onOptionClick, customListItemStyle = {} }) => {
	const [info, setInfo] = useState({
		selectedLabel: '',
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedLabel: workflows.find((option) => option.value === value)?.label,
		}));
	}, [value, workflows]);
	const customOnOptionClick = (option) => {
		onOptionClick(option?.value);
	};

	return (
		// <div className="listItem-workflow" title={title}>
		// 	<DropDown
		// 		options={workflows}
		// 		onOptionClick={onOptionClick}
		// 		selected={value}
		// 		valueSelector="value"
		// 	>
		// 		<span className={`selectContainer listItem-border`} style={customListItemStyle}>
		// 			<Cube />
		// 			<span className="listItem-label">
		// 				{info?.selectedLabel || 'Select workflow'}
		// 			</span>
		// 		</span>
		// 	</DropDown>
		// </div>
		<HeadersDropDownComp
			options={workflows}
			showIcon={false}
			containerStyle={{
				display: 'flex',
				padding: '4px 6px',
				alignItems: 'center',
				gap: '4px',
				borderRadius: '4px',
				background: '#603B2C',
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
			selectedValue={info?.selectedLabel}
			onChangeFunc={customOnOptionClick}
			showSelectedValueTick={true}
			uniqueIdentifierForTickIcon={'value'}
			// selectedValueObj={value}
			// selectedValueStyle={{
			// 	...selectedValueStyling,
			// }}
		/>
	);
};

export default WorkFlow;
