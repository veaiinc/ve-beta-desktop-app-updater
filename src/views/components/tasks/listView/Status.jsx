import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';

const Status = ({
	value,
	showLabel = true,
	customListItemStyle = {},
	onOptionClick,
	setDefault = true,
	defaultValue = 'todo',
	options = [],
	labelField = 'label',
	valueField = 'value',
}) => {
	const [info, setInfo] = useState({
		options,
		isDropdownOpen: false,
		selected: setDefault ? defaultValue : null,
	});
	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selected: prevInfo?.options.find(
				(item) => item[valueField] === (value ? value : setDefault ? defaultValue : null),
			),
		}));
	}, [value, setDefault, valueField, defaultValue]);

	return (
		<div className="listItem-status">
			<DropDown
				title={'Change status'}
				options={info?.options}
				valueSelector={valueField}
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
					<span
						style={{
							backgroundColor: info?.selected?.color,
							width: '10px',
							height: '10px',
							borderRadius: '50%',
						}}
					></span>
					{showLabel ? (
						<p className="listItem-label">
							{info?.selected?.[labelField] || (!value ? 'Select status' : '')}
						</p>
					) : (
						''
					)}
				</div>
			</DropDown>
		</div>
	);
};

export default memo(Status);
