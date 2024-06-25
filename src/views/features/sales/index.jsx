import React from 'react';
import WorkflowTemplates from '../../components/sales/workflowTemplates';
import MyWorkflows from '../../components/sales/myWorkflows';
import { useParams } from 'react-router-dom';
import MyWorkFlowDetails from '../../components/sales/myWorkFlowDetails';
function Sales({ type }) {
	const { salesId } = useParams();

	return (
		<div>
			{salesId ? (
				<MyWorkFlowDetails />
			) : type === 'workflows' ? (
				<WorkflowTemplates />
			) : (
				<MyWorkflows />
			)}
		</div>
	);
}

export default Sales;
