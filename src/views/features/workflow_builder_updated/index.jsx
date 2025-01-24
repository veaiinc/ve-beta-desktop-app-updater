import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/updatedWorkflowBuilder.scss';
import Context from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import {
	addEdge,
	Background,
	Controls,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
	TriggerNode,
	ActionNode,
	ConditionNode,
	EndNode,
} from '../../components/workflowBuilderComponents/CustomNodes';
import CustomEdges from '../../components/workflowBuilderComponents/CustomEdges';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import BuilderToolbar from '../../components/workflowBuilderComponents/BuilderToolbar';
import { Spin } from 'antd';

// Define node types
const nodeTypes = {
	'start-step': TriggerNode,
	action: ActionNode,
	condition: ConditionNode,
	end: EndNode,
};

const edgeTypes = {
	custom: CustomEdges,
};
const WorkflowBuilderUpdated = () => {
	const {
		templates: {
			getSpecificTemplatesInfo,
			updateStateValues,
			specificTemplatesInfo,
			addEmailTriggersInWorkflow,
			getMyWorkflows,
			getTemplatesListForCreateLead,
			getAllEmailTemplates,
			allEmailTemplates,
		},
	} = useContext(Context);

	const navigate = useNavigate();
	const { templateId } = useParams();

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
	});

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	useEffect(() => {
		if (templateId) {
			getSpecificTemplatesInfo({
				templateInfoId: templateId,
			});
		}
		return () => {
			updateStateValues({ specificTemplatesInfo: null });
		};
	}, []);

	useEffect(() => {
		if (specificTemplatesInfo?.steps?.length) {
			const incomingData = specificTemplatesInfo;
			const steps = [...(incomingData?.steps || [])];
			getNodesAndEdges(steps);
		}
	}, [specificTemplatesInfo]);

	useEffect(() => {
		if (!allEmailTemplates) {
			getEmailTemplates();
		}
	}, [allEmailTemplates]);

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

		// console.log('stepsMapper', stepsMapper);
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
					xOffset = -250;
				} else if (branchType === 'no') {
					xOffset = 250;
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
					...currentStep,
					onToolBarOpen: handleToolBarOpen,
					stepsMapper: stepsMapper,
					templateId: templateId,
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
						type: 'smoothstep',
					});
					generateNodesAndEdges(ifYes.nextStepId, nodeX, branchY, 'yes', true);
				} else {
					// Add end node for Yes branch
					const endNodeId = `${stepId}-yes-end`;
					nodes.push({
						id: endNodeId,
						position: { x: nodeX - 250, y: parentY + 400 },
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
						label: 'Yes',
						animated: true,
						type: 'smoothstep',
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
						type: 'smoothstep',
					});
					generateNodesAndEdges(ifNo.nextStepId, nodeX, branchY, 'no', true);
				} else {
					// Add end node for No branch
					const endNodeId = `${stepId}-no-end`;
					nodes.push({
						id: endNodeId,
						position: { x: nodeX + 250, y: parentY + 400 },
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
						label: 'No',
						animated: true,
						type: 'smoothstep',
					});
				}
			} else if (currentStep.nextStepId) {
				// Handle regular step with next step
				edges.push({
					id: `${stepId}-${currentStep.nextStepId}`,
					source: stepId,
					target: currentStep.nextStepId,
					animated: true,
					type: 'custom',
					data: { onToolBarOpen: handleToolBarOpen },
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
					data: { onToolBarOpen: handleToolBarOpen },
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
		setInfo((prev) => ({ ...prev, toolBarOpen: false, sidebarType: null, activeEdge: null }));
	}, []);

	const handleToolBarOpen = useCallback(
		(obj = {}) => setInfo((prev) => ({ ...prev, ...obj })),
		[],
	);

	const publishWorkflow = useCallback(async () => {
		if (info?.publishLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, publishLoading: true }));
		const payload = {
			templateId: specificTemplatesInfo?._id,
			updateObj: {
				status: 'published',
			},
		};
		const response = await addEmailTriggersInWorkflow(payload);
		setInfo((prev) => ({ ...prev, publishLoading: false }));

		if (response?.[0]) {
			const { moduleTemplates } = response?.[1];
			let isPublic = false;
			for (let i = 0; i < moduleTemplates?.length; i++) {
				if (moduleTemplates?.[i]?.isPublic) {
					isPublic = true;
					break;
				}
			}

			if (isPublic) {
				updateStateValues({ generatePublicLinkData: response?.[1] });
			}
			refreshSalesModuleData();
			return navigate('/home');
		}
	}, [info?.publishLoading, specificTemplatesInfo]);

	const refetchWorkflowBuilderData = useCallback(async () => {
		await getSpecificTemplatesInfo({
			templateInfoId: templateId,
		});
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

	return (
		<div className="updatedWorkflowBuilderContainer">
			<div className="updatedBuilderHeaderContainer">
				<span className="previousStepText" onClick={() => navigate(-1)}>
					Previous Step
				</span>
				<span className="workflowBuilderHeadingTag">Workflow Builder</span>
				<div className="headerActionsContainer">
					<div className="publishBtn" onClick={publishWorkflow}>
						{info?.publishLoading ? <Spin /> : ''}
						{info?.publishLoading ? 'Publishing...' : 'Publish'}
					</div>
				</div>
			</div>
			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
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
				>
					<Controls />
					<Background variant="dots" gap={12} size={0.5} />
				</ReactFlow>
			)}
			<BuilderToolbar
				open={info?.toolBarOpen}
				onCLose={handleToolBarClose}
				sidebarType={info?.sidebarType}
				activeEdge={info?.activeEdge}
				templateId={templateId}
			/>
		</div>
	);
};

export default memo(WorkflowBuilderUpdated);
