import React from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Text = ({ value, isTitle = true }) => {
	return <div className={`listItem-text ${isTitle ? `listItem-title` : ``}`}>{value}</div>;
};

export default Text;
