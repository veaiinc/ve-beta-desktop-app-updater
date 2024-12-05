import React from 'react';

const Text = ({ value, isTitle = true }) => {
	return <div className={`text ${isTitle ? `title` : ``}`}>{value}</div>;
};

export default Text;
