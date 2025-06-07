import React, { memo, useCallback, useContext, useEffect } from 'react';
import '../../../assets/scss/design-builder/design-canvas.scss';
import {
	addEdge,
	Background,
	Controls,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import WidgetContainer from './WidgetContainer';
import WidgetForFiles from './WidgetForFiles';
import Context from '../../../context/context';

const nodeTypes = {
	module: WidgetContainer,
	moduleDesign: WidgetForFiles,
};

const DesignCanvas = ({ handleAddNewPage, handleRegenerate, data }) => {
	const {
		designBuilder: { showRightModalContextState },
	} = useContext(Context);

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

	useEffect(() => {
		if (data) {
			const { modules = [] } = data;
			let updatedNodes = [...(nodes || [])];
			let updatedEdges = [...(edges || [])];

			// Position calculation constants
			const levelHeight = 500; // Increased to 400 for even more vertical space
			const nodeSpacing = 600; // Increased to 600 for even more horizontal space
			const centerX = 1200; // Moved further right to accommodate wider layout

			// Root node (centered)
			updatedNodes = [
				{
					id: '0',
					data: { label: data.text_to_display },
					position: { x: centerX, y: 50 },
					type: 'module',
					data: {
						widgetData: data,
						handleDone: () => {},
						handleRegenerate: handleRegenerate,
						handleAddNewPage: handleAddNewPage,
					},
				},
			];

			// Calculate positions for module nodes
			modules.forEach((module, index) => {
				const numNodesInLevel = modules.length;
				const startX = centerX - ((numNodesInLevel - 1) * nodeSpacing) / 2;

				// Add module node
				updatedNodes.push({
					id: `${index + 1}`,
					position: {
						x: startX + index * nodeSpacing,
						y: levelHeight * 1.5,
					},
					type: 'moduleDesign',
					data: {
						widgetFilesData: module,
						handleDone: () => {},
						handleRegenerate: handleRegenerate,
						handleAddNewPage: handleAddNewPage,
					},
				});

				// Connect to root node
				updatedEdges.push({
					id: `e0-${index + 1}`,
					source: '0',
					target: `${index + 1}`,
					type: 'smoothstep',
				});
			});

			setNodes(updatedNodes);
			setEdges(updatedEdges);
		}
	}, [data]);

	return (
		<div
			className="design-canvas-parentContainer"
			style={{
				width: showRightModalContextState
					? 'calc(100vw - 48px - 400px)'
					: 'calc(100vw - 48px)',
				transform: showRightModalContextState
					? `translateX(calc((700px - 100vw + 48px + 400px)/2))`
					: `translateX(calc((700px - 100vw + 48px)/2))`,
			}}
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				fitView
				defaultViewport={{ x: 0, y: 0, zoom: 0 }}
				className="design-builder-react-flow"
			>
				<Background variant="dots" gap={12} size={0.5} />
			</ReactFlow>
		</div>
	);
};

export default memo(DesignCanvas);
