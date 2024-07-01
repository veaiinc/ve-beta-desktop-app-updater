import React, { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import Modal from '../../components/modals';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';

const NotificationPopup = ({ handleClose, show, modalType, type }) => {
	const [toggleState, setToggleState] = useState(false);
	const [notificationState, setNotificationState] = useState({
		Forms: [
			'Notify me about updates in Live Form',
			'Notify me about new Forms published',
			'Notify me about new inquiries from forms',
			'Set as default for all workspaces',
		],
		Proposals: [
			'Notify me about modifications in Proposal Templates',
			'Notify me when a Proposal is Published',
			'Notify me Proposal is accepted/rejected by the Client',
			'Notify me Proposal is about to expire',
			'Set as default for all workspaces',
		],
		Projects: [
			'Notify me when a new project is created from a Proposal',
			'Notify me when a task is added/modified',
			'Notify me when a deliverable is added/modified',
			'Notify me when a shoot is added/modified',
			'Notify me when a payment is added/modified',
			'Notify me when a expense is added/modified',
			'Notify me when a collaborator is added/modified',
			'Notify me when an expense is added/modified',
			'Set as default for all workspaces',
		],
		Finances: [
			'Notify me when a client payment is added/modified',
			'Notify me for Upcoming client payments',
			'Notify me for Overdue client payments',
			'Set as default for all workspaces',
		],
		'Team Members': [
			'Notify me when Member is added/modified',
			'Set as default for all workspaces',
		],
		Galleries: [
			'Notify me when a Gallery is created/modified',
			'Notify me when a Gallery is Published',
			'Notify me when a client selects pictures',
			'Notify me when a collaborator is added/modified',
			'Notify me when a Gallery guest pin is modified',
			'Set as default for all workspaces',
		],
	});

	if (type !== 'Marketing Alerts') {
		return (
			<Modal handleClose={handleClose} show={show} modalType={modalType}>
				<div
					style={{
						backgroundColor: '#151515',
						width: '480px',
						height: 'auto',
						borderRadius: '40px',
						padding: '32px 24px 32px 24px',
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
									fontFamily: 'Inter',
									fontSize: '16px',
									color: '#e4e5e6',
									lineHeight: '24px',
								}}
							>
								Update Password
							</span>
							<span style={{ cursor: 'pointer' }} onClick={handleClose}>
								<CrossIcon />
							</span>
						</div>
						<span
							style={{
								fontFamily: 'Inter',
								fontSize: '12px',
								color: '#E4E5E67A',
								lineHeight: '20px',
							}}
						>
							Enhance account security
						</span>
					</div>

					{notificationState[type].map((text, index, arr) => (
						<div style={{ padding: '0 0 16px 0', width: '100%' }} key={index}>
							{index !== arr.length - 1 ? (
								<>
									<div
										style={{
											display: 'flex',
											gap: '2rem',
										}}
									>
										<div
											className={
												toggleState == true
													? 'f-toggle-button-container '
													: 'f-toggle-button-container active'
											}
											style={{ marginBottom: 0 }}
										>
											<div
												className="toggle-button"
												onClick={() => setToggleState(!toggleState)}
											></div>
										</div>
										<div
											style={{
												fontSize: '13px',
												color: '#e4e5e6',
												fontFamily: 'Inter',
											}}
										>
											{text}
										</div>
									</div>
								</>
							) : (
								<>
									<div
										style={{
											border: '1px solid #2827287A',
											margin: '0 0 24px 0',
										}}
									/>
									<div
										style={{
											display: 'flex',
											gap: '2rem',
										}}
									>
										<div
											className={
												toggleState == true
													? 'f-toggle-button-container '
													: 'f-toggle-button-container active'
											}
											style={{ marginBottom: 0 }}
										>
											<div
												className="toggle-button"
												onClick={() => setToggleState(!toggleState)}
											></div>
										</div>

										<div
											style={{
												fontSize: '13px',
												color: '#e4e5e6',
												fontFamily: 'Inter',
											}}
										>
											{text}
										</div>
									</div>
								</>
							)}
						</div>
					))}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<div style={{ width: '100%' }}>
							<div
								style={{
									border: '1px solid #242424A3',
									color: '#e4e5e6',
									backgroundColor: '#181818',
									cursor: 'pointer',
									borderRadius: '100px',
									padding: '16px 24px',
									height: '48px',
									fontSize: '13px',
									fontFamily: 'Inter',
									textAlign: 'center',
								}}
								onClick={() => handleClose()}
							>
								<div>
									<span>Save Changes</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	} else {
		return (
			<Modal handleClose={handleClose} show={show} modalType={modalType}>
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
									fontFamily: 'Inter',
									fontSize: '16px',
									color: '#e4e5e6',
									lineHeight: '24px',
								}}
							>
								Marketing Alerts
							</span>
							<span style={{ cursor: 'pointer' }} onClick={handleClose}>
								<CrossIcon />
							</span>
						</div>
						<span
							style={{
								fontFamily: 'Inter',
								fontSize: '12px',
								color: '#E4E5E67A',
								lineHeight: '20px',
							}}
						>
							Select your Preferences
						</span>
					</div>
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
						}}
					>
						<div>
							<div
								style={{
									fontFamily: 'Inter',
									fontSize: '11px',
									color: '#b0b0b0',
									lineHeight: '16px',
									paddingLeft: '11px',
								}}
							>
								Email ID
							</div>
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
						<div>
							<div
								style={{
									fontFamily: 'Inter',
									fontSize: '11px',
									color: '#b0b0b0',
									lineHeight: '16px',
									paddingLeft: '11px',
								}}
							>
								Phone Number
							</div>
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
								placeholder="Enter 10-digit number.."
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
							gap: '16px',
							marginTop: '24px',
						}}
					>
						<div
							className={
								toggleState == true
									? 'f-toggle-button-container '
									: 'f-toggle-button-container active'
							}
							style={{ marginBottom: 0 }}
						>
							<div
								className="toggle-button"
								onClick={() => setToggleState(!toggleState)}
							></div>
						</div>

						<div
							style={{
								fontSize: '13px',
								color: '#e4e5e6',
								fontFamily: 'Inter',
							}}
						>
							Unsubscribe me from all ve Marketing & Promotional Emails
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
									cursor: 'pointer',
									borderRadius: '100px',
									padding: '16px 24px',
									height: '48px',
									fontSize: '13px',
									fontFamily: 'Inter',
									textAlign: 'center',
								}}
								onClick={() => handleClose()}
							>
								<div>
									<span>Save Changes</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
};

export default NotificationPopup;
