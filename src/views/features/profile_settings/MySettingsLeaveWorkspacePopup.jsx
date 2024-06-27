import React from 'react';
import 'react-phone-input-2/lib/style.css';
import Modal from '../../components/modals';
import TenantController from '../../../controllers/tenant';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';

class MySettingsLeaveWorkspacePopup extends TenantController {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount = async () => {};

	render() {
		return (
			<Modal
				handleClose={this.props.handleClose}
				show={this.props.show}
				modalType={this.props.modalType}
			>
				<div
					style={{
						backgroundColor: '#151515',
						width: '480px',
						height: 'auto',
						borderRadius: '40px',
						padding: '32px 24px 0 24px',
					}}
				>
					<div style={{ marginBottom: '40px' }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								gap: '5px',
							}}
						>
							<span
								style={{
									fontFamily: 'Inter Medium',
									fontSize: '16px',
									color: '#e4e5e6',
									lineHeight: '24px',
								}}
							>
								Leave this Workspace?
							</span>
							<span style={{ cursor: 'pointer' }} onClick={this.props.handleClose}>
								<CrossIcon />
							</span>
						</div>
						<span
							style={{
								fontFamily: 'Inter Medium',
								fontSize: '12px',
								color: '#E4E5E67A',
								lineHeight: '20px',
							}}
						>
							You would not be able to join again unless Invited
						</span>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<div style={{ padding: '0 0 32px 0', width: '100%' }}>
							<div
								style={{
									border: '1px solid #242424A3',
									color: '#e4e5e6',
									backgroundColor: '#181818',
									cursor:
										this.state.newPassword !== '' &&
										this.state.reNewPassword !== '' &&
										this.state.newPassword === this.state.reNewPassword &&
										this.state.currentPassword !== ''
											? 'pointer'
											: 'not-allowed',
									borderRadius: '100px',
									padding: '16px 24px',
									height: '48px',
									fontSize: '13px',
									fontFamily: 'Inter Medium',
									textAlign: 'center',
								}}
								onClick={() => this.props.handleClose()}
							>
								<div>
									<span>Confirm</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}

export default MySettingsLeaveWorkspacePopup;
