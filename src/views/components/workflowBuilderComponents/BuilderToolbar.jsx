import { Drawer } from 'antd';
import React from 'react';
import '../../../assets/scss/workflowBuilder/builderToolbar.scss';
const BuilderToolbar = ({ open, onCLose }) => {
	return (
		<Drawer
			onClose={onCLose}
			open={open}
			width={360}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			mask={false}
			rootClassName="testing"
		>
			<div style={{ flex: 1, backgroundColor: 'red', height: '100%' }}></div>
		</Drawer>
	);
};

export default BuilderToolbar;
