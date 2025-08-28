import React, { Component } from 'react';

class LayoutResizeHandle extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				className="layout-resize-handle"
				onMouseDown={(e) => this.props.handleResizeLayout(e, this.props.blocks?.[0]?._id)}
				style={{
					position: 'absolute',
					bottom: 0,
					right: '20%',
					transform: 'translateX(-50%)',
					width: '40px',
					height: '14px',
					background: '#79ecc9',
					borderRadius: '4px 4px 0 0',
					cursor: 'grab',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					zIndex: 100,
					padding: '10px',
				}}
			>
				<div
					style={{
						width: '20px',
						height: '2px',
						background: 'white',
						borderRadius: '2px',
						position: 'relative',
					}}
				>
					<div
						style={{
							position: 'absolute',
							width: '20px',
							height: '2px',
							background: 'white',
							borderRadius: '2px',
							top: -5,
						}}
					/>
					<div
						style={{
							position: 'absolute',
							width: '20px',
							height: '2px',
							background: 'white',
							borderRadius: '2px',
							top: 5,
						}}
					/>
				</div>
			</div>
		);
	}
}

export default LayoutResizeHandle;
