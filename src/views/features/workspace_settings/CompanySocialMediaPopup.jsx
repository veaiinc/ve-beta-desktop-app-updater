import React from 'react';
import 'react-phone-input-2/lib/style.css';
import Modal from '../../components/modals';
import TenantController from '../../../controllers/tenant';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';

class CompanySocialMediaPopup extends TenantController {
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
						maxHeight: '350px',
						borderRadius: '40px',
						padding: '32px 24px 0 24px',
					}}
				>
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
							Add your Social Media
						</span>
						<span style={{ cursor: 'pointer' }} onClick={this.props.handleClose}>
							<CrossIcon />
						</span>
					</div>
					<div style={{ width: '100%', padding: '24px 0 0 0' }}>
						<div
							style={{
								fontFamily: 'Inter',
								fontSize: '11px',
								color: '#b0b0b0',
								lineHeight: '16px',
								paddingLeft: '11px',
							}}
						>
							{this.props.logo.charAt(0).toUpperCase() + this.props.logo.slice(1)}{' '}
							Link
						</div>
						<div>
							<input
								style={{
									borderRadius: '10px',
									border: '1px solid #242424A3',
									width: '100%',
									height: '48px',
									padding: '11px 14px',
									marginTop: '5px',
									backgroundColor: '#151515',
									color: '#E4E5E63D',
									fontSize: '16px',
									fontFamily: 'Inter',
								}}
								placeholder="Type here.."
								// onChange={(e) => this.saveInputValue(e)}
								// value={this.state.businessName}
								// isInputError={this.state.errorbusinessName}
								// errorMessage={this.state.errorbusinessNameMessage}
								// disabled={!this.state.changesAllowed}
							/>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<div style={{ padding: '32px 0 32px 0', width: '100%' }}>
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
									<span>
										Add{' '}
										{this.props.logo.charAt(0).toUpperCase() +
											this.props.logo.slice(1)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}

export default CompanySocialMediaPopup;
