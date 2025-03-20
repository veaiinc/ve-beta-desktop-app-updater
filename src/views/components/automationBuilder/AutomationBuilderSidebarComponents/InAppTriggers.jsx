/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useMemo } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppTriggers.scss';
import TaskTriggers from './TaskTriggers';
import FormResponseTrigger from './FormResponseTrigger';
import ClientTriggers from './ClientTriggers';
import FileTriggers from './FileTriggers';
import TemplateTriggers from './TemplateTriggers';

const InAppTriggers = ({ onClose, onSave, addTriggerLoading, triggerData, activeStepsData }) => {
	const moduleMapper = useMemo(() => {
		return {
			task: (
				<TaskTriggers
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
					activeStepsData={activeStepsData}
				/>
			),
			formResponse: (
				<FormResponseTrigger
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
					activeStepsData={activeStepsData}
				/>
			),
			client: (
				<ClientTriggers
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
					activeStepsData={activeStepsData}
				/>
			),
			createFile: (
				<FileTriggers
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
					activeStepsData={activeStepsData}
				/>
			),
			template: (
				<TemplateTriggers
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
					activeStepsData={activeStepsData}
				/>
			),
		};
	}, [onClose, onSave, addTriggerLoading, triggerData, activeStepsData]);
	return triggerData?.module ? moduleMapper?.[triggerData?.module] : null;
};

export default memo(InAppTriggers);
