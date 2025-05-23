import React, { useState, useEffect, useContext } from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/close.svg';
import Context from '../../../../context/context';
import '../../../../assets/scss/settings/teamMembers.scss';
import ReusableButtonSettings from '../ReusableButtonSettings';
import ReactModal from '../../modalsV2';
import { Checkbox, Tooltip } from 'antd';
import { message } from '../../globalComponents/CustomToast';

const appsWithAccessLevels = [
	'note',
	'classicGallery',
	'task',
	'calendar',
	'liteGallery',
	'knowledgeAgent',
];
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
	isSubmitLoading,
	handleAccessTypeChange,
}) => {
	const {
		companyInfo: { updateTenantAccessControls, updateTenantRole, getTeamMembers },
	} = useContext(Context);

	const [updatedData, setUpdatedData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const updateData = async () => {
			if (updatedData) {
				try {
					setIsLoading(true);

					if (selectedUser !== selectedOption) {
						const json = {
							role: selectedOption,
						};
						const roleUpdateRes = await updateTenantRole(selectedUser?._id, json);
						if (roleUpdateRes[0] === true) {
							const accessControlRes = await updateTenantAccessControls(
								updatedData,
								selectedUser?._id,
							);
							if (accessControlRes[0] === true) {
								message.success(accessControlRes[1]?.message);
								getTeamMembers();
								closeModal();
							} else {
								message.error(accessControlRes[1]?.message);
								closeModal();
							}
						}
					} else {
						const accessControlRes = await updateTenantAccessControls(
							updatedData,
							tenantUserId,
						);
						if (accessControlRes[0] === true) {
							message.success(accessControlRes[1]?.message);
							closeModal();
							getTeamMembers();
						} else {
							message.error(accessControlRes[1]?.message);
							closeModal();
						}
					}
				} catch (error) {
					message.error('An error occurred while updating.');
					closeModal();
				} finally {
					setIsLoading(false);
				}
			}
		};

		updateData();
	}, [updatedData]);

	const filterFunction = (options) => {
		return options?.filter((option) => {
			return !['project', 'proposal', 'gallery', 'folder'].includes(option?.app);
		});
	};
	// ... existing code ...
	const handleUpdateUser = () => {
		if (isLoading) {
			return;
		} else {
			const filteredAccessControls = filterFunction(accessControls?.accessControls);
			// New logic to only include changed options
			setUpdatedData({
				accessControls: filteredAccessControls,
			});
		}
	};
	// ... existing code ...

	const customStyles = {
		content: { zIndex: 999 },
		overlay: { zIndex: 9999 },
	};
	// const handleAccessTypeChange = (app, isFullAccess) => {
	// 	setAccessControls((prevState) => {
	// 		const updatedAccessControls = prevState?.accessControls?.map((control) =>
	// 			control?.app === app ? { ...control, hasFullAccess: isFullAccess } : control,
	// 		);

	// 		return { ...prevState, accessControls: updatedAccessControls };
	// 	});
	// };

	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal} customStyles={customStyles}>
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
										placeholder="Email"
										name="email"
										onChange={(e) => handleChnage(e, index)}
										value={userEmail}
										autoComplete="off"
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
										fontFamily: 'var(--primary-font-family)',
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
										fontFamily: 'var(--primary-font-family)',
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
								{filterFunction(selectableOptions)?.map((option) => {
									const control = accessControls?.accessControls?.find(
										(c) => c.app === option?.app,
									);
									const isChecked = control?.isEnabled || false;
									const accessLevel = control?.hasFullAccess ? 'full' : 'limited';
									const shouldShowAccessLevels = appsWithAccessLevels.includes(
										option.app,
									);
									return (
										<div className="accessControlOption" key={option?.app}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '10px',
												}}
											>
												<Checkbox
													checked={isChecked}
													onChange={(e) =>
														handleCheckboxChange(
															option?.app,
															e.target.checked,
														)
													}
												/>
												<div className="accessControlOptionText">
													{option?.app}
												</div>
											</div>
											{/* Show Full/Limited checkboxes if enabled */}
											{isChecked && shouldShowAccessLevels && (
												<div className="accessLevelOptions">
													<label className="accessControlOptionText">
														<Checkbox
															checked={accessLevel === 'full'}
															onChange={() =>
																handleAccessTypeChange(
																	option?.app,
																	'full',
																)
															}
														/>
														Full Access
													</label>
													<label
														style={{
															width: '165px',
														}}
														className="accessControlOptionText"
													>
														<Checkbox
															checked={accessLevel === 'limited'}
															onChange={() =>
																handleAccessTypeChange(
																	option?.app,
																	'limited',
																)
															}
														/>
														Limited Access
													</label>
												</div>
											)}
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
							loader={isLoading || isSubmitLoading}
						/>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default InviteMembersWorkspaceComponent;
