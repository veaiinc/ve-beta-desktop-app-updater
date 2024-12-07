import React from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Person = ({ value, showName = false, title }) => {
	return (
		<div className="listItem-person" title={title}>
			<div className="avatar">
				{/* <img src={profile || ''} alt="" /> */}
				<div className="profile-name">
					{typeof value == 'object' && value?.name ? value?.name[0].toUpperCase() : ''}
				</div>
			</div>
			{showName ? <div className="name">{value?.name}</div> : ''}
		</div>
	);
};

export default Person;
