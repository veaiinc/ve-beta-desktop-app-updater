import React from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Person = ({ profile, name, showName = false, title }) => {
	return (
		<div className="listItem-person" title={title}>
			<div className="avatar">
				<img src={profile || ''} alt="" />
			</div>
			{showName ? <div className="name">{name}</div> : ''}
		</div>
	);
};

export default Person;
