import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/automation_builder/automationBuilder.scss';
import Context from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import {
	addEdge,
	Background,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
	TriggerNode,
	ActionNode,
	ConditionNode,
	EndNode,
	StartStepNode,
	SwitchNode,
} from '../../components/automationBuilder/CustomNodes';
import CustomEdges from '../../components/automationBuilder/CustomEdges';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import BuilderToolbar from '../../components/automationBuilder/BuilderToolbar';
import { message, Spin } from 'antd';
import Configuration from '../../components/automationBuilder/AutomationBuilderSidebarComponents/Configuration';
import TabHeader from '../../components/ai_assistant/TabHeader';
import CustomControls from '../../components/automationBuilder/CustomControls';
import { ReactComponent as ChevronRight } from '../../../assets/svg/tasks/chevronRightThin.svg';

// Define node types
const nodeTypes = {
	trigger: TriggerNode,
	action: ActionNode,
	condition: ConditionNode,
	end: EndNode,
	startStep: StartStepNode,
	createTask: ActionNode,
	switch: SwitchNode,
};

const edgeTypes = {
	custom: CustomEdges,
};
const AutomationBuilder = () => {
	const {
		templates: {
			addEmailTriggersInWorkflow,
			getMyWorkflows,
			getTemplatesListForCreateLead,
			getAllEmailTemplates,
			allEmailTemplates,
		},
		automationBuilder: {
			getAutomation,
			specificAutomationInfo,
			updateStateValues,
			getConnectionDetails,
			updateAutomation,
			getVariables,
			variables,
		},
	} = useContext(Context);

	const navigate = useNavigate();
	const { automationId } = useParams();

	const [info, setInfo] = useState({
		data: null,
		modalIsOpen: false,
		previousStepId: null,
		mode: 'create',
		currentStepInfo: null,
		currentStepIndex: null,
		incomingTemplateData: null,
		previewModal: false,
		publishLoading: false,
		renameModal: false,
		duplicateWorkflowModal: false,
		exitModal: false,
		previewType: null,
		loading: true,
		deleteWorkflowModal: false,
		deleteWorkflowLoader: false,
		stepsMapper: {},
		sidebarType: null,
		toolBarOpen: false,
		activeEdge: null,
		activeStepsData: null,
		editMode: false,
		step: '1',
		previousNode: null,
		variables: null,
	});

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	useEffect(() => {
		if (automationId) {
			getConnectionDetails();
			getAutomation(automationId);
		}
		return () => {
			updateStateValues({ specificAutomationInfo: null });
		};
	}, []);

	useEffect(() => {
		if (specificAutomationInfo) {
			if (specificAutomationInfo?.steps?.length) {
				setNodes([]);
				const incomingData = specificAutomationInfo;
				const steps = [...(incomingData?.steps || [])];
				getNodesAndEdges(steps);
			} else {
				setNodes([
					{
						id: '1',
						position: { x: 250, y: 0 },
						type: 'startStep',
						data: {
							onToolBarOpen: handleToolBarOpen,
						},
					},
				]);
			}
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [specificAutomationInfo]);

	useEffect(() => {
		if (!allEmailTemplates) {
			getEmailTemplates();
		}
	}, [allEmailTemplates]);

	useEffect(() => {
		if (info?.activeEdge) {
			const nodeDetails = nodes.find(
				(node) => node?.id === info?.activeEdge?.split('-')?.[0],
			);

			setInfo((prev) => ({ ...prev, previousNode: nodeDetails }));
		}
	}, [info?.activeEdge]);

	useEffect(() => {
		if (info?.previousNode || info?.activeStepsData) {
			const data = info?.previousNode?.data?.currentStep;
			const payload = {};
			if (data?.app === 'inApp') {
				payload.action = data?.module;
				payload.formTemplateId = data?.formTemplateId;
			} else {
				payload.action = data?.criteria?.event;
				payload.app = data?.app;
			}
			getVariables({
				automationId,
				previousStepId: info?.activeStepsData ? info?.activeStepsData?._id : data?._id,
				action: data?.module,
				editMode: info?.activeStepsData ? true : false,
			});
		}
	}, [info?.previousNode, automationId, info?.activeStepsData]);

	useEffect(() => {
		if (variables) {
			setInfo((prev) => ({ ...prev, variables: variables?.data }));
		}
	}, [variables]);

	const getEmailTemplates = useCallback(() => {
		const payload = {
			filters: {
				limit: 1000,
				page: 1,
				modules: ['forms', 'proposals', 'contracts', 'invoices'],
			},
		};
		getAllEmailTemplates(payload);
	}, [getAllEmailTemplates]);

	const getNodesAndEdges = useCallback((steps) => {
		// Initialize collections
		const stepsMapper = {};

		for (let i = 0; i < steps?.length; i++) {
			stepsMapper[steps[i]._id] = { data: steps[i], nodesMapped: false };
		}
		const nodes = [];
		const edges = [];

		// Track parent positions to align children
		const parentPositions = new Map();
		let currentY = 100; // Starting Y position

		// Recursive function to generate nodes and edges
		const generateNodesAndEdges = (
			stepId,
			parentX = 400,
			parentY = currentY,
			branchType = null,
			isFirstBranch = true,
		) => {
			// Early return if invalid step or already mapped
			if (!stepId || !stepsMapper?.[stepId] || stepsMapper?.[stepId]?.nodesMapped) {
				return;
			}

			const currentStep = stepsMapper?.[stepId]?.data;

			// Calculate x position based on branch type
			let xOffset = 0;
			if (isFirstBranch) {
				// Only offset for first nodes in yes/no branches
				if (branchType === 'yes') {
					xOffset = -400; // Specific spacing for condition branches
				} else if (branchType === 'no') {
					xOffset = 400; // Specific spacing for condition branches
				} else if (branchType && branchType.startsWith('case')) {
					// Keep wider spacing for switch cases since there can be many
					xOffset = 0; // The parent function already calculated the appropriate offset
				} else if (branchType === 'default') {
					// Default case already positioned by the parent function
					xOffset = 0;
				}
			}

			// Store this node's position
			const nodeX = parentX + xOffset;
			const nodeY = parentY + 150; //added a static height for now, will change if required
			parentPositions.set(stepId, { x: nodeX, y: nodeY });

			// Create and add node
			nodes.push({
				id: stepId,
				position: { x: nodeX, y: nodeY },
				type: currentStep?.type,
				data: {
					currentStep,
					onToolBarOpen: handleToolBarOpen,
					stepsMapper: stepsMapper,
					automationId: automationId,
					refetchWorkflowBuilderData: refetchWorkflowBuilderData,
				},
			});

			stepsMapper[stepId].nodesMapped = true;

			// Calculate next Y position for children
			const nextY = nodeY + 100;
			currentY = Math.max(currentY, nextY);

			// Handle edges based on step type
			if (currentStep.type === 'condition') {
				const { ifYes, ifNo } = currentStep;
				const branchY = nextY;

				// Handle Yes branch
				if (ifYes?.nextStepId) {
					edges.push({
						id: `${stepId}-${ifYes.nextStepId}-yes`,
						source: stepId,
						target: ifYes.nextStepId,
						label: 'Yes',
						animated: true,
						type: 'custom',
						data: {
							currentStep,
							onToolBarOpen: handleToolBarOpen,
							stepsMapper: stepsMapper,
							automationId: automationId,
							refetchWorkflowBuilderData: refetchWorkflowBuilderData,
							label: 'Yes',
						},
					});
					generateNodesAndEdges(ifYes.nextStepId, nodeX, branchY, 'yes', true);
				} else {
					// Add end node for Yes branch
					const endNodeId = `${stepId}-yes-end`;
					nodes.push({
						id: endNodeId,
						position: { x: nodeX - 400, y: parentY + 400 },
						type: 'end',
						data: {
							type: 'end',
							label: 'End',
							onToolBarOpen: handleToolBarOpen,
						},
					});
					edges.push({
						id: `${stepId}-${endNodeId}-yes`,
						source: stepId,
						target: endNodeId,
						animated: true,
						type: 'custom',
						data: {
							currentStep,
							onToolBarOpen: handleToolBarOpen,
							stepsMapper: stepsMapper,
							automationId: automationId,
							refetchWorkflowBuilderData: refetchWorkflowBuilderData,
							label: 'Yes',
						},
					});
				}

				// Handle No branch
				if (ifNo?.nextStepId) {
					edges.push({
						id: `${stepId}-${ifNo.nextStepId}-no`,
						source: stepId,
						target: ifNo.nextStepId,
						label: 'No',
						animated: true,
						type: 'custom',
						data: {
							currentStep,
							onToolBarOpen: handleToolBarOpen,
							stepsMapper: stepsMapper,
							automationId: automationId,
							refetchWorkflowBuilderData: refetchWorkflowBuilderData,
							label: 'No',
						},
					});
					generateNodesAndEdges(ifNo.nextStepId, nodeX, branchY, 'no', true);
				} else {
					// Add end node for No branch
					const endNodeId = `${stepId}-no-end`;
					nodes.push({
						id: endNodeId,
						position: { x: nodeX + 400, y: parentY + 400 },
						type: 'end',
						data: {
							type: 'end',
							label: 'End',
							onToolBarOpen: handleToolBarOpen,
						},
					});
					edges.push({
						id: `${stepId}-${endNodeId}-no`,
						source: stepId,
						target: endNodeId,
						animated: true,
						type: 'custom',
						data: {
							currentStep,
							onToolBarOpen: handleToolBarOpen,
							stepsMapper: stepsMapper,
							automationId: automationId,
							refetchWorkflowBuilderData: refetchWorkflowBuilderData,
							label: 'No',
						},
					});
				}
			} else if (currentStep.type === 'switch') {
				// Handle switch node with multiple cases
				const { cases } = currentStep;
				const branchY = nextY;

				// Calculate horizontal spread based on number of cases
				const numCases = Object.keys(cases).length;

				// Process each case in the switch node
				let caseIndex = 0;

				for (const [caseKey, caseValue] of Object.entries(cases)) {
					// Calculate position offset for this case based on 296px node width
					// Add extra space for visual separation between branches
					const caseOffset = (caseIndex - (numCases - 1) / 2) * 450;
					caseIndex++;

					const label =
						caseKey === 'default' ? 'Default' : `Case ${caseKey.replace('case', '')}`;

					if (caseValue?.nextStepId) {
						// Create edge to next step
						edges.push({
							id: `${stepId}-${caseValue.nextStepId}-${caseKey}`,
							source: stepId,
							target: caseValue.nextStepId,
							label: label,
							animated: true,
							type: 'custom',
							data: {
								currentStep,
								onToolBarOpen: handleToolBarOpen,
								stepsMapper: stepsMapper,
								automationId: automationId,
								refetchWorkflowBuilderData: refetchWorkflowBuilderData,
								label: label,
							},
						});

						// Generate child nodes recursively
						generateNodesAndEdges(
							caseValue.nextStepId,
							nodeX + caseOffset,
							branchY,
							caseKey,
							true,
						);
					} else {
						// Add end node for this case
						const endNodeId = `${stepId}-${caseKey}-end`;
						nodes.push({
							id: endNodeId,
							position: { x: nodeX + caseOffset, y: parentY + 400 },
							type: 'end',
							data: {
								type: 'end',
								label: 'End',
								onToolBarOpen: handleToolBarOpen,
							},
						});

						// Create edge to end node
						edges.push({
							id: `${stepId}-${endNodeId}-${caseKey}`,
							source: stepId,
							target: endNodeId,
							label: label,
							animated: true,
							type: 'custom',
							data: {
								currentStep,
								onToolBarOpen: handleToolBarOpen,
								stepsMapper: stepsMapper,
								automationId: automationId,
								refetchWorkflowBuilderData: refetchWorkflowBuilderData,
								label: label,
							},
						});
					}
				}
			} else if (currentStep.nextStepId) {
				// Handle regular step with next step
				edges.push({
					id: `${stepId}-${currentStep.nextStepId}`,
					source: stepId,
					target: currentStep.nextStepId,
					animated: true,
					type: 'custom',
					data: {
						currentStep,
						onToolBarOpen: handleToolBarOpen,
						stepsMapper: stepsMapper,
						automationId: automationId,
						refetchWorkflowBuilderData: refetchWorkflowBuilderData,
					},
				});
				generateNodesAndEdges(currentStep.nextStepId, nodeX, nextY, branchType, false);
			} else {
				// Add end node for regular step with no next step
				const endNodeId = `${stepId}-end`;
				nodes.push({
					id: endNodeId,
					position: { x: nodeX, y: parentY + 400 },
					type: 'end',
					data: {
						type: 'end',
						label: 'End',
						onToolBarOpen: handleToolBarOpen,
					},
				});
				edges.push({
					id: `${stepId}-${endNodeId}`,
					source: stepId,
					target: endNodeId,
					animated: true,
					type: 'custom',
					data: {
						currentStep,
						onToolBarOpen: handleToolBarOpen,
						stepsMapper: stepsMapper,
						automationId: automationId,
						refetchWorkflowBuilderData: refetchWorkflowBuilderData,
					},
				});
			}
		};

		// Start generation from the start step or process all steps
		const startStep = steps.find((step) => step.type === 'start-step');
		if (startStep) {
			generateNodesAndEdges(startStep._id);
		} else {
			steps.forEach((step) => {
				if (!stepsMapper?.[step?._id]?.nodesMapped) {
					generateNodesAndEdges(step._id);
				}
			});
		}

		setNodes(nodes);
		setEdges(edges);
		setInfo((prev) => ({ ...prev, loading: false, stepsMapper }));
	}, []);

	const handleToolBarClose = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			toolBarOpen: false,
			sidebarType: null,
			activeEdge: null,
			editMode: false,
			activeStepsData: null,
		}));
	}, []);

	const handleToolBarOpen = useCallback((obj = {}) => {
		setInfo((prev) => ({ ...prev, ...obj }));
	}, []);

	const handleActiveStepData = useCallback((data) => {
		setInfo((prev) => ({ ...prev, activeStepsData: data }));
	}, []);

	const refetchWorkflowBuilderData = useCallback(async (data) => {
		await getAutomation(automationId);

		if (data?.closeSideBar) {
			handleToolBarClose();
		}

		return [true];
	}, []);

	const refreshSalesModuleData = useCallback(async () => {
		const payload = {
			filters: {
				limit: 10,
				page: 1,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, false);
		getTemplatesListForCreateLead();
	}, []);

	const setTriggerNode = useCallback(
		(data) => {
			const newNodes = [...nodes];
			newNodes[0] = {
				id: '1',
				position: { x: 250, y: 0 },
				type: 'trigger',
				data: {
					automationId: automationId,
					group: 'Google',
					action: 'On Message Received',
					stepTitle: '',
					stepDescription: '',
				},
			};
			setNodes(newNodes);
		},
		[nodes],
	);

	const updateCurrentAutomation = useCallback(
		async (payload) => {
			const response = await updateAutomation(automationId, payload);
			if (!(response?.[0] === true)) {
				message?.error('Failed to update automation');
				return false;
			}
			return true;
		},
		[automationId, updateAutomation],
	);

	const publishAutomation = useCallback(async () => {
		if (info?.publishLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, publishLoading: true }));

		const response = await updateCurrentAutomation({ status: 'published' });
		if (response) {
			navigate(-1);
		}
		setInfo((prev) => ({ ...prev, publishLoading: false }));
	}, [info?.publishLoading, updateCurrentAutomation]);

	const reArrangeNodes = useCallback(() => {
		if (specificAutomationInfo?.steps?.length) {
			setNodes([]);
			const incomingData = specificAutomationInfo;
			const steps = [...(incomingData?.steps || [])];
			getNodesAndEdges(steps);
		}
	}, [specificAutomationInfo]);

	return (
		<div className="updatedAutomationBuilderContainer">
			<div className="updatedBuilderHeaderContainer">
				<span className="previousStepText" onClick={() => navigate(-1)}>
					<ChevronRight style={{ transform: 'rotate(180deg)' }} /> Back
				</span>
				<div className="updatedBuilderHeaderTabContainer">
					<TabHeader
						activeTab={info?.sidebarType === 'run' ? 'run' : 'workflowBuilder'}
						onTabChange={(option) => {
							if (option === 'run') {
								setInfo((prev) => ({
									...prev,
									sidebarType: 'run',
									toolBarOpen: true,
								}));
							} else {
								setInfo((prev) => ({
									...prev,
									sidebarType: null,
									toolBarOpen: false,
								}));
							}
						}}
						tabs={[
							{ label: 'Workflow builder', value: 'workflowBuilder' },
							{ label: 'Runs', value: 'run' },
						]}
					/>
				</div>
				<div className="headerActionsContainer">
					<button
						className="publishBtn"
						onClick={publishAutomation}
						disabled={
							info?.publishLoading || specificAutomationInfo?.status === 'published'
						}
					>
						{info?.publishLoading
							? 'Publishing...'
							: specificAutomationInfo?.status === 'published'
							? 'Published'
							: 'Publish'}
					</button>
				</div>
			</div>
			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
				<div className="updatedWorkflowBuilderContainer">
					<div className="reactFlowContainer">
						<ReactFlowProvider>
							{info?.sidebarType === 'run' && (
								<div className="runHistoryNameContainer">{`Run #1`}</div>
							)}

							<ReactFlow
								nodes={nodes}
								edges={edges}
								onNodesChange={onNodesChange}
								onEdgesChange={onEdgesChange}
								onConnect={onConnect}
								nodeTypes={nodeTypes}
								edgeTypes={edgeTypes}
								fitView
								defaultViewport={{ x: 0, y: 0, zoom: 0 }}
								proOptions={{ hideAttribution: true }}
							>
								<Background variant="dots" gap={12} size={0.5} />
							</ReactFlow>
							<CustomControls rearrangeNodes={reArrangeNodes} />
						</ReactFlowProvider>
					</div>

					<div className="builderToolbarContainer">
						<Configuration
							automationId={automationId}
							specificAutomationInfo={specificAutomationInfo}
							updateCurrentAutomation={updateCurrentAutomation}
						/>
					</div>
					<BuilderToolbar
						open={info?.toolBarOpen}
						onClose={handleToolBarClose}
						sidebarType={info?.sidebarType}
						activeEdge={info?.activeEdge}
						automationId={automationId}
						activeStepsData={info?.activeStepsData}
						editMode={info?.editMode}
						refetchWorkflowBuilderData={refetchWorkflowBuilderData}
						step={info?.step}
						previousNode={info?.previousNode}
						variables={info?.variables}
						handleActiveStepData={handleActiveStepData}
					/>
				</div>
			)}
		</div>
	);
};

export default memo(AutomationBuilder);
