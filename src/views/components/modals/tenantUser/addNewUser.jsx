import React, { Component } from 'react';
import { ReactComponent as LockIcon } from '../../../../assets/svg/workspaceSettings/lock-big.svg';
import { ReactComponent as CheckIcon } from '../../../../assets/svg/workspaceSettings/checkmark-green.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/workspaceSettings/plus-button.svg';
import { ReactComponent as PreviousIcon } from '../../../../assets/svg/workspaceSettings/back3.svg';
import { ReactComponent as Shield } from '../../../../assets/svg/workspaceSettings/shield-gray.svg';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as DoubleCheckIcon } from '../../../../assets/svg/workspaceSettings/double-check-green.svg';
import { ReactComponent as SingleCheckIcon } from '../../../../assets/svg/workspaceSettings/single-check-green.svg';
import { ReactComponent as NoAccessIcon } from '../../../../assets/svg/workspaceSettings/no-access-grey.svg';
import '../../../../assets/scss/workspaceSettings/userDetailsLayout.scss';
import Input from '../../../components/input/inputNew';
import ProjectController from '../../../../controllers/projects';
import validator from 'validator';
// import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';

class AddNewUserModal extends ProjectController {
	constructor(props) {
		super(props);
		this.state = {
			emailID: props.email,
			emailIDError: false,
			emailIDErrorMessage: '',
			isSubmitting: false,
			selectedcategoryOption: { value: 'member', label: 'Member' },
			roleCategory: 'member',
			isGalleryEnabled: true,
			isProposalEnabled: true,
			isFormEnabled: true,
			hasGalleryFullAccess: true,
			hasProposalFullAccess: true,
			hasFormFullAccess: true,
			showGalleryDropdown: false,
			showProposalDropdown: false,
			showFormDropdown: false,
			isAdmin: props.isAdmin,
			isOwner: props.isOwner,
			isAdminSet: true,
			showUserRoleDropdown: false,
			subscriptionDetails: {},
			tenantTempUserRole: props.role === 'admin' ? 'admin' : 'default',
			isSubscriptionDetailsLoading: true,
			isAccessControlSet: false,
			sentInviteStep: props.step,
			tenantUser: [],
			activeUserId: '',
			isTenantInvitedLoading: true,
			accessInfoDesc: {
				project: [
					`This member won't see the project module but can access other parts of the workspace they're allowed to use.`,
					`This allows them to use the projects module. However, they'll only see projects they're part of or ones they create. They won't see all the projects unless they're added to them`,
					`With this setting enabled, they can freely access all projects in the workspace, even if they haven't been added to them individually.`,
				],
				gallery: [
					`This member won't see the gallery module but can access other parts of the workspace they're allowed to use.`,
					` This allows them to use the gallery module. However, they'll only see galleries they're part of or ones they create. They won't see all the galleries unless they're added to them.`,
					`With this setting enabled, they can freely access all galleries in the workspace, even if they haven't been added to them individually.`,
				],
				proposal: [
					`This member won't see the proposal module but can access other parts of the workspace they're allowed to use.`,
					`This allows them to use the proposal module. But they'll only see the proposals they create. They can use all templates, but can't edit the ones they didn't create.`,
					` With this setting enabled, they can freely access all proposals and templates in the workspace.`,
				],
				form: [
					`This member won't see the form section but can access other parts of the workspace they're allowed to use.`,
					`This allows them to use the forms module. However, they'll only view forms they create.`,
					`With this setting enabled, they can freely access all forms in the workspace, even if they haven't created them.`,
				],
			},
		};
	}
	categoryoptions = [
		{ value: 'member', label: 'Member', color: '#f9f9f9' },
		{ value: 'admin', label: 'Admin', color: '#f9f9f9' },
	];
	componentDidMount = async () => {
		await this.getTenantSubscriptionDetails();
		let getUsersFilters = {
			page: 1,
			limit: 1000,
		};
		await this.getTeamMembersList(getUsersFilters, null);
		await this.getInvitedTeamMembersList(getUsersFilters, true);
	};
	componentDidUpdate = (prevProps, prevState) => {
		if (
			this.state.isSubscriptionDetailsLoading === false &&
			this.state.isAccessControlSet === false
		) {
			let accessControls = _.map(
				_.uniq(this.state.subscriptionDetails.apps),
				(appName, key) => {
					return { app: appName, isEnabled: true, hasFullAccess: true };
				},
			);

			this.setState({ accessControls, isAccessControlSet: true });
		}
	};

