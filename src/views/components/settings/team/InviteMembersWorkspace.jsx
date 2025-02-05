import React from 'react';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/settings/teamMembers.scss';
import ReusableButtonSettings from '../ReusableButtonSettings';
import ReactModal from '../../modalsV2';
const InviteMembersWorkspaceComponent = ({
	handleChnage,
	info,
	handleSubmit,
	sendRequestList,
	setsendRequestList,
	isOpen,
	closeModal,
}) => {
	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal}>
			<div className="settingsBoxContainer inviteMemberComponent">
				<div className="inviteMemberText">
					<div className="inviteMemberTitle">
						<h1>Invite Members to Workspace</h1>
						<CrossSvg onClick={closeModal} style={{ cursor: 'pointer' }} />
					</div>
					<div className="inviteMemberDescription">
						Members you invite will have full access to your workspace unless you
						customise user roles
					</div>
				</div>

				{sendRequestList?.map((singleUser, index) => {
					return (
						<div style={{ width: '100%' }}>
							<div className="sendRequestInputContainer">
								<div className="sendRequestInput">
									<input
										type="email"
										className="textInput"
										placeholder="Type here..."
										name="email"
										onChange={(e) => handleChnage(e, index)}
										value={singleUser?.email}
									/>
									<div className="dropdownContainer">
										<select
											className="dropdownInput"
											name="userRole"
											onChange={(e) => handleChnage(e, index)}
										>
											<option value="admin">Admin</option>
											<option value="default">Member</option>
										</select>
									</div>
								</div>
							</div>

							{singleUser?.emailIDError && !singleUser?.successTrue && (
								<p
									style={{
										color: 'crimson',
										fontSize: '11px',
										fontFamily: 'Inter',
										textAlign: 'end',
										marginTop: '10px',
									}}
								>
									{singleUser.emailIDMessage}
								</p>
							)}

							{singleUser?.successTrue && !singleUser?.emailIDError && (
								<p
									style={{
										color: 'green',
										fontSize: '11px',
										fontFamily: 'Inter',
										textAlign: 'end',
										marginTop: '10px',
									}}
								>
									{singleUser.emailIDMessage}
								</p>
							)}
						</div>
					);
				})}

				<div className="buttonsContainer">
					<div style={{ minWidth: '150px', display: 'flex', gap: '5px' }}>
						<ReusableButtonSettings text="Send Request" func={handleSubmit} />
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default InviteMembersWorkspaceComponent;
