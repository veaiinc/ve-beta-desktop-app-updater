import React, { useState, useEffect, useContext } from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import '../../../../assets/scss/settings/teamMembers.scss';
import ReusableButtonSettings from '../ReusableButtonSettings';
import ReactModal from '../../modalsV2';
import { Checkbox, message } from 'antd';

const InviteMembersWorkspaceComponent = ({
	handleChnage,
	info,
	handleSubmit,
	sendRequestList,
	setsendRequestList,
	isOpen,
	closeModal,
	selectedOption,
	tenantUserId,
	accessControls,
	handleCheckboxChange,
	selectableOptions,
	userEmail,
	selectedUser = null,
}) => {
	const {
		companyInfo: { updateTenantAccessControls, updateTenantRole },
	} = useContext(Context);

	const [updatedData, setUpdatedData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdateUser = () => {
		if (isLoading) {
			return;
		} else {
			const filteredAccessControls = accessControls?.accessControls.filter(
				(control) => !['project', 'proposal', 'gallery'].includes(control.app),
			);

			setUpdatedData({
				accessControls: filteredAccessControls,
			});
		}
	};
	useEffect(() => {
		if (updatedData) {
			setIsLoading(true);
			if (selectedUser !== selectedOption) {
				const json = {
					role: selectedOption,
				};
				updateTenantRole(selectedUser?._id, json).then((res) => {
					if (res[0] === true) {
						updateTenantAccessControls(updatedData, selectedUser?._id).then((res) => {
							if (res[0] === true) {
								message.success(res[1]?.message);
								closeModal();
								setIsLoading(false);
							} else {
								message.error(res[1]?.message);
								closeModal();
								setIsLoading(false);
							}
						});
					}
				});
			} else {
				updateTenantAccessControls(updatedData, tenantUserId).then((res) => {
					if (res[0] === true) {
						message.success(res[1]?.message);
						closeModal();
						setIsLoading(false);
					} else {
						message.error(res[1]?.message);
						closeModal();
						setIsLoading(false);
					}
				});
			}
		}
	}, [updatedData]);

	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal}>
			<div className="settingsBoxContainer inviteMemberComponent">
				<div className="inviteMemberText">
					<div className="inviteMemberTitle">
						<h1>
							{selectedUser
								? `Update ${selectedUser?.firstName} Access Controls`
								: 'Invite Members to Workspace'}
						</h1>
						<CrossSvg onClick={closeModal} style={{ cursor: 'pointer' }} />
					</div>
					<div className="inviteMemberDescription">
						{!selectedUser
							? 'Members you invite will have full access to your workspace unless you customise user roles'
							: ''}
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
										value={userEmail}
									/>
									<div className="dropdownContainer">
										<select
											className="dropdownInput"
											name="userRole"
											value={selectedOption}
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
				<div className="accessControls">
					{selectedOption !== 'admin' && (
						<div className="accessControls">
							<div className="accessControlTitle">Access Controls</div>
							<div className="accessControlOptions">
								{selectableOptions?.map((option) => {
									return (
										<div className="accessControlOption">
											<Checkbox
												type="checkbox"
												checked={
													accessControls?.accessControls?.find(
														(control) => control.app === option,
													)?.isEnabled || false
												}
												onChange={(e) =>
													handleCheckboxChange(option, e.target.checked)
												}
											/>
											<div className="accessControlOptionText">{option}</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
				<div className="buttonsContainer">
					<div style={{ minWidth: '150px', display: 'flex', gap: '5px' }}>
						<ReusableButtonSettings
							text={selectedUser ? 'Update User Access' : 'Send Request'}
							func={selectedUser ? handleUpdateUser : handleSubmit}
							loader={isLoading}
						/>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default InviteMembersWorkspaceComponent;
