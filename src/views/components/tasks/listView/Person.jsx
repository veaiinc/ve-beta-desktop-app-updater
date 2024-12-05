import React from 'react';

const Person = ({ profile, name, showName = true, title }) => {
	return (
		<div className="person" title={title}>
			<div className="avatar">
				<img src={profile || ''} alt="" />
			</div>
			{showName ? <div className="name">{name}</div> : ''}
		</div>
	);
};

export default Person;
