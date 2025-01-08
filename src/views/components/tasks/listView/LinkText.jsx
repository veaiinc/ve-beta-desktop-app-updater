import React, { memo } from 'react';

const LinkText = ({ value }) => {
	return <div>{value}</div>;
};

export default memo(LinkText);