	validateInput = (e) => {
		let errorName = e.target.name + 'Error';
		let errorMessage = e.target.name + 'ErrorMessage';

		if (e.target.value === '') {
			this.setState({
				[e.target.name]: e.target.value,
				[errorName]: true,
				[errorMessage]: 'Required Field!',
				errorMessage: '',
			});
		} else {
			this.setState({
				[e.target.name]: e.target.value,
				[errorName]: false,
				[errorMessage]: '',
				errorMessage: '',
			});
		}
	};

	handleOnBlurEmail = (e) => {
		let errorName = e.target.name + 'Error';
		let errorMessage = e.target.name + 'ErrorMessage';

		var isEmailValid = validator.isEmail(e.target.value.trim());
		if (!isEmailValid) {
			this.setState({
				[e.target.name]: e.target.value,
				[errorName]: true,
				[errorMessage]: 'Please enter correct email',
				errorMessage: '',
			});
		}
	};

	validateAddTenantUser = async () => {
		this.setState({ isSubmitting: true });

		let accessControls;
		if (
			_.size(this.state.accessControls) ===
			_.size(_.uniq(this.state.subscriptionDetails.apps))
		) {
			accessControls = this.state.accessControls;
		} else {
			let missedApp = _.uniq(this.state.subscriptionDetails.apps).filter(
				(x) => !_.map(this.state.accessControls, (access) => access.app).includes(x),
			);

			accessControls = _.map(missedApp, (app) => {
				return { app: app, isEnabled: false, hasFullAccess: false };
			});

			accessControls = [...this.state.accessControls, ...accessControls];
		}

		let json = {
			email: this.state.emailID.toLowerCase().trim(),
			role: this.state.tenantTempUserRole,
			accessControls,
		};
		this.props.addTenant(json);
	};

	handlecategoryChange = (selectedcategoryOption) => {
		this.setState({ selectedcategoryOption, roleCategory: selectedcategoryOption.value });
	};

	handleChangeUserRole = (type) => {
		this.setState({
			tenantTempUserRole: type,
		});
	};

	handleChangeProjectFinanceAccess = (type, isEnabled, hasFullAccess, hasFinanceAccess) => {
		let policy = [{ app: type, isEnabled, hasFullAccess, hasFinanceAccess }];

		let accessControls = _.remove(this.state.accessControls, function (access) {
			return access.app != type;
		});

		let updatedAccessControls;

		updatedAccessControls = [...accessControls, ...policy];

		this.setState({ accessControls: updatedAccessControls });
	};
	handleChangeEnableAccess = (type, isEnabled, hasFullAccess) => {
		let policy = [{ app: type, isEnabled, hasFullAccess }];
		let missedApp =
			_.size(this.state.accessControls) ===
			_.size(_.uniq(this.state.subscriptionDetails.apps))
				? ''
				: _.uniq(this.state.subscriptionDetails.apps).filter(
						(x) =>
							!_.map(this.state.accessControls, (access) => access.app).includes(x),
				  )[0];
		let missedAppAccess =
			missedApp === '' ? [] : [{ app: missedApp, isEnabled: false, hasFullAccess: false }];
		let accessControls = _.remove(this.state.accessControls, function (access) {
			return access.app != type;
		});

		let updatedAccessControls = [...accessControls, ...policy, ...missedAppAccess];
		this.setState({ accessControls: updatedAccessControls });
	};

	handleChangeAccess = (type, val) => {
		let accessControls = _.map(this.state.accessControls, (access, key) => {
			if (access.app === type) {
				return {
					...access,
					hasFullAccess: val,
				};
			} else return access;
		});

		this.setState({ accessControls, errorMessage: '' });
	};

