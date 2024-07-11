import React, { useContext, useEffect, useState } from 'react';
import WorkflowTemplates from '../../components/sales/workflowTemplates';
import MyWorkflows from '../../components/sales/myWorkflows';
import Context from '../../../context/context';

const _ = require('lodash');

function Sales({ type }) {
	const [workspaceId, setWorkspaceId] = useState(localStorage.getItem('workspaceId'));
	const [tenantId, setTenantId] = useState(localStorage.getItem('tenantId'));
	const [isLoading, setLoading] = useState(true);
	const [myWorkflows, setMyWorkflows] = useState([]);
	const [globalWorkflows, setGlobalWorkflows] = useState([]);
	const [inSights, setInsights] = useState([]);

	let {
		templates: { getTemplates, getTemplatesStatus },
	} = useContext(Context);

	useEffect(() => {
		fetchTemplates();
		fetchTemplateStatus();
	}, []);

	const fetchTemplateStatus = async () => {
		let response = await getTemplatesStatus();
		if (response[0]) {
			setInsights(_.filter(response[1]));
		} else {
		}
	};

	const fetchTemplates = async () => {
		let response = await getTemplates();
		if (response[0]) {
			setLoading(false);
			let { data } = response?.[1];
			// data = data?.filter((ele) => ele?.tenantId !== null);
			setGlobalWorkflows(data);
			setMyWorkflows(data);
		}
	};

	return (
		<div>
			{isLoading === true ? (
				<div>
					<p>Loading....</p>
				</div>
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
