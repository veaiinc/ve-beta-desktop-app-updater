import { Tooltip } from 'antd';
import React, { useState } from 'react';

const typeMapper = {
	link: '',
	email: 'mailto:',
	phone: 'tel:',
};

const LinkText = ({ value, linkType = 'link' }) => {
	const [info, setInfo] = useState({
		isEditing: false,
	});
	return <Tooltip title={value}>{value}</Tooltip>;
};

export default LinkText;
