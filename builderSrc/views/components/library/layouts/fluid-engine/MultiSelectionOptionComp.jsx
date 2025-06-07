import React, { Component } from 'react';
import Copy from '../actions/copy.jsx';
import Delete from '../actions/delete.jsx';

class MultiSelectionOptionComp extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				className={'multi-select-components-wrap'}
				style={{
					position: 'absolute',
					left: Math.min(this.props.selectionBox.startX, this.props.selectionBox.endX),
					top:
						Math.min(this.props.selectionBox.startY, this.props.selectionBox.endY) < 40
							? Math.max(this.props.selectionBox.startY, this.props.selectionBox.endY)
							: Math.min(
									this.props.selectionBox.startY,
									this.props.selectionBox.endY,
							  ) - 34,
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
