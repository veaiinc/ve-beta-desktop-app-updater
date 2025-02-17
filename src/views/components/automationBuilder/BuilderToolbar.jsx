import { Drawer } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/automation_builder/builderToolbar.scss';
import Actions from './AutomationBuilderSidebarComponents/Actions';
import Conditions from './AutomationBuilderSidebarComponents/Conditions';
import Notification from './AutomationBuilderSidebarComponents/Notification';
import Context from '../../../context/context';
import Triggers from './AutomationBuilderSidebarComponents/Triggers';
import RunSidebar from './AutomationBuilderSidebarComponents/RunSidebar';
const BuilderToolbar = ({
	open,
	onClose,
	sidebarType,
	activeEdge,
	templateId,
	activeStepsData,
	editMode,
	refetchWorkflowBuilderData,
	automationId,
	step,
}) => {
	const {
		templates: { getAllSlackChannels },
		profileInfo: { getTenantSettings, tennantSettingsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		googleConnected: false,
		slackConnected: false,
	});

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		} else {
			const { slack, google } = tennantSettingsData || {};
			const obj = {
				googleConnected: false,
				slackConnected: false,
			};
			if (google?.accessToken) {
				obj.googleConnected = true;
			}
			if (slack?.accessToken) {
				getAllSlackChannels(slack?.accessToken);
				obj.slackConnected = true;
			}
			setInfo((prev) => ({ ...prev, ...obj }));
		}
	}, [tennantSettingsData]);

	const componentMapper = useMemo(() => {
		return {
			triggers: (
				<Triggers
					onCLose={onClose}
					activeEdge={activeEdge}
					templateId={templateId}
					automationId={automationId}
					slackConnected={info?.slackConnected}
					googleConnected={info?.googleConnected}
					step={step}
				/>
			),
			actions: (
				<Actions
					onCLose={onClose}
					activeEdge={activeEdge}
					templateId={templateId}
					activeStepsData={activeStepsData}
					editMode={editMode}
					refetchWorkflowBuilderData={refetchWorkflowBuilderData}
				/>
			),
			conditions: (
				<Conditions
					onCLose={onClose}
					activeEdge={activeEdge}
					templateId={templateId}
					activeStepsData={activeStepsData}
					editMode={editMode}
					refetchWorkflowBuilderData={refetchWorkflowBuilderData}
				/>
			),
			notifications: (
				<Notification
					onCLose={onClose}
					activeEdge={activeEdge}
					templateId={templateId}
					slackConnected={info?.slackConnected}
					googleConnected={info?.googleConnected}
					activeStepsData={activeStepsData}
					editMode={editMode}
					refetchWorkflowBuilderData={refetchWorkflowBuilderData}
					automationId={automationId}
				/>
			),

			run: <RunSidebar automationId={automationId} onClose={onClose} />,

			pipeline: <Actions onCLose={onClose} activeEdge={activeEdge} templateId={templateId} />,
			trigger: <Actions onCLose={onClose} activeEdge={activeEdge} templateId={templateId} />,
		};
	}, [sidebarType, onClose, info?.slackConnected, info?.googleConnected, step, automationId]);

	return (
		<Drawer
			onClose={onClose}
			open={open}
			width={360}
			style={{ padding: '0px', backgroundColor: '#141415', borderLeft: '1px solid #2c2d2e' }}
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
