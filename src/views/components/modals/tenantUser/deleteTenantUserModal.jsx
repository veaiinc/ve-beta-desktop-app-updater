import React, { Component } from 'react';

export default class DeleteTenantUserModal extends Component {
	render() {
		return (
			<div className="center-confirm-delete-new">
				<div className="delete-modal-header">DELETE USER</div>
				<div className="middle-delete-container">
					<div className="middle-text">Are you sure?</div>
					<div className="middle-desc">If you delete this user, you cannot undo this</div>
				</div>
				<div className="bottom-delete-btns">
					<span className="cancel-btn" onClick={() => this.props.handleClose()}>
						No, Cancel
					</span>
					<span className="delete-btn" onClick={() => this.props.onClickAction()}>
						Yes, Delete
					</span>
				</div>
			</div>
		);
	}
}
