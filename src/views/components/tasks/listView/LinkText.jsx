import { Tooltip } from 'antd';
import React from 'react';

const typeMapper = {
	link: '',
	email: 'mailto:',
	phone: 'tel:',
};

const LinkText = ({ value, linkType = 'link' }) => {
	return <Tooltip title={value}>{value}</Tooltip>;
};

export default LinkText;
