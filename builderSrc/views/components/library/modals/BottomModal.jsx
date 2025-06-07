import React from 'react';
import { Drawer } from 'antd/lib';

const BottomModal = ({ onHide, show, children, title, height = '70%' }) => {
	return (
		<Drawer
			title={title || 'Add Event'}
			placement={'bottom'}
			closable={false}
			onClose={onHide}
			open={show}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			height={height}
			key={'bottom'}
			style={{
				borderRadius: '32px 32px 0 0',
			}}
		>
			{children}
		</Drawer>
	);
};

export default BottomModal;
