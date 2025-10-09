import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import './DragHandle.scss';

/**
 * DragHandle component provides a simple drag bar at the top of the window
 * Uses -webkit-app-region: drag for Electron window dragging functionality
 * Simple 5px height bar that spans the full width of the window
 */
const DragHandle = () => {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div className="drag-handle-container">
			{/* Simple drag bar at the top */}
			<div
				className="drag-bar"
				title="Drag window"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{/* GripVertical icon that appears on hover */}
				<div className={`drag-icon ${isHovered ? 'drag-icon--visible' : ''}`}>
					<GripVertical size={14} />
				</div>
			</div>
		</div>
	);
};

export default DragHandle;
