import React, { useEffect, useState } from 'react';
import DropDown from '../../dropDown/tasks/DropDown';
import { ReactComponent as Cube } from '../../../../assets/svg/tasks/cube.svg';

const WorkFlow = ({ value, title, workflows = [], onOptionClick, customListItemStyle = {} }) => {
	const [info, setInfo] = useState({
		options: [],
		selectedLabel: '',
	});

	useEffect(() => {
		const newOptions = workflows.map((workflow) => ({
			label: workflow.title,
			value: workflow._id,
		}));
		setInfo((prevInfo) => ({ ...prevInfo, options: newOptions }));
	}, [workflows]);

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedLabel: prevInfo.options.find((option) => option.value === value)?.label,
		}));
	}, [value, info?.options]);

	return (
		<div className="listItem-workflow">
			<DropDown
				options={info?.options}
				onOptionClick={onOptionClick}
				selected={value}
				valueSelector="value"
			>
				<span className={`selectContainer listItem-border`} style={customListItemStyle}>
					<Cube />
					<span className="listItem-label">
						{info?.selectedLabel || 'Select workflow'}
					</span>
				</span>
			</DropDown>
		</div>
	);
};

export default WorkFlow;
