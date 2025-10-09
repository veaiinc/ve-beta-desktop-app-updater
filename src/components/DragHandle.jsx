import React, { useState, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import './DragHandle.scss';

/**
 * DragHandle component provides draggable grip icons in the four corners of the window
 * Uses -webkit-app-region: drag for Electron window dragging functionality
 * Handles are hidden by default and only appear when hovering over their respective corners
 * Handles remain visible during drag operations and interactions
 */
const DragHandle = () => {
	const [activeHandles, setActiveHandles] = useState(new Set());

	const handleMouseEnter = useCallback((corner) => {
		setActiveHandles((prev) => new Set(prev).add(corner));
	}, []);

	const handleMouseLeave = useCallback((corner) => {
		// Add a longer delay before hiding to allow cursor to move from hover zone to handle
		setTimeout(() => {
			setActiveHandles((prev) => {
				const newSet = new Set(prev);
				newSet.delete(corner);
				return newSet;
			});
		}, 300); // Increased from 100ms to 300ms
	}, []);

	// Separate handlers for direct handle interaction
	const handleHandleMouseEnter = useCallback((corner) => {
		setActiveHandles((prev) => new Set(prev).add(corner));
	}, []);

	const handleHandleMouseLeave = useCallback((corner) => {
		// Shorter delay for direct handle interaction
		setTimeout(() => {
			setActiveHandles((prev) => {
				const newSet = new Set(prev);
				newSet.delete(corner);
				return newSet;
			});
		}, 150);
	}, []);

	const handleDragStart = useCallback((corner) => {
		setActiveHandles((prev) => new Set(prev).add(corner));
	}, []);

	const handleDragEnd = useCallback((corner) => {
		// Keep visible for a bit longer after drag ends
		setTimeout(() => {
			setActiveHandles((prev) => {
				const newSet = new Set(prev);
				newSet.delete(corner);
				return newSet;
			});
		}, 500);
	}, []);

	const handleMouseDown = useCallback((corner) => {
		setActiveHandles((prev) => new Set(prev).add(corner));
	}, []);

	const handleMouseUp = useCallback((corner) => {
		// Keep visible briefly after mouse up
		setTimeout(() => {
			setActiveHandles((prev) => {
				const newSet = new Set(prev);
				newSet.delete(corner);
				return newSet;
			});
		}, 300);
	}, []);

	return (
		<div className="drag-handle-container">
			{/* Invisible hover zones for each corner */}
			{/* <div
				className="drag-hover-zone drag-hover-zone--top-left"
				onMouseEnter={() => handleMouseEnter('top-left')}
				onMouseLeave={() => handleMouseLeave('top-left')}
			></div> */}
			{/* <div
				className="drag-hover-zone drag-hover-zone--top-right"
				onMouseEnter={() => handleMouseEnter('top-right')}
				onMouseLeave={() => handleMouseLeave('top-right')}
			></div>
			<div
				className="drag-hover-zone drag-hover-zone--bottom-left"
				onMouseEnter={() => handleMouseEnter('bottom-left')}
				onMouseLeave={() => handleMouseLeave('bottom-left')}
			></div>
			<div
				className="drag-hover-zone drag-hover-zone--bottom-right"
				onMouseEnter={() => handleMouseEnter('bottom-right')}
				onMouseLeave={() => handleMouseLeave('bottom-right')}
			></div> */}

			{/* Top Left Handle */}
			<div
				className={`drag-handle drag-handle--top-left ${
					activeHandles.has('top-left') ? 'drag-handle--active' : ''
				}`}
				title="Drag window"
				tabIndex={0}
				onMouseEnter={() => handleHandleMouseEnter('top-left')}
				onMouseLeave={() => handleHandleMouseLeave('top-left')}
				onMouseDown={() => handleMouseDown('top-left')}
				onMouseUp={() => handleMouseUp('top-left')}
				onDragStart={() => handleDragStart('top-left')}
				onDragEnd={() => handleDragEnd('top-left')}
			>
				<GripVertical size={16} />
			</div>

			{/* Top Right Handle */}
			<div
				className={`drag-handle drag-handle--top-right ${
					activeHandles.has('top-right') ? 'drag-handle--active' : ''
				}`}
				title="Drag window"
				tabIndex={0}
				onMouseEnter={() => handleHandleMouseEnter('top-right')}
				onMouseLeave={() => handleHandleMouseLeave('top-right')}
				onMouseDown={() => handleMouseDown('top-right')}
				onMouseUp={() => handleMouseUp('top-right')}
				onDragStart={() => handleDragStart('top-right')}
				onDragEnd={() => handleDragEnd('top-right')}
			>
				<GripVertical size={16} />
			</div>

			{/* Bottom Left Handle */}
			<div
				className={`drag-handle drag-handle--bottom-left ${
					activeHandles.has('bottom-left') ? 'drag-handle--active' : ''
				}`}
				title="Drag window"
				tabIndex={0}
				onMouseEnter={() => handleHandleMouseEnter('bottom-left')}
				onMouseLeave={() => handleHandleMouseLeave('bottom-left')}
				onMouseDown={() => handleMouseDown('bottom-left')}
				onMouseUp={() => handleMouseUp('bottom-left')}
				onDragStart={() => handleDragStart('bottom-left')}
				onDragEnd={() => handleDragEnd('bottom-left')}
			>
				<GripVertical size={16} />
			</div>

			{/* Bottom Right Handle */}
			<div
				className={`drag-handle drag-handle--bottom-right ${
					activeHandles.has('bottom-right') ? 'drag-handle--active' : ''
				}`}
				title="Drag window"
				tabIndex={0}
				onMouseEnter={() => handleHandleMouseEnter('bottom-right')}
				onMouseLeave={() => handleHandleMouseLeave('bottom-right')}
				onMouseDown={() => handleMouseDown('bottom-right')}
				onMouseUp={() => handleMouseUp('bottom-right')}
				onDragStart={() => handleDragStart('bottom-right')}
				onDragEnd={() => handleDragEnd('bottom-right')}
			>
				<GripVertical size={16} />
			</div>
		</div>
	);
};

export default DragHandle;
