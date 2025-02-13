import { Drawer } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/automation_builder/builderToolbar.scss';
import Actions from './AutomationBuilderSidebarComponents/Actions';
import Conditions from './AutomationBuilderSidebarComponents/Conditions';
import Notification from './AutomationBuilderSidebarComponents/Notification';
import Context from '../../../context/context';
import Triggers from './AutomationBuilderSidebarComponents/Triggers';
const BuilderToolbar = ({
	open,
	onCLose,
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
					onCLose={onCLose}
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
					onCLose={onCLose}
					activeEdge={activeEdge}
					templateId={templateId}
					activeStepsData={activeStepsData}
					editMode={editMode}
					refetchWorkflowBuilderData={refetchWorkflowBuilderData}
				/>
			),
			conditions: (
				<Conditions
					onCLose={onCLose}
					activeEdge={activeEdge}
					templateId={templateId}
					activeStepsData={activeStepsData}
					editMode={editMode}
					refetchWorkflowBuilderData={refetchWorkflowBuilderData}
				/>
			),
			notifications: (
				<Notification
					onCLose={onCLose}
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

			pipeline: <Actions onCLose={onCLose} activeEdge={activeEdge} templateId={templateId} />,
			trigger: <Actions onCLose={onCLose} activeEdge={activeEdge} templateId={templateId} />,
		};
	}, [sidebarType, onCLose, info?.slackConnected, info?.googleConnected, step]);

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
