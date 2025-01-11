/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import DropDown from '../../dropDown/tasks/DropDown';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const Select = ({ title, value, val, options = [], onOptionClick, customListItemStyle = {} }) => {
	const [info, setInfo] = useState({
		selectedLabel: '',
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedLabel: options.find((option) => option?.value === (value ? value?._id : val))
				?.label,
		}));
	}, [options, value?._id, val]);

	return (
		<Tooltip title={title} placement="bottom">
			<div className="listItem-select">
				<DropDown
					options={options}
					onOptionClick={onOptionClick}
					selected={value ? value._id : val}
					valueSelector="value"
				>
					<span className={`selectContainer listItem-border`} style={customListItemStyle}>
						<span className="listItem-label">
							{info?.selectedLabel || `Select ${title}`}
						</span>
					</span>
				</DropDown>
			</div>
		</Tooltip>
	);
};

export default memo(Select);
