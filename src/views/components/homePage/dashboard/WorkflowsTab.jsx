import React, { useEffect, useCallback, useState } from 'react';
import { useContext } from 'react';
import Sales from '../../../features/sales/Sales';
import { WeddingDayTimelineGeneratorCard } from '../workflows/workflowCards';
import '../../../../assets/scss/home_page/homepage.scss';
import Context from '../../../../context/context';
import { memo } from 'react';

const WorkflowsTab = () => {
	const {
		templates: { getMyWorkflows, myWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		workflowsData: [],
	});

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			workflowsData: myWorkflows?.data,
		}));
	}, [myWorkflows?.data]);
	// if (info?.workflowsData) console.log(info?.workflowsData[0]);
	console.log(myWorkflows);

	return (
		<div className="workflows-tab-container">
			<div className="workflows-tab">
				{info?.workflowsData?.map((workflow) => {
					const labels = workflow?.moduleTemplates?.map((template) => {
						return template?.label;
					});
					console.log(labels);
					return (
						<WeddingDayTimelineGeneratorCard
							workflowStats={workflow?.workflowStats}
							title={workflow?.title}
							insights={{
								'all enquiries': workflow?.formResponses,
								'smart files sent': workflow?.filesSent,
								// ['workflows']: workflow?.workflows,
							}}
							labels={labels}
						/>
					);
				})}
			</div>
			<Sales showSalesInfo={false} />
		</div>
	);
};

export default memo(WorkflowsTab);
