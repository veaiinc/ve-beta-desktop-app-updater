/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import DropDown from '../../dropDown/tasks/DropDown';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const WorkFlow = ({ value, val, options = [], onOptionClick, customListItemStyle = {} }) => {
	const [info, setInfo] = useState({
		selectedLabel: value?.label,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedLabel: options.find((option) => option?._id === (value ? value?._id : val))
				?.label,
		}));
	}, [options, value?._id, val]);

	return (
		<Tooltip title={'Workflow'} placement="bottom">
			<div className="listItem-workflow">
				<DropDown
					options={options}
					onOptionClick={onOptionClick}
					selected={value ? value._id : val}
					valueSelector="_id"
				>
					<span className={`currentItem`} style={customListItemStyle}>
						<span className="listItem-label">
							{info?.selectedLabel || 'Select workflow'}
						</span>
					</span>
				</DropDown>
			</div>
		</Tooltip>
	);
};

export default memo(WorkFlow);
