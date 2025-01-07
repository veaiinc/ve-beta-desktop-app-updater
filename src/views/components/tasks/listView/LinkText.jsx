import { Tooltip } from 'antd';
import React from 'react';
console.log('LinkText');
const typeMapper = {
	link: '',
	email: 'mailto:',
	phone: 'tel:',
};

const LinkText = ({ value, linkType = 'link' }) => {
	return <Tooltip title={value}>{value}</Tooltip>;
};

export default LinkText;
