import React, { Component } from 'react';
import Draggable from 'react-draggable';

class MultiSelectionComp extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Draggable
				bounds={`.${this.props.className}`}
				scale={1}
				position={this.props.selectionBoxPosition}
				onDrag={(e, data) =>
					!this.props.isResizing && this.props.handleGroupSelectionBoxDrag(e, data)
				}
				onStop={(e, data) =>
					this.props.isResizing ? '' : this.props.handleGroupSelectionBoxDragStop(e, data)
				}
				disabled={
					this.props.client ||
					this.props.previewMode === 'ml' ||
					this.props.previewType === 'ml'
				}
			>
				<div
					id="multi-select-box-id"
					ref={this.props.groupResizeRef}
					style={{
						position: 'absolute',
						left: Math.min(
							this.props.selectionBox.startX,
							this.props.selectionBox.endX,
						),
						top: Math.min(this.props.selectionBox.startY, this.props.selectionBox.endY),
						width: Math.abs(
							this.props.selectionBox.endX - this.props.selectionBox.startX,
						),
						height: Math.abs(
							this.props.selectionBox.endY - this.props.selectionBox.startY,
						),
						border: '2px solid #79ecc9',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						cursor: 'move',
						zIndex: 9999,
						display:
							Math.abs(
								this.props.selectionBox.endY - this.props.selectionBox.startY,
							) > 10
								? 'block'
								: 'none',
					}}
				>
					{/* {this.props.resizeHandles.map((handle, index) => (
								<div
									key={index}
									style={{
										...baseHandleStyle,
										...handle.position,

										cursor: handle.cursor,
										transform: handle.transform || '',
									}}
									// onMouseDown={(e) =>
									// 	this.handleResizeStart(
									// 		e,
									// 		handle.direction,
									// 		component?._id,
									// 		row?._id,
									// 		component?.divStyles
									// 			?.gridArea,
									// 		component?.divStyles
									// 			?.mGridArea,
									// 	)
									// }
									// onMouseDown={(e) => this.handleGroupResizeStart(e, handle)}
								/>
							))} */}
				</div>
			</Draggable>
		);
	}
}

export default MultiSelectionComp;
