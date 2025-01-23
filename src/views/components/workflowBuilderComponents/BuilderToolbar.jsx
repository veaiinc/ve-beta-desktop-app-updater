import { Drawer } from 'antd';
import React, { useCallback, useMemo } from 'react';
import '../../../assets/scss/workflowBuilder/builderToolbar.scss';
import Actions from './WorkflowBuilderSidebarComponents/Actions';
import Conditions from './WorkflowBuilderSidebarComponents/Conditions';
import Notification from './WorkflowBuilderSidebarComponents/Notification';
const BuilderToolbar = ({ open, onCLose, sidebarType, activeEdge, templateId }) => {
	const componentMapper = useMemo(() => {
		return {
			actions: <Actions onCLose={onCLose} activeEdge={activeEdge} templateId={templateId} />,
			conditions: (
				<Conditions onCLose={onCLose} activeEdge={activeEdge} templateId={templateId} />
			),
			notifications: (
				<Notification onCLose={onCLose} activeEdge={activeEdge} templateId={templateId} />
			),
			pipeline: <Actions onCLose={onCLose} activeEdge={activeEdge} templateId={templateId} />,
			trigger: <Actions onCLose={onCLose} activeEdge={activeEdge} templateId={templateId} />,
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
