import React, { useContext, useEffect, useState } from 'react';
import WorkflowTemplates from '../../components/sales/workflowTemplates';
import MyWorkflows from '../../components/sales/myWorkflows';
import Context from '../../../context/context';

const _ = require('lodash');

function Sales({ type }) {
	const [workspaceId, setWorkspaceId] = useState('');
	const [tenantId, setTenantId] = useState('');
	const [isLoading, setLoading] = useState(true);
	const [myWorkflows, setMyWorkflows] = useState([]);
	const [globalWorkflows, setGlobalWorkflows] = useState([]);
	const [inSights, setInsights] = useState([]);

	let {
		templates: { getTemplates, getTemplatesStatus },
	} = useContext(Context);

	useEffect(() => {
		const fetchWorkspaceId = async () => {
			const id = localStorage.getItem('workspaceId');
			const _tenantId = localStorage.getItem('tenantId');
			setWorkspaceId(id);
			setTenantId(_tenantId);
		};

		fetchWorkspaceId();
	}, [workspaceId, tenantId]);

	useEffect(() => {
		if (workspaceId) {
			fetchTemplates();
			fetchTemplateStatus();
		}
	}, [workspaceId, tenantId]);

	const fetchTemplateStatus = async () => {
		let response = await getTemplatesStatus();
		if (response[0]) {
			setLoading(false);
			setInsights(_.filter(response[1]));
		}
	};

	const fetchTemplates = async () => {
		let response = await getTemplates();
		if (response[0]) {
			setLoading(false);
			setGlobalWorkflows(
				_.filter(response[1], {
					tenantId: null,
					//  '*'
				}),
			);
			setMyWorkflows(
				_.filter(
					response[1],
					(item) => item.tenantId !== null,

					// '*'
				),
			);
		}
	};

	return (
		<div>
			{isLoading === true ? (
				''
			) : type === 'workflows' || myWorkflows.length === 0 ? (
				<WorkflowTemplates workflows={globalWorkflows} />
			) : myWorkflows.length > 0 ? (
				<MyWorkflows workflows={myWorkflows} inSights={inSights} />
			) : (
				''
			)}
		</div>
	);
}

export default Sales;
