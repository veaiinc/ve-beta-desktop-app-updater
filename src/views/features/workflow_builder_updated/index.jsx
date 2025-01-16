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
} from '../../components/workflowBuilderComponents/CustomNodes';
import CustomEdges from '../../components/workflowBuilderComponents/CustomEdges';

const mockSteps = [
	{
		criteria: {
			status: 'enquiry',
		},
		module: 'form',
		order: 1,
		_id: '6687fcc3608c200da04032b0',
		nextStepId: '66c464100d2024cacd650d98',
		nextStepType: 'action',
		type: 'start-step',
	},
	{
		criteria: {
			status: 'enquiry',
		},
		_id: '66c464100d2024cacd650d98',
		module: 'form',
		sendAt: null,
		type: 'action',
		actionType: 'notification',
		channels: ['email'],
		isEnabled: true,
		emailTemplateId: '67810cc53bd285ce4553490e',
		emailTemplateTitle: 'Form Response Mail',
		emailTemplateSubject: 'Thank You for Your Enquiry',
		nextStepId: '66c464100d2024cacd650dcc',
		nextStepType: 'condition',
		order: 2,
	},
	{
		criteria: {
			status: 'proposalAccepted',
		},
		_id: '66c464100d2024cacd650dcc',
		module: 'proposal',
		sendAt: null,
		type: 'condition',
		isEnabled: true,
		ifYes: {
			nextStepId: '66c46cb60d2024cacd650d9e',
			nextStepType: 'action',
		},
		ifNo: {
			nextStepId: '66c46ccd0d2024cacd650da0',
			nextStepType: 'action',
		},
		order: 3,
	},
	{
		criteria: {
			status: 'confirmed',
		},
		_id: '66c46cc50d2024cacd650d9f',
		module: 'contract',
		sendAt: null,
		type: 'action',
		actionType: 'notification',
		channels: ['email'],
		isEnabled: true,
		emailTemplateId: '67810cc53bd285ce4553490f',
		emailTemplateTitle: 'All Signed',
		emailTemplateSubject: "Project Confirmation: We're Ready to Capture Your Big Day!",
		nextStepId: null,
		nextStepType: null,
		order: 4,
	},
	{
		criteria: {
			status: 'contractSigned',
		},
		_id: '66c46cb60d2024cacd650d9e',
		module: 'contract',
		sendAt: null,
		actionType: 'notification',
		channels: ['email'],
		type: 'action',
		isEnabled: true,
		emailTemplateId: '67810cc53bd285ce45534910',
		emailTemplateTitle: 'Signed Contract',
		emailTemplateSubject: 'Confirmation of Signed Contract',
		nextStepId: '66c46cc50d2024cacd650d9f',
		nextStepType: 'action',
		order: 5,
	},
	{
		criteria: {
			status: 'filesSent',
		},
		_id: '66c46ccd0d2024cacd650da0',
		module: 'proposal',
		actionType: 'notification',
		channels: ['email'],
		isEnabled: true,
		sendAt: 259200,
		type: 'action',
		emailTemplateId: '67810cc53bd285ce45534911',
		emailTemplateTitle: 'Unaccepted Proposals',
		emailTemplateSubject: "Don't Miss Out: Your Proposal Awaits!",
		nextStepId: null,
		nextStepType: null,
		order: 6,
	},
];

const WorkflowBuilderUpdated = () => {
	const {
		templates: {},
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
	});

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	// Define node types
	const nodeTypes = {
		'start-step': TriggerNode,
		action: ActionNode,
		condition: ConditionNode,
	};

	const edgeTypes = {
		custom: CustomEdges,
	};

	useEffect(() => {
		getNodesAndEdges();
	}, []);

	const getNodesAndEdges = useCallback(() => {
		// Initialize collections
		const stepsMapper = new Map(
			mockSteps.map((step) => [step._id, { data: step, nodesMapped: false }]),
		);
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
			isFirstBranch = true, // Add flag to track if it's first node after branching
		) => {
			// Early return if invalid step or already mapped
			if (!stepId || !stepsMapper.has(stepId) || stepsMapper.get(stepId).nodesMapped) {
				return;
			}

			const currentStep = stepsMapper.get(stepId).data;

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
				data: {
					...currentStep,
				},
				type: currentStep.type, // This will map to our custom nodes
			});

			stepsMapper.get(stepId).nodesMapped = true;

			// Calculate next Y position for children
			const nextY = nodeY + 100;
			currentY = Math.max(currentY, nextY);

			// Handle edges based on step type
			if (currentStep.type === 'condition') {
				const { ifYes, ifNo } = currentStep;
				const branchY = nextY; // Both branches start at same Y level

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
				}

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
				}
			} else if (currentStep.nextStepId) {
				// Handle regular step
				edges.push({
					id: `${stepId}-${currentStep.nextStepId}`,
					source: stepId,
					target: currentStep.nextStepId,
					animated: true,
					type: 'custom',
				});
				// Pass isFirstBranch as false for subsequent nodes in the branch
				generateNodesAndEdges(currentStep.nextStepId, nodeX, nextY, branchType, false);
			}
		};

		// Start generation from the start step or process all steps
		const startStep = mockSteps.find((step) => step.type === 'start-step');
		if (startStep) {
			generateNodesAndEdges(startStep._id);
		} else {
			mockSteps.forEach((step) => {
				if (!stepsMapper.get(step._id).nodesMapped) {
					generateNodesAndEdges(step._id);
				}
			});
		}

		setNodes(nodes);
		setEdges(edges);
	}, []);

	return (
		<div className="updatedWorkflowBuilderContainer">
			<div className="updatedBuilderHeaderContainer"></div>
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
		</div>
	);
};

export default memo(WorkflowBuilderUpdated);
