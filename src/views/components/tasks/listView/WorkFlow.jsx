import React, { useEffect, useState } from 'react';
import DropDown from '../../dropDown/tasks/DropDown';
import { ReactComponent as Cube } from '../../../../assets/svg/tasks/cube.svg';

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

	return (
		<div className="listItem-workflow" title={title}>
			<DropDown
				options={workflows}
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
