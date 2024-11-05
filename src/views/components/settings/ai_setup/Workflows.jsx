import { memo, useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReactComponent as HollowCircleBlue } from '../../../../assets/svg/Settings/hollow-circle-blue.svg';
import '../../../../assets/scss/settings/aiSetupPage.scss';
import { message } from 'antd';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';
import { ReactComponent as LinkWhite } from '../../../../assets/svg/Settings/link-white-color.svg';

const Workflows = ({
	info,
	renderAssignedWorkflows = false,
	hideRemove = false,
	allowWorkflowsSelection = false,
	setSelectedWorkflows,
	assistantId,
}) => {
	let {
		aiSetup: {
			assignedWorkflowsToAiAssistant,
			getAssignedWorkflowsToAiAssistant,
			unassignWorkflowToAiAssistant,
			workflows,
			getWorkflows,
		},
	} = useContext(Context);

	const [isLoading, setIsLoading] = useState(false);

	const handleWorkflowSelection = (e, workflow) => {
		if (e?.target?.checked) {
			setSelectedWorkflows((prev) => ({
				...prev,
				selectedWorkflows: [...prev?.selectedWorkflows, workflow?._id],
			}));
		} else {
			setSelectedWorkflows((prev) => ({
				...prev,
				selectedWorkflows: prev?.selectedWorkflows?.filter((id) => id !== workflow?._id),
			}));
		}
	};

	const handleRemoveWorkflow = async (assistantId, workflowId) => {
		setIsLoading(true);
		const response = await unassignWorkflowToAiAssistant(assistantId, workflowId);
		if (!response) {
			message.error('Failed to unassign workflow! Please try again.');
		} else {
			message.success('Workflow unassigned  successfully!');
			getAssignedWorkflowsToAiAssistant(assistantId, 1, 10, true);
		}
		setIsLoading(false);
	};

	const fetchMoreWorkflows = async () => {
		if (renderAssignedWorkflows) {
			alert('fetching more workflows');
			getAssignedWorkflowsToAiAssistant(
				assistantId,
				assignedWorkflowsToAiAssistant?.currentPage + 1,
				10,
			);
		} else {
			getWorkflows(workflows?.currentPage + 1, 10);
		}
	};

	return (
		<div id="workflowsDiv">
			<InfiniteScroll
				className="workflows-infinite-scroll"
				dataLength={
					renderAssignedWorkflows
						? assignedWorkflowsToAiAssistant?.data?.length
						: workflows?.data?.length
				}
				height={310}
				scrollableTarget="workflowsDiv"
				hasMore={
					renderAssignedWorkflows
						? assignedWorkflowsToAiAssistant?.hasMore || false
						: workflows?.hasMore || false
				}
				next={fetchMoreWorkflows}
				loader={
					<div
						style={{
							color: 'white',
							textAlign: 'center',
							fontSize: '10px',
							padding: '4px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '4px',
						}}
					>
						<span>Fetching More Files...</span>
						<Spinner width={'12px'} height={'12px'} />
					</div>
				}
			>
				{(renderAssignedWorkflows
					? assignedWorkflowsToAiAssistant?.data
					: workflows?.data
				)?.map(
					(workflow) =>
						workflow?.tenantId !== null && (
							<div key={workflow?._id} className="templates-container">
								<div className="template-preview-and-details-container">
									{allowWorkflowsSelection && (
										<div className="workflow-selection-checkbox">
											<input
												onChange={(e) =>
													handleWorkflowSelection(e, workflow)
												}
												type="checkbox"
											/>
										</div>
									)}
									<div className="template-preview">
										<iframe
											src={
												window.location.hostname === 'localhost'
													? `http://localhost:3000/preview/${workflow?._id}?module=${workflow?.moduleTemplates?.[0]?._id}&isPubic=${workflow?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`
													: `https://builder.ve.ai/preview/${workflow?._id}?module=${workflow?.moduleTemplates?.[0]?._id}&isPubic=${workflow?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`
											}
											title="Builder Preview"
											style={{ zoom: 0.3 }}
										/>
									</div>
									<div className="template-details">
										<h1 className="template-name">{workflow?.title}</h1>
										<ul>
											{workflow?.moduleTemplates?.map((moduleInfo) => {
												return (
													<li key={moduleInfo?._id}>
														<HollowCircleBlue />
														<span>{moduleInfo?.module}</span>
													</li>
												);
											})}
										</ul>
										<div className="default-knowledge-container">
											<p>Default Knowledge: </p>
											<div className="default-knowledge-link-container">
												<LinkWhite />
												<p>Smart File</p>
											</div>
										</div>
									</div>
								</div>
								{!hideRemove && (
									<button
										disabled={isLoading}
										style={{
											cursor: isLoading ? 'not-allowed' : 'pointer',
										}}
										onClick={() =>
											handleRemoveWorkflow(assistantId, workflow?._id)
										}
										className="template-remove"
									>
										Remove
									</button>
								)}
							</div>
						),
				)}
			</InfiniteScroll>
		</div>
	);

	// <Skeleton width={'100%'} height={'292px'} />
};

export default memo(Workflows);
