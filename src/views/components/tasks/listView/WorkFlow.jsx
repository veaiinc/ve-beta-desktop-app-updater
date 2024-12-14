import React, { useEffect, useState } from 'react';
import DropDown from '../../dropDown/tasks/DropDown';
import { ReactComponent as Cube } from '../../../../assets/svg/tasks/cube.svg';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const WorkFlow = ({
	value,
	val,
	title,
	workflows = [],
	onOptionClick,
	customListItemStyle = {},
}) => {
	const [info, setInfo] = useState({
		selectedLabel: '',
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedLabel: workflows.find((option) => option?.value === (value ? value?._id : val))
				?.label,
		}));
	}, [workflows, value?._id, val]);

	return (
		<Tooltip title={'Workflow'} placement="bottom">
			<div className="listItem-workflow">
				<DropDown
					options={workflows}
					onOptionClick={onOptionClick}
					selected={value ? value._id : val}
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
		</Tooltip>
	);
};

export default WorkFlow;
