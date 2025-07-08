import React, { Component } from 'react';
import Copy from '../actions/copy.jsx';
import Delete from '../actions/delete.jsx';

class MultiSelectionOptionComp extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		// Calculate offset for toolbar if selectionBoxPosition is provided
		const offsetX = this.props.selectionBoxPosition?.x || 0;
		const offsetY = this.props.selectionBoxPosition?.y || 0;
		return (
			<div
				className={'multi-select-components-wrap'}
				style={{
					position: 'absolute',
					left:
						Math.min(this.props.selectionBox.startX, this.props.selectionBox.endX) +
						offsetX,
					top:
						(Math.min(this.props.selectionBox.startY, this.props.selectionBox.endY) < 40
							? Math.max(this.props.selectionBox.startY, this.props.selectionBox.endY)
							: Math.min(
									this.props.selectionBox.startY,
									this.props.selectionBox.endY,
							  ) - 34) + offsetY,
				}}
			>
				<a onClick={() => this.props.handleCopyElements()}>
					<Copy />
				</a>
				<a onClick={() => this.props.handleDeleteElements()}>
					<Delete />
				</a>
			</div>
		);
	}
}

export default MultiSelectionOptionComp;
