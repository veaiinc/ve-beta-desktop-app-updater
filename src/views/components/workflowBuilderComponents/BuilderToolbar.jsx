import { Drawer } from 'antd';
import React, { useCallback, useMemo } from 'react';
import '../../../assets/scss/workflowBuilder/builderToolbar.scss';
import Actions from './WorkflowBuilderSidebarComponents/Actions';
import Conditions from './WorkflowBuilderSidebarComponents/Conditions';
import Notification from './WorkflowBuilderSidebarComponents/Notification';
const BuilderToolbar = ({ open, onCLose, sidebarType }) => {
	const componentMapper = useMemo(() => {
		return {
			actions: <Actions onCLose={onCLose} />,
			conditions: <Conditions onCLose={onCLose} />,
			notifications: <Notification onCLose={onCLose} />,
		};
	}, [sidebarType, onCLose]);

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
			{componentMapper?.[sidebarType]}
		</Drawer>
	);
};

export default BuilderToolbar;
