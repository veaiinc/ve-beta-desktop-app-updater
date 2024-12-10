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
	const [info, setInfo] = useState({
		options: [],
	});

	useEffect(() => {
		const newOptions = persons.map((person) => ({
			label: person.firstName + ' ' + person.lastName,
			value: person._id,
		}));
		setInfo((prevInfo) => ({
			...prevInfo,
			options: newOptions,
		}));
	}, []);

	const updatedOnOptionClick = useCallback(
		(option) => {
			const value = persons.find((person) => person._id === option);
			onOptionClick(
				value ? { _id: value._id, name: value.firstName + ' ' + value.lastName } : null,
			);
		},
		[onOptionClick, persons],
	);
	return (
		<DropDown
			options={info?.options}
			onOptionClick={updatedOnOptionClick}
			selected={value?._id}
			valueSelector="value"
		>
			<div className="listItem-person" title={title} style={customListItemStyle}>
				<div className="avatar">
					{/* <img src={profile || ''} alt="" /> */}
					<div className="profile-name">
						{typeof value == 'object' && value?.name
							? value?.name[0].toUpperCase()
							: ''}
					</div>
				</div>
				{showName ? <div className="name">{value?.name}</div> : ''}
			</div>
		</DropDown>
	);
};

export default Person;
