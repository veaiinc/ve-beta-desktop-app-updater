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

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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
