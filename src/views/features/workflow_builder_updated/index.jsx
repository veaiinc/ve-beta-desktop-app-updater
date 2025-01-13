import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/updatedWorkflowBuilder.scss';
import Context from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import {
	addEdge,
	Background,
	Controls,
	MiniMap,
	NodeToolbar,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
	{ id: '1', position: { x: 400, y: 200 }, data: { label: '1' } },
	{ id: '2', position: { x: 400, y: 300 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];
let y = 200;
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

	useEffect(() => {
		getNodesAndEdges();
	}, []);

	const getNodesAndEdges = useCallback(() => {
		const stepsMapper = {};
		const nodes = [],
			edges = [];

		// First map all steps to the mapper object
		for (let i = 0; i < mockSteps?.length; i++) {
			stepsMapper[mockSteps[i]._id] = { data: mockSteps[i], nodesMapped: false };
		}

		// Recursive function to generate nodes and edges
		const generateNodesAndEdges = (stepId) => {
			if (!stepId || stepsMapper[stepId]?.nodesMapped) return;

			const currentStep = stepsMapper[stepId].data;

			// Create node based on step type
			nodes.push({
				id: currentStep._id,
				position: { x: 400, y },
				data: {
					label: currentStep.type,
					...currentStep,
				},
				type: currentStep.type,
			});

			y += 100;
			stepsMapper[stepId].nodesMapped = true;

			// Handle different types of steps
			if (currentStep.type === 'condition') {
				// Handle condition paths
				if (currentStep.ifYes?.nextStepId) {
					edges.push({
						id: `${currentStep._id}-${currentStep.ifYes.nextStepId}-yes`,
						source: currentStep._id,
						target: currentStep.ifYes.nextStepId,
						label: 'Yes',
						animated: true,
					});
					generateNodesAndEdges(currentStep.ifYes.nextStepId);
				}

				if (currentStep.ifNo?.nextStepId) {
					edges.push({
						id: `${currentStep._id}-${currentStep.ifNo.nextStepId}-no`,
						source: currentStep._id,
						target: currentStep.ifNo.nextStepId,
						label: 'No',
						animated: true,
					});
					generateNodesAndEdges(currentStep.ifNo.nextStepId);
				}
			} else {
				// Handle regular step
				if (currentStep.nextStepId) {
					edges.push({
						id: `${currentStep._id}-${currentStep.nextStepId}`,
						source: currentStep._id,
						target: currentStep.nextStepId,
						animated: true,
					});
					generateNodesAndEdges(currentStep.nextStepId);
				}
			}
		};

		// Find the start step and begin generation
		const startStep = mockSteps.find((step) => step.type === 'start-step');
		if (startStep) {
			generateNodesAndEdges(startStep._id);
		} else {
			// If no start step, process steps in order
			mockSteps.forEach((step) => {
				if (!stepsMapper[step._id].nodesMapped) {
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
