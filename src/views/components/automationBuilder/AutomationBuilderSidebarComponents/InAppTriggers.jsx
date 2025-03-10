/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useMemo } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppTriggers.scss';
import TaskTriggers from './TaskTriggers';
import FormResponseTrigger from './FormResponseTrigger';
import ClientTriggers from './ClientTriggers';

const InAppTriggers = ({ onClose, onSave, addTriggerLoading, triggerData }) => {
	const moduleMapper = useMemo(() => {
		return {
			task: (
				<TaskTriggers
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
				/>
			),
			formResponse: (
				<FormResponseTrigger
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
				/>
			),
			client: (
				<ClientTriggers
					onClose={onClose}
					onSave={onSave}
					addTriggerLoading={addTriggerLoading}
					triggerData={triggerData}
				/>
			),
		};
	}, [onClose, onSave, addTriggerLoading, triggerData]);
	return triggerData?.module ? moduleMapper?.[triggerData?.module] : null;
};

export default memo(InAppTriggers);