	InviteNewUser = async () => {
		this.props.close();
		const payload = {
			email: this.state.emailID,
			role: 'admin',
			accessControls: [
				{
					app: 'form',
					isEnabled: true,
					hasFullAccess: true,
				},
				{
					app: 'project',
					isEnabled: true,
					hasFullAccess: true,
					hasFinanceAccess: false,
				},
				{
					app: 'proposal',
					isEnabled: true,
					hasFullAccess: true,
				},
				{
					app: 'gallery',
					isEnabled: true,
					hasFullAccess: true,
				},
			],
		};

		await this.inviteNewUser(payload);
		this.getTeamMembers('users');
	};

	renderAccessControls = () => {
		return (
			<div style={{ height: '85vh', overflow: 'auto', maxHeight: '1169px' }}>
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: '#111111',
						borderTopRightRadius: '40px',
						borderTopLeftRadius: '40px',
						padding: '2rem 2rem 0 2rem',
						maxWidth: '720px',
					}}
				>
					<div style={{ display: 'flex', gap: '20px' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
								justifyContent: 'center',
							}}
						>
							<div
								style={{
									fontSize: '16px',
									fontStyle: 'Inter',
									color: '#e4e5e6',
								}}
							>
								Invite Member to Workspace
							</div>
							<div
								style={{
									fontSize: '13px',
									fontStyle: 'Inter',
									color: '#a6a6a6',
								}}
							>
								Members you invite will have full access to your workspace unless
								you customise user roles according to your needs.
							</div>
						</div>
					</div>
					<span
						style={{ cursor: 'pointer' }}
						onClick={async () => {
							this.props.close();
							await this.getTeamMembers('users');
						}}
					>
						<CrossIcon />
					</span>
				</div>
				<div
					className="profile-role-wrapper"
					style={{
						backgroundColor: '#111111',
						padding: '2rem 2rem 0 2rem',
						maxWidth: '720px',
						width: '100%',
					}}
				>
					<div className="profile-role-container">
						<div className="profile-left-header-container">
							<div className="profile-role-header-title">Role</div>
						</div>
						{this.state.tenantUserIsOwner === true ? (
							<div className="right-profile-role-admin-container">SUPER ADMIN</div>
						) : this.state.tenantTempUserRole === 'admin' &&
						  this.state.isOwner == false ? (
							<div className="right-profile-role-admin-container">ADMIN</div>
						) : this.state.isOwner === true ? (
							<div className="right-profile-role-toggle-container">
								<div className="forground-text-container">
									<span
										className={
											this.state.tenantTempUserRole === 'admin'
												? 'role-text active'
												: 'role-text'
										}
										onClick={() => {
											this.handleChangeUserRole('admin');
										}}
									>
										ADMIN
									</span>
									{/* <span
										className={
											this.state.tenantTempUserRole !== 'admin'
												? 'role-text active'
												: 'role-text'
										}
										onClick={() => {
											this.handleChangeUserRole('default');
										}}
									>
										MEMBER
									</span> */}
								</div>
								<div
									className={
										this.state.tenantTempUserRole !== 'admin'
											? 'active-button-bg active-button-bg-active'
											: 'active-button-bg'
									}
								></div>
							</div>
						) : (
							<div className="right-profile-role-admin-container">MEMBER</div>
						)}
					</div>
					{this.state.tenantUserIsOwner === true ? null : (
						<div className="profile-role-desc-text">
							{this.state.tenantTempUserRole === 'admin' &&
							this.state.isOwner == false
								? 'Only a super admin can change the role'
								: ''}
						</div>
					)}
					<div
						style={{
							height: '1px',
							backgroundColor: '#2827287A',
							margin: '40px 0 0 0',
						}}
					/>
				</div>
				{this.state.tenantUserIsOwner === true ||
				this.state.tenantTempUserRole === 'admin' ? (
					<div
						className="access-permissions-container"
						style={{
							backgroundColor: '#111111',
							padding: '2rem 2rem 2rem 2rem',
							maxWidth: '720px',
							width: '100%',
						}}
					>
						<div className="access-control-info">
							<Shield />
							{this.state.accessInfoDesc['project'][0]}
						</div>
					</div>
				) : (
					<div
						className="access-permissions-container"
						style={{
							backgroundColor: '#111111',
							padding: '40px 2rem 2rem 2rem',
							maxWidth: '720px',
							width: '100%',
						}}
					>
						<div className="access-permissions-wrapper">
							<div className="upper-title-desc-container">
								{/* <div className="access-desc-details">
									{this.state.tenantTempUserRole === 'default' ? 'Cannot' : 'Can'}{' '}
									invite new members to this workspace <br />
									{this.state.tenantTempUserRole === 'default'
										? 'Cannot'
										: 'Can'}{' '}
									change roles and permissions of other members in this workspace
									<br />
									{_.map(
										_.uniq(this.state.subscriptionDetails.apps),
										(appName, key) => {
											let filterData = _.filter(this.state.accessControls, {
												app: appName,
											});
											let userAppAccess =
												_.size(filterData) > 0
													? filterData[0]
													: {
															app: appName,
															isEnabled: false,
															hasFullAccess: false,
													  };
											return userAppAccess['hasFullAccess'] === true &&
												userAppAccess['isEnabled'] === true ? (
												<>
													Has complete access to all {appName}
													<br />
												</>
											) : userAppAccess['isEnabled'] === true &&
											  userAppAccess['hasFullAccess'] === false ? (
												<>
													Has complete access to all {appName} Can create
													new
													{appName} in this workspace <br />
													Can see, edit, send and delete all {appName} in
													this work space
												</>
											) : (
												`Doesn’t have access to ${appName}`
											);
										},
									)}
								</div> */}
							</div>
							<div
								className="lower-access-permission-container"
								style={{ height: 'fit-content' }}
							>
								{/* <div className="permission-header-container">
									<div className="permission-header-wrapper">
										<span className="permission-header-title">FEATURE</span>
										<span className="permission-header-title">
											ACCESS LEVEL
										</span>
									</div>
								</div> */}
								{_.map(
									_.uniq(this.state.subscriptionDetails.apps),
									(appName, key) => {
										let filterData = _.filter(this.state.accessControls, {
											app: appName,
										});
										let userAppAccess =
											_.size(filterData) > 0
												? filterData[0]
												: {
														app: appName,
														isEnabled: false,
														hasFullAccess: false,
												  };

										return (
											<div className="permission-item-row-container">
												<div className="left-permission-item-wrapper">
													<span className="left-permission-item-text">
														{appName === 'form'
															? 'Forms'
															: appName === 'proposal'
															? 'Proposals'
															: appName === 'project'
															? 'Projects'
															: appName === 'gallery'
															? 'Galleries'
															: ''}
													</span>
												</div>
												<div className="right-permission-item-container">
													<div className="middle-permission-item-container">
														<div
															className={
																userAppAccess['isEnabled'] === false
																	? 'permission-toggle-btn btn-none'
																	: userAppAccess['isEnabled'] ===
																			true &&
																	  userAppAccess[
																			'hasFullAccess'
																	  ] === false
																	? 'permission-toggle-btn permission-toggle-btn-limited'
																	: 'permission-toggle-btn permission-toggle-btn-full'
															}
														></div>
														<div className="permission-toggle-text-container">
															<span
																className={
																	userAppAccess['isEnabled'] ===
																	false
																		? 'permission-toggle-text-item permission-toggle-text-item-active'
																		: 'permission-toggle-text-item'
																}
																onClick={async () => {
																	appName === 'project'
																		? await this.handleChangeEnableAccess(
																				appName,
																				false,
																				false,
																				false,
																		  )
																		: await this.handleChangeEnableAccess(
																				appName,
																				false,
																				false,
																		  );
																}}
															>
																<NoAccessIcon />
																<b>NO Access</b>
															</span>
															<span
																className={
																	userAppAccess['isEnabled'] ===
																		true &&
																	userAppAccess[
																		'hasFullAccess'
																	] === false
																		? 'permission-toggle-text-item permission-toggle-text-item-active'
																		: 'permission-toggle-text-item'
																}
																onClick={async () => {
																	appName === 'project'
																		? await this.handleChangeEnableAccess(
																				appName,
																				true,
																				false,
																				_.has(
																					userAppAccess,
																					'hasFinanceAccess',
																				) &&
																					userAppAccess.hasFinanceAccess ==
																						true
																					? true
																					: false,
																		  )
																		: await this.handleChangeEnableAccess(
																				appName,
																				true,
																				false,
																		  );
																}}
															>
																<SingleCheckIcon />
																<b>LIMITED</b>
															</span>
															<span
																className={
																	userAppAccess['isEnabled'] ===
																		true &&
																	userAppAccess[
																		'hasFullAccess'
																	] === true
																		? 'permission-toggle-text-item permission-toggle-text-item-active'
																		: 'permission-toggle-text-item'
																}
																onClick={async () => {
																	appName === 'project'
																		? await this.handleChangeEnableAccess(
																				appName,
																				true,
																				true,
																				_.has(
																					userAppAccess,
																					'hasFinanceAccess',
																				) &&
																					userAppAccess.hasFinanceAccess ==
																						true
																					? true
																					: false,
																		  )
																		: await this.handleChangeEnableAccess(
																				appName,
																				true,
																				true,
																		  );
																}}
															>
																<DoubleCheckIcon />
																<b>FULL ACCESS</b>
															</span>
														</div>
													</div>
													{userAppAccess['isEnabled'] === false ? (
														<div className="access-control-info">
															<NoAccessIcon />
															{this.state.accessInfoDesc[appName][0]}
														</div>
													) : (
														<div className="access-control-info">
															{userAppAccess['isEnabled'] === true &&
															userAppAccess['hasFullAccess'] ===
																true ? (
																<DoubleCheckIcon />
															) : (
																<SingleCheckIcon />
															)}
															{
																this.state.accessInfoDesc[appName][
																	userAppAccess['isEnabled'] ===
																		true &&
																	userAppAccess[
																		'hasFullAccess'
																	] === true
																		? 2
																		: 1
																]
															}
														</div>
													)}
													{appName === 'project' ? (
														<div
															className="edit-extra-permission-container"
															style={{ cursor: 'cross', width: 306 }}
														>
															<div
																className={
																	_.has(
																		userAppAccess,
																		'hasFinanceAccess',
																	) &&
																	userAppAccess.hasFinanceAccess ==
																		false
																		? 'f-toggle-button-container '
																		: 'f-toggle-button-container active'
																}
																style={{ marginBottom: 0 }}
																onClick={() => {
																	let financeAccess =
																		_.has(
																			userAppAccess,
																			'hasFinanceAccess',
																		) &&
																		userAppAccess.hasFinanceAccess ==
																			true
																			? false
																			: true;
																	this.handleChangeProjectFinanceAccess(
																		appName,
																		userAppAccess.isEnabled,
																		userAppAccess.hasFullAccess,
																		financeAccess,
																	);
																}}
															>
																<div className="toggle-button"></div>
															</div>
															<div className="edit-extra-template-container">
																<span className="extra-edit-text">
																	{'Show Finances'}
																</span>
															</div>
															{/* {appName === 'proposal' ? (
																<div
																	className={
																		userAppAccess[
																			'isEnabled'
																		] === true &&
																		appName === 'proposal'
																			? 'extra-edit-toggle-container'
																			: 'extra-edit-toggle-container active'
																	}
																	style={{
																		cursor: 'not-allowed',
																	}}
																>
																	<span className="extra-edit-toggle-head"></span>
																</div>
															) : ( */}
														</div>
													) : (
														''
													)}
												</div>
											</div>
										);
									},
								)}
							</div>
						</div>
					</div>
				)}
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						padding: '0 24px 24px 24px',
						width: '100%',
						backgroundColor: '#111111',
						borderBottomRightRadius: '40px',
						borderBottomLeftRadius: '40px',
						// padding: '0 2rem 2rem 2rem',
						maxWidth: '720px',
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
								// marginTop: '1rem',
								// display: 'inline-block',
								fontSize: '13px',
								fontFamily: 'Inter',
								textAlign: 'center',
							}}
							onClick={this.InviteNewUser}
						>
							<div>
								<span>Save Changes</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	validateEmail = () => {
		if (this.state.emailID === null || this.state.emailID === '') {
			this.setState({
				emailIDError: true,
				emailIDErrorMessage: 'Required Field!',
			});
		} else if (!validator.isEmail(this.state.emailID)) {
			this.setState({
				emailIDError: true,
				emailIDErrorMessage: 'Please enter correct email',
			});
		} else {
			this.setState({
				emailIDError: false,
				emailIDErrorMessage: '',
			});
		}
		let isExisting = undefined;
		let userType = '';
		let userId = '';
		let emailID = this.state.emailID;
		console.log(this.state.tenantUser);
		let isUserExisting = _.find(this.state.tenantUser, function (o) {
			return (
				(o.email && o.email === emailID) || (o.inviteeEmail && o.inviteeEmail === emailID)
			);
		});
		console.log(isUserExisting);
		if (_.size(isUserExisting) > 0) {
			console.log(isUserExisting);
			userId = isUserExisting._id;
			userType = isUserExisting.email ? 'active' : 'invited';
			isExisting = true;
		} else {
			isExisting = false;
		}
		if (
			this.state.emailID !== null &&
			this.state.emailID !== '' &&
			validator.isEmail(this.state.emailID) &&
			!isExisting
		) {
			this.setState({
				sentInviteStep: 2,
			});
		} else if (
			this.state.emailID !== null &&
			this.state.emailID !== '' &&
			validator.isEmail(this.state.emailID) &&
			isExisting === true &&
			userType === 'active'
		) {
			this.setState({
				activeUserId: userId,
				sentInviteStep: 3,
			});
		} else if (
			this.state.emailID !== null &&
			this.state.emailID !== '' &&
			validator.isEmail(this.state.emailID) &&
			isExisting === true &&
			userType === 'invited'
		) {
			this.setState({
				activeUserId: userId,
				sentInviteStep: 4,
			});
		}
	};
	renderSendInivteEmail = () => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#383838',
					padding: '24px',
					borderRadius: '12px',
				}}
			>
				<div className="send-invite-msg">
					<p>Invite Member to Workspace</p>
					<span>
						Members you invite will have full access to your workspace unless you
						customise user roles according to your needs.
					</span>
				</div>
				<div className={'form-InputContainer'} style={{ marginBottom: '27px' }}>
					<Input
						placeholder={'email@domain.com'}
						type={'text'}
						name={'emailID'}
						onChange={(e) => this.validateInput(e)}
						value={this.state.emailID}
						isInputError={this.state.emailIDError}
						errorMessage={this.state.emailIDErrorMessage}
						width={'100%'}
						onBlur={(e) => this.handleOnBlurEmail(e)}
					/>
				</div>

				<div
					style={{ marginTop: '10px', position: 'relative' }}
					className={'form-button-container'}
				>
					<p style={{ fontSize: '10px', clear: 'both', color: 'red' }}>
						{this.state.errorMessage}
					</p>
				</div>
				<div className={'modal_foooter'}>
					<div className={'next_button'} onClick={() => this.validateEmail()}>
						<span>Next</span>
						<span className="next-back-icon">
							<PreviousIcon />
						</span>
					</div>
				</div>
			</div>
		);
	};

	// goToTeamDetails = () => {
	// 	this.props.history.push(
	// 		`/${this.props.match.params.workspaceID}/users/${this.state.activeUserId}/basic-details`,
	// 	);
	// };

	renderActiveUser = () => {
		return (
			<div
				style={{
					marginTop: '0px',
					backgroundColor: '#383838',
					padding: '24px',
					borderRadius: '12px',
				}}
				className="userDetailsContainer"
			>
				<div
					style={{ width: '100%', marginBottom: '45px' }}
					className="accessControlsContainer"
				>
					<div className="active-invited-user-container" style={{ color: '#fff' }}>
						<b>{this.state.emailID + ' '}</b> is already added to your workspace as a
						Member.
					</div>
				</div>
				<div className={'modal_foooter'}>
					<div
						className={'back_button'}
						onClick={() => this.setState({ sentInviteStep: 1 })}
					>
						<span className="next-back-icon">
							<PreviousIcon />
						</span>
						<span>Back</span>
					</div>
					{/* <div
						className={'next_button send_invite_button'}
						onClick={this.goToTeamDetails}
					>
						<span
							style={{
								height: '24px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							View Member
						</span>
					</div> */}
				</div>
			</div>
		);
	};

	handleResendInvite = async () => {
		await this.resendTenantInvite(this.state.activeUserId);
		this.props.close();
	};

	renderInvitedUser = () => {
		return (
			<div style={{ marginTop: '0px' }} className="userDetailsContainer">
				<div
					style={{ width: '100%', marginBottom: '45px' }}
					className="accessControlsContainer"
				>
					<div className="active-invited-user-container">
						<b>{this.state.emailID + ' '}</b> is already invited to your workspace as a
						Member.
					</div>
				</div>
				<div className={'modal_foooter'}>
					<div
						className={'back_button'}
						onClick={() => this.setState({ sentInviteStep: 1 })}
					>
						<span className="next-back-icon">
							<PreviousIcon />
						</span>
						<span>Back</span>
					</div>
					<div
						className={'next_button send_invite_button'}
						onClick={() => this.handleResendInvite()}
					>
						<span className="next-back-icon">
							<PlusIcon />
						</span>
						<span>Resend Invite</span>
					</div>
				</div>
			</div>
		);
	};

	render() {
		return (
			<>
				{this.state.isLoading || this.state.isTenantInvitedLoading ? (
					<Skeleton width={800} height={240} />
				) : (
					<React.Fragment>
						{this.props.isAdmin === true ? (
							<div
								style={{
									//maxHeight: '600px',
									overflowY: 'overlay',
								}}
								className={'invite-container'}
							>
								{/* <div className={'fHeader proposalleadHeader'}>
							{this.state.sentInviteStep == 1 ? (
								'Send invite'
							) : (
								<>
									SEND INVITE TO<b>{' ' + this.state.emailID}</b>
								</>
							)}
							{_.has(this.props, 'isPage') && this.props.isPage ? (
								''
							) : (
								<span onClick={(e) => this.props.close(e)}>
									<Close />
								</span>
							)}
						</div> */}

								<div className="profile-setting-outer-container new-wrapper">
									{this.state.sentInviteStep == 1
										? this.renderSendInivteEmail()
										: this.state.sentInviteStep == 3
										? this.renderActiveUser()
										: this.state.sentInviteStep == 4
										? this.renderInvitedUser()
										: this.state.sentInviteStep == 2
										? this.renderAccessControls()
										: null}

									{/* <div className={'form-InputContainer'}>
							<a>Role</a>
							<Select
								isSearchable={false}
								onChange={this.handlecategoryChange}
								options={this.categoryoptions}
								defaultValue={this.categoryoptions[0]}
							/>
						</div> */}
									{/* {this.renderAccessControls()} */}
									{/* <div
								style={{ marginTop: '10px', position: 'relative' }}
								className={'form-button-container'}
							>
								<Button
									isLoading={this.state.isSubmitting}
									onClick={() => this.validateAddTenantUser()}
									classname={`form-button ${
										this.state.emailID === ''
											? 'form-button-backgroundcolor'
											: ''
									}`}
									name={'Send Invitation'}
								/>
							</div> */}
									<div
										style={{ marginTop: '10px', position: 'relative' }}
										className={'form-button-container'}
									>
										<p
											style={{
												fontSize: '10px',
												clear: 'both',
												color: 'red',
											}}
										>
											{this.state.errorMessage}
										</p>
									</div>
								</div>
							</div>
						) : (
							<div className={'new-no-access-modal-container'}>
								<div className="inner-no-access-wrapper">
									<div className="lock-icon">
										<LockIcon />
									</div>
									<div className="middle-title-desc-no-access">
										<div className="no-access-title">
											This action is not allowed
										</div>
										<div className="no-access-desc">
											You do not have the necessary access to perform this
											action. Please contact your account admin
										</div>
									</div>
									<div
										className="bottom-btn-no-access-okay"
										onClick={(e) => this.props.close(e)}
									>
										<span className="okay-icon">
											<CheckIcon />
										</span>
										<span className="okay-text">Okay</span>
									</div>
								</div>
							</div>
						)}
					</React.Fragment>
				)}
			</>
		);
	}
}

export default AddNewUserModal;
