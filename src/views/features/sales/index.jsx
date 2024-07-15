import React, { memo, useContext, useEffect, useState, useCallback } from 'react';
import WorkflowTemplates from '../../components/sales/workflowTemplates';
import MyWorkflows from '../../components/sales/myWorkflows';
import Context from '../../../context/context';
import CreateLeadModal from '../../components/modalsV2/proposalModals/CreateLeadModal';

const _ = require('lodash');

const Sales = ({ type }) => {
	let {
		templates: { getTemplates, getTemplatesStatus },
	} = useContext(Context);
	const [workspaceId, setWorkspaceId] = useState(localStorage.getItem('workspaceId'));
	const [tenantId, setTenantId] = useState(localStorage.getItem('tenantId'));
	const [isLoading, setLoading] = useState(true);
	const [myWorkflows, setMyWorkflows] = useState([]);
	const [globalWorkflows, setGlobalWorkflows] = useState([]);
	const [inSights, setInsights] = useState([]);
	const [modalIsOpen, setIsOpen] = useState(false);

	const [createLeadData, setCreateLeadData] = useState(null);

	useEffect(() => {
		fetchTemplates();
	}, []);

	const openModal = useCallback(async (event, data) => {
		event.preventDefault();
		event.stopPropagation();
		setIsOpen(true);
		setCreateLeadData(data);
	}, []);
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setCreateLeadData(null);
	}, []);

	const fetchTemplates = async () => {
		let response = await getTemplates();
		if (response[0]) {
			setLoading(false);
			let { data } = response?.[1];
			let myWorkflowData = [],
				globalWorkflowData = [];
			for (let i = 0; i < data?.length; i++) {
				if (data?.[i]?.tenantId && data?.[i]?.tenantId !== null) {
					myWorkflowData?.push(data?.[i]);
				} else {
					globalWorkflowData?.push(data?.[i]);
				}
			}

			setMyWorkflows(myWorkflowData);
			setGlobalWorkflows(globalWorkflowData);
		}
	};

	return (
		<div>
			{isLoading === true ? (
				<div>
					<p>Loading....</p>
				</div>
			) : type === 'workflows' || myWorkflows?.length === 0 ? (
				<WorkflowTemplates workflows={globalWorkflows} />
			) : myWorkflows?.length > 0 ? (
				<MyWorkflows
					workflows={myWorkflows}
					inSights={inSights}
					openModal={openModal}
					source={'sales'}
				/>
			) : (
				''
			)}
			<CreateLeadModal
				workflow={createLeadData}
				modalIsOpen={modalIsOpen}
				closeModal={closeModal}
			/>
		</div>
	);
};

export default memo(Sales);
