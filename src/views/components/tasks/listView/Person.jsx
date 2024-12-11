import React, { useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';

const Person = ({
	value,
	showName = false,
	title,
	customListItemStyle = {},
	onOptionClick,
	persons = [],
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
			<div className="listItem-person" title={title} style={customListItemStyle}>
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
					</>
				) : (
					<div className="listItem-text">Select Person</div>
				)}
			</div>
		</DropDown>
	);
};

export default Person;
