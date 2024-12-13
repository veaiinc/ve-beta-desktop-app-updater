import React, { useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';
import { Tooltip } from 'antd';

const Person = ({
	value,
	showName = false,
	title,
	customListItemStyle = {},
	onOptionClick,
	persons = [],
	removeBtn = false,
}) => {
	const updatedOnOptionClick = useCallback(
		(value) => {
			const data = persons?.find((person) => person.value === value);
			onOptionClick({ ...data, name: data?.label });
		},
		[persons, onOptionClick],
	);
	return (
		<DropDown
			options={persons}
			onOptionClick={updatedOnOptionClick}
			selected={value?._id}
			valueSelector="value"
		>
			<Tooltip title={title} placement="bottom">
				<div className="listItem-person" style={customListItemStyle}>
					{value ? (
						<>
							<div className="avatar">
								{/* <img src={profile || ''} alt="" /> */}
								<div className="profile-name">
									{typeof value == 'object' && value?.name
										? value?.name[0].toUpperCase()
										: ''}
								</div>
							</div>
							{showName ? <div className="name">{value?.name}</div> : ''}
							{removeBtn && (
								<div
									className="remove-btn"
									style={{ color: '#e74c3c', fontSize: '12px' }}
									onClick={() => onOptionClick(null)}
								>
									&#10005;
								</div>
							)}
						</>
					) : (
						<div className="listItem-text">Select Person</div>
					)}
				</div>
			</Tooltip>
		</DropDown>
	);
};

export default Person;
