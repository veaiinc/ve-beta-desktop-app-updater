import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Text = ({ value, isTitle = false }) => {
	return <div className={`listItem-text ${isTitle ? `listItem-title` : ``}`}>{value}</div>;
};

export default memo(Text);
