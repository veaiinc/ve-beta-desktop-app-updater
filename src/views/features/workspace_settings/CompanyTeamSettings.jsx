import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
// import { withRouter } from 'react-router-dom';

import { ReactComponent as DoubleCheckIcon } from '../../../assets/svg/workspaceSettings/double-check-green.svg';
import { ReactComponent as NoAccessIcon } from '../../../assets/svg/workspaceSettings/no-access-grey.svg';
import { ReactComponent as SingleCheckIcon } from '../../../assets/svg/workspaceSettings/single-check-green.svg';
import { ReactComponent as Shield } from '../../../assets/svg/workspaceSettings/shield-gray.svg';
import ProjectController from '../../../controllers/projects';
import Modal from '../../components/modals';
import AddTenantUserModal from '../../components/modals/tenantUser/addNewUser';
import DeleteTenantUserModal from '../../components/modals/tenantUser/deleteTenantUserModal';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/workspaceSettings/searchSettings.svg';
import ReusableButtonSettings from './ReusableButtonSettings';
import validator from 'validator';

class CompanyTeamSettings extends ProjectController {
	constructor() {
		super();
		this.state = {
			accessControls: [],
			isTenantDetailsLoading: true,
			originalAccessControls: [],
			workspaceList: {},
			isWorkSpaceListLoading: true,
			tenantUserIsOwner: false,
			tenantUserIsSuperHuemn: false,
			tenantUserRole: null,
			notificationPopup: false,
			showAddTenantUserModal: false,
			accessibleStates: [
				'Forms',
				'Proposals',
				'Projects',
				'Finance',
				'Team Member',
				'Gallery',
			],
			tenantUser: [],
			clicked: '',
			totalPages: 1,
			page: 1,
			limit: 30,
			hasNextPage: true,
			lengthOfList: 0,
			currentViewPage: 1,
			searchQuery: '',
			isPageLoading: false,
			selectedUserId: '',
			selectedUser: {},
			tenantTempUserRole: 'default',
			accessControlPopup: false,
			isRoleAdmin: false,
			galleryAccess: 'none',
			isEditTemplate: false,

			showDelete: false,
			isGalleryEnabled: true,
			isProposalEnabled: true,
			isFormEnabled: true,
			hasGalleryFullAccess: true,
			hasProposalFullAccess: true,
			hasFormFullAccess: true,
			showGalleryDropdown: false,
			showProposalDropdown: false,
			showFormDropdown: false,
			tenantUserEmail: '',
			tenantUserFirstName: '',
			tenantUserLastName: '',
			tenantUserIsOwner: false,
			accessControls: [],
			tenantUser: [],
			isAdmin: false,
			isAdminSet: false,
			isOwner: false,
			showUserRoleDropdown: false,
			subscriptionDetails: { apps: [] },
			isTenantDetailsLoading: true,
			isSubscriptionDetailsLoading: true,
			showDeleteInvite: false,
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
			selectedUserRole: '',
			emailIDError: null,
			emailIDErrorMessage: null,
			emailID: null,
			userRoleType: 'admin',
		};
		this.options = [
			{ value: 'admin', label: 'Admin' },
			{ value: 'default', label: 'Member' },
			{ value: 'removeMember', label: 'Remove Member' },
		];
		this.customStyles = {
			option: (defaultStyles, state) => ({
				// You can log the defaultStyles and state for inspection
				// You don't need to spread the defaultStyles
				...defaultStyles,
				color: '#fff',
			}),
			menu: (defaultStyles, state) => ({
				...defaultStyles,
				backgroundColor: '#1a1a1c',
			}),
			control: (defaultStyles) => ({
				...defaultStyles,
				// Notice how these are all CSS properties
				backgroundColor: 'transparent',
				padding: '2px',
				border: 'none',
				boxShadow: 'none',
				width: '10rem',
			}),
			singleValue: (defaultStyles) => ({ ...defaultStyles, color: '#fff' }),
		};
	}
	showAddTenantUserModal = (e) => {
		if (this.state.showAddTenantUserModal) {
			//while closing mkodal ,deleting search query coming from kbar
			let queryParams = new URLSearchParams(this.props?.location?.search);
			queryParams.delete('addTeamMember');
			// this.props.history.replace({
			// 	search: queryParams.toString(),
			// });
		}
		this.setState({
			showAddTenantUserModal: !this.state.showAddTenantUserModal,
		});
	};
	handleAddTenant = async (json) => {
		await this.submitAddTenantUser(json);
	};
	handleDelete = (type) => {
		if (type === 'team') {
			this.removeTenantUserFromTeam(this.state.selectedUserId).then(() =>
				this.fetchMoreProjects1(),
			);
			this.setState({
				showDelete: false,
			});
		}
	};
	fetchMoreProjects1 = async () => {
		this.setState({
			isLoading: true,
		});

		let shootsVariables;
		shootsVariables = {
			page: 1,
			limit: 15 * this.state.currentViewPage,
		};
		if (this.state.searchQuery.trim().length !== 0) {
			shootsVariables.search = this.state.searchQuery.trim();
		}
		if (this.state.mainFilter !== 'invitations pending') {
			await this.getTeamMembersList(shootsVariables, null);
		} else {
			delete shootsVariables.role;
			await this.getInvitedTeamMembersList(shootsVariables, null);
			this.setState({
				isLoading: false,
			});
		}
	};
	fetchMoreProjects = async () => {
		if (this.state.currentViewPage == 1) {
			this.setState({
				isLoading: true,
			});
		}
		let shootsVariables;
		shootsVariables = {
			page: this.state.currentViewPage,
			limit: 15,
		};
		if (this.state.searchQuery.trim().length !== 0) {
			shootsVariables.search = this.state.searchQuery.trim();
		}
		await this.getTeamMembersList(
			shootsVariables,
			this.state.currentViewPage == 1 ? null : 'add',
		);
	};
	componentDidMount = async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const paramValue = urlParams.get('addTeamMember');
		if (urlParams.get('addTeamMember') == 'true') {
			this.setState({
				showAddTenantUserModal: !this.state.showAddTenantUserModal,
			});
		}

		let usertoken = localStorage.getItem('usertoken');
		let decoded = jwt_decode(usertoken);
		let workspaceId = localStorage.getItem('workspaceId');
		if (localStorage.getItem(`userThemePref::${workspaceId}::${decoded.user_id}`)) {
			let currentTheme = localStorage.getItem(
				`userThemePref::${workspaceId}::${decoded.user_id}`,
			);
			this.setState({ currentTheme });
		}
		let isDarkTheme = false;
		isDarkTheme =
			localStorage.getItem(`userThemePref::${workspaceId}::${decoded.user_id}`) ===
			'theme-dark';

		let getWhatsNewInfoFromLocalStorage = localStorage.getItem('showTeamWhatsNew');

		if (getWhatsNewInfoFromLocalStorage) {
			if (getWhatsNewInfoFromLocalStorage === 'true') {
				this.setState({
					pageHasUpdateCard: true,
				});
			} else {
				this.setState({
					pageHasUpdateCard: false,
				});
			}
		} else {
			this.setState(
				{
					pageHasUpdateCard: true,
				},
				() => {
					localStorage.setItem('showTeamWhatsNew', true);
				},
			);
		}
		if (localStorage.getItem(`userRole::${workspaceId}::${decoded.user_id}`)) {
			let role = atob(localStorage.getItem(`userRole::${workspaceId}::${decoded.user_id}`));
			this.setState({
				isAdmin: role === 'admin' ? true : false,
			});
		}
		let queryParams = new URLSearchParams(this.props?.location?.search);
		let mainFilter = this.state.mainFilter;
		let currentViewPage = this.state.currentViewPage;
		let getUsersFilters = {};
		if (queryParams.has('filter') && queryParams.get('filter') !== 'all') {
			getUsersFilters.role = queryParams.get('filter') === 'admins' ? 'admin' : 'default';
			mainFilter = queryParams.get('filter');
		}
		if (queryParams.has('filters')) {
			let urlFilters = queryParams.get('filters');
			let decodedFilters = JSON.parse(urlFilters)[0];

			this.setFiltersFromURL(decodedFilters);
		}
		this.setState({ mainFilter });
		this.setState({
			isLoading: true,
		});
		await this.getTeamMembersFilters();
		await this.getUserDetails();
		this.setState({
			isLoading: false,
		});
		this.setState({ isLoading: false });
		await this.getTeamMembers('users');
		await this.getTenantSubscriptionDetails(workspaceId);
	};

	handleChangeEnableAccess = (type, isEnabled, hasFullAccess, hasFinanceAccess = null) => {
		let policy;
		if (type === 'project') {
			policy = [{ app: type, isEnabled, hasFullAccess, hasFinanceAccess }];
		} else {
			policy = [{ app: type, isEnabled, hasFullAccess }];
		}
		let missedAppAccess = [];
		if (
			_.size(_.uniq(this.state.subscriptionDetails.apps)) > _.size(this.state.accessControls)
		) {
			let missedApp =
				_.size(this.state.accessControls) ===
				_.size(_.uniq(this.state.subscriptionDetails.apps))
					? ''
					: _.uniq(this.state.subscriptionDetails.apps).filter(
							(x) =>
								!_.map(
									[...this.state.accessControls],
									(access) => access.app,
								).includes(x),
					  )[0];
			missedAppAccess =
				missedApp === ''
					? []
					: missedApp === 'project'
					? [
							{
								app: missedApp,
								isEnabled: false,
								hasFullAccess: false,
								hasFinanceAccess: false,
							},
					  ]
					: [{ app: missedApp, isEnabled: false, hasFullAccess: false }];
		}
		let accessControls = _.remove(this.state.accessControls, function (access) {
			return access.app != type;
		});

		let updatedAccessControls;
		if (
			_.size(_.uniq(this.state.subscriptionDetails.apps)) > _.size(this.state.accessControls)
		) {
			updatedAccessControls = [...accessControls, ...policy, ...missedAppAccess];
		} else {
			updatedAccessControls = [...accessControls, ...policy];
		}
		this.setState({ accessControls: updatedAccessControls });
		let json = {
			accessControls: updatedAccessControls,
		};
		this.updateTenantUserAccessControls(this.state.selectedUserId, json);
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

		this.setState({ accessControls });
	};

	handleChangeProjectFinanceAccess = (type, isEnabled, hasFullAccess, hasFinanceAccess) => {
		let policy = [{ app: type, isEnabled, hasFullAccess, hasFinanceAccess }];
		let accessControls = _.remove(this.state.accessControls, function (access) {
			return access.app != type;
		});
		let updatedAccessControls;
		updatedAccessControls = [...accessControls, ...policy];
		this.setState({ accessControls: updatedAccessControls });
		let json = {
			accessControls: updatedAccessControls,
		};
		this.updateTenantUserAccessControls(this.state.selectedUserId, json);
	};
	handleCancel = () => {
		this.setState({
			accessControls: this.state.originalAccessControls,
			tenantTempUserRole: this.state.tenantUserRole,
		});
	};
	handleChangeUserRole = (type) => {
		this.setState(
			{
				tenantTempUserRole: type,
			},
			async () => {
				await this.handleSaveChanges1(type);
			},
		);
	};

	handleSaveChanges1 = async (type) => {
		if (this.state.tenantTempUserRole !== this.state.tenantUserRole) {
			const response = await this.updateTenantUserRole(
				this.state.selectedUserId,
				this.state.tenantTempUserRole,
				false,
			);

			if (response) {
				if (type === 'admin') {
					await this.getTeamMembersList(
						{
							page: 1,
							limit: 15 * this.state.currentViewPage,
						},
						null,
					);
				}
			}
		}
	};

	handleResendInvite = () => {
		this.resendTenantInvite(this.state.selectedUserId);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (_.size(this.state.tenantUser) > 0 && this.state.isAdminSet === false) {
			_.map(this.state.tenantUser, (item) => {
				if (item._id === this.state.userId) {
					this.setState({
						isAdmin: item.role === 'admin' ? true : false,
						isOwner: item.isOwner,
						isAdminSet: true,
					});
				}
			});
		}
	};

	handleSaveChanges = async (type) => {
		if (this.state.tenantTempUserRole !== this.state.tenantUserRole) {
			await this.updateTenantUserRole(
				this.state.selectedUserId,
				this.state.tenantTempUserRole,
				false,
			);
			setTimeout(() => {
				this.fetchMoreProjects1();
			}, 0);
			// }
		} else {
			let json = {
				role: this.state.tenantTempUserRole,
				accessControls: this.state.accessControls,
			};
			await this.updateTenantInviteAccessControls(this.state.selectedUserId, json);
			setTimeout(() => {
				this.fetchMoreProjects1();
			}, 0);
		}
	};

	onChangeSearchQuery = (e) => {
		this.setState({ searchQuery: e, isPageLoading: true }, () => {
			clearTimeout(this.searchTimer);
			this.searchTimer = setTimeout(
				async () => {
					this.fetchMoreProjects();
				},
				e.trim().length === 0 ? 0 : 500,
			);
		});
	};

	getInitials(first, last) {
		const firstNameInitial = first ? first.charAt(0) : '-';
		const lastNameInitial = last ? last.charAt(0) : '';
		const initials = `${firstNameInitial.toUpperCase()}${lastNameInitial.toUpperCase()}`;
		return initials;
	}

	onChangeEmail = () => {
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
				sentInviteStep: this.state.userRoleType === 'admin' ? 1 : 3,
			});
			this.showAddTenantUserModal();
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

	renderAccessControls = () => {
		let hasFinanceAccessKey =
			_.size(_.filter(this.state.accessControls, { app: 'finance' })) > 0 ? true : false;
		let hasFinanceAccess;

		if (hasFinanceAccessKey == true) {
			hasFinanceAccess = _.filter(this.state.accessControls, { app: 'finance' })[0].isEnabled;
		} else {
			hasFinanceAccess = false;
		}

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
						<div>
							<div
								style={{
									width: '64px',
									height: '64px',
									borderRadius: '500px',
									border: '1px solid #c49e59',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									color: '#e4e5e6',
								}}
							>
								{this.getInitials(
									this.state.selectedUser?.firstName,
									this.state.selectedUser?.lastName,
								)}
							</div>
						</div>
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
									fontStyle: 'Inter SemiBold',
									color: '#e4e5e6',
								}}
							>
								{!this.state.selectedUser?.firstName &&
								!this.state.selectedUser?.lastName
									? 'No Name'
									: this.state.selectedUser?.firstName
									? this.state.selectedUser.firstName
									: '' + ' ' + this.state.selectedUser?.lastName
									? this.state.selectedUser.lastName
									: ''}
							</div>
							<div
								style={{
									fontSize: '13px',
									fontStyle: 'Inter',
									color: '#a6a6a6',
								}}
							>
								{this.state.selectedUser?.email
									? this.state.selectedUser?.email
									: ''}
							</div>
						</div>
					</div>
					<span
						style={{ cursor: 'pointer' }}
						onClick={async () => {
							this.setState({ accessControlPopup: false });
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
									<span
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
									</span>
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
							<div className="upper-title-desc-container"></div>
							<div
								className="lower-access-permission-container"
								style={{ height: 'fit-content' }}
							>
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
								fontSize: '13px',
								fontFamily: 'Inter Medium',
								textAlign: 'center',
							}}
							onClick={async () => {
								this.setState({ accessControlPopup: false });
								await this.getTeamMembers('users');
							}}
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

	render() {
		// let renderedWorkspaceID = this.props.location.pathname.split('/')[1];
		return (
			<>
				<div className="mainContainer1" style={{ overflow: 'scroll' }}>
					<div
						style={{
							position: 'relative',
							// marginTop: '5rem',
							marginBottom: '2rem',
							width: '100%',
						}}
					>
						<div
							style={{
								borderRadius: '40px',
								border: '1px solid #242424A3',
								padding: '40px',
								backgroundColor: '#151515',
								// maxWidth: '753px',
								maxHeight: '783px',
								height: '80vh',
								overflow: 'auto',
							}}
						>
							<div
								style={{
									fontFamily: 'Inter Medium',
									fontSize: '16px',
									color: '#e4e5e6',
									lineHeight: '24px',
									marginBottom: '40px',
								}}
							>
								Team Members
							</div>
							<div
								style={{
									height: '1px',
									backgroundColor: '#2827287A',
									margin: '0 0 24px 0',
								}}
							/>
							<div style={{ display: 'flex', gap: '10px' }}>
								<div
									style={{
										fontFamily: 'Inter Medium',
										fontSize: '16px',
										color: '#e4e5e6',
										marginBottom: '1rem',
									}}
								>
									Invite Members to Workspace
								</div>
							</div>
							<div
								style={{
									fontFamily: 'Inter',
									fontSize: '14px',
									color: '#707070',
									marginBottom: '1rem',
								}}
							>
								Members you invite will have full access to your workspace unless
								you customise user roles
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: '10px',
									width: '100%',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										marginBottom: '1rem',
										width: '75%',
										position: 'relative',
									}}
								>
									<input
										style={{
											borderRadius: '20px',
											border: '0.5px solid #333333',
											height: '36px',
											padding: '11px 14px 11px 14px',
											backgroundColor: '#151515',
											color: '#e4e5e6',
											fontSize: '12px',
											fontFamily: 'Inter',
											width: '100%',
										}}
										placeholder="Enter email"
										name="emailID"
										onChange={(e) => this.setState({ emailID: e.target.value })}
										value={this.state.emailID}
									/>
									<div
										class="custom-select"
										style={{
											marginTop: '5px',
											position: 'absolute',
											top: '0',
											right: '10px',
										}}
									>
										<select
											style={{
												fontFamily: 'Inter',
												fontSize: '13px',
												color: '#ffffff',
												backgroundColor: 'transparent',
												border: 'none',
												cursor: 'pointer',
											}}
											onChange={(e) =>
												this.setState({ userRoleType: e.target.value })
											}
										>
											<option value="admin">Admin</option>
											<option value="default">Member</option>
										</select>
									</div>
								</div>

								<div
									style={{
										marginBottom: '0.8rem',
										marginLeft: '0.5rem',
									}}
								>
									<ReusableButtonSettings
										text="Send Request"
										func={this.onChangeEmail}
									/>
								</div>
							</div>
							{this.state.emailIDError === true && this.state.emailIDErrorMessage ? (
								<div
									style={{
										color: 'crimson',
										fontSize: '11px',
										fontFamily: 'Inter',
									}}
								>
									{this.state.emailIDErrorMessage}
								</div>
							) : null}
							<div
								style={{
									height: '1px',
									backgroundColor: '#2827287A',
									margin: '24px 0 24px 0',
								}}
							/>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										fontFamily: 'Inter Medium',
										fontSize: '16px',
										color: '#e4e5e6',
										marginBottom: '1rem',
										marginTop: '1rem',
									}}
								>
									Your Team
								</div>
								<div
									style={{
										position: 'relative',
										width: '40%',
									}}
								>
									<span
										style={{
											position: 'absolute',
											top: '50%',
											left: '5%',
											transform: 'translateY(-50%)',
											color: '#666666',
											fontSize: '12px',
											fontFamily: 'Inter',
										}}
									>
										<Search />
									</span>
									<input
										style={{
											borderRadius: '20px',
											border: '1px solid #333333',
											height: '36px',
											width: '100%',
											padding: '11px 14px 11px 30px',
											backgroundColor: '#151515',
											color: '#666666',
											fontSize: '12px',
											fontFamily: 'Inter',
										}}
										placeholder="Search by name"
										onChange={(e) => this.onChangeSearchQuery(e.target.value)}
										value={this.state.searchQuery}
									/>
								</div>
							</div>
							{this.state.isLoading ? (
								[1, 1, 1, 1, 1].map((value, index) => (
									<div
										style={{
											display: 'flex',
											width: '100%',
											justifyContent: 'space-between',
											alignItems: 'center',
											margin: '1rem 0',
											gap: '10px',
										}}
										key={index}
									>
										<div style={{ display: 'flex', gap: '20px' }}>
											<div>
												<div
													style={{
														width: '64px',
														height: '64px',
														borderRadius: '500px',
														border: '1px solid #c49e59',
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														color: '#e4e5e6',
													}}
												>
													<Skeleton />
												</div>
											</div>
											<div
												style={{
													display: 'flex',
													flexDirection: 'column',
													gap: '10px',
													justifyContent: 'center',
													width: '150px',
												}}
											>
												<div
													style={{
														fontSize: '16px',
														fontStyle: 'Inter SemiBold',
														color: '#e4e5e6',
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													<Skeleton />
												</div>
												<div
													style={{
														fontSize: '13px',
														fontStyle: 'Inter',
														color: '#a6a6a6',
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													<Skeleton />
												</div>
											</div>
										</div>
										<div>
											<div
												class="custom-select"
												style={{ marginTop: '10px' }}
											>
												<div
													style={{
														display: 'flex',
														gap: '24px',
														alignItems: 'center',
														maxWidth: '190px',
													}}
												>
													<div
														style={{
															border: '1px solid #6055EC',
															color: '#6055EC',
															backgroundColor: '#151515',
															cursor: 'pointer',
															borderRadius: '20px',
															padding: '9px 12px',
															height: '40px',
															width: 'auto',
															display: 'inline-block',
														}}
													>
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '10px',
																fontSize: '14px',
																fontFamily: 'Inter',
															}}
														>
															<Skeleton />
														</div>
													</div>
													<div
														style={{
															color: '#e4e5e6',
															width: '54px',
															display: 'flex',
															justifyContent: 'flex-end',
														}}
													>
														<span
															style={{
																fontSize: '14px',
																fontFamily: 'Inter',
															}}
														>
															<Skeleton />
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div id="scrollableDiv" style={{ height: 450, overflow: 'auto' }}>
									<div>
										{[...this.state.tenantUser]
											.sort((a, b) => {
												if (a.role === 'admin' && b.role !== 'admin') {
													return -1;
												} else if (
													a.role !== 'admin' &&
													b.role === 'admin'
												) {
													return 1;
												} else {
													return 0;
												}
											})
											.map((user, index) => (
												<div
													style={{
														display: 'flex',
														width: '100%',
														justifyContent: 'space-between',
														alignItems: 'center',
														margin: '1rem 0',
														gap: '10px',
													}}
													key={user._id}
												>
													<div
														style={{
															display: 'flex',
															gap: '20px',
															flex: 1,
														}}
													>
														<div>
															<div
																style={{
																	width: '64px',
																	height: '64px',
																	borderRadius: '500px',
																	border: '1px solid #c49e59',
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																	color: '#e4e5e6',
																}}
															>
																{this.getInitials(
																	user?.firstName,
																	user?.lastName,
																)}
															</div>
														</div>
														<div
															style={{
																display: 'flex',
																flexDirection: 'column',
																gap: '10px',
																justifyContent: 'center',
																flex: 1,
															}}
														>
															<div
																style={{
																	fontSize: '16px',
																	fontStyle: 'Inter SemiBold',
																	color: '#e4e5e6',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																}}
															>
																{!user?.firstName && !user?.lastName
																	? 'No Name'
																	: user?.firstName
																	? user.firstName
																	: '' + ' ' + user?.lastName
																	? user.lastName
																	: ''}
															</div>
															<div
																style={{
																	fontSize: '13px',
																	fontStyle: 'Inter',
																	color: '#a6a6a6',
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis',
																}}
															>
																{user?.email ? user?.email : ''}
															</div>
														</div>
													</div>
													<div>
														<div
															class="custom-select"
															style={{ marginTop: '10px' }}
														>
															{user?.isOwner ? (
																<div
																	style={{
																		borderRadius: '4px',
																		backgroundColor: '#3F8AE2',
																		paddding:
																			'14px 12px 14px 12px',
																		width: '103px',
																		fontFamily:
																			'Inter SemiBold',
																		height: '30px',
																		display: 'flex',
																		justifyContent: 'center',
																		alignItems: 'center',
																		color: '#e4e5e6',
																		fontSize: '10px',
																	}}
																>
																	Owner
																</div>
															) : (
																<div
																	style={{
																		display: 'flex',
																		gap: '24px',
																		alignItems: 'center',
																		maxWidth: '190px',
																	}}
																>
																	<div
																		style={{
																			border: '1px solid #6055EC',
																			color: '#6055EC',
																			backgroundColor:
																				'#151515',
																			cursor: 'pointer',
																			borderRadius: '20px',
																			padding: '9px 12px',
																			height: '40px',
																			// marginTop: '1rem',
																			width: 'auto',
																			display: 'inline-block',
																		}}
																		onClick={(e) => {
																			if (
																				user.role ===
																				'admin'
																			) {
																				this.setState({
																					accessControlPopup: true,
																				});
																				this.setState({
																					selectedUserId:
																						user?._id,
																					selectedUser:
																						user,
																					tenantTempUserRole:
																						'admin',
																				});
																			} else if (
																				user.role ===
																				'default'
																			) {
																				this.setState({
																					accessControlPopup: true,
																				});
																				this.setState({
																					selectedUserId:
																						user?._id,
																					selectedUser:
																						user,
																					tenantTempUserRole:
																						'default',
																				});
																			}
																		}}
																	>
																		<div
																			style={{
																				display: 'flex',
																				alignItems:
																					'center',
																				gap: '10px',
																				fontSize: '14px',
																				fontFamily: 'Inter',
																			}}
																		>
																			Edit Access
																		</div>
																	</div>
																	<div
																		style={{
																			color: '#e4e5e6',
																			width: '54px',
																			display: 'flex',
																			justifyContent:
																				'flex-end',
																		}}
																	>
																		<span
																			style={{
																				fontSize: '14px',
																				fontFamily: 'Inter',
																			}}
																		>
																			{
																				this.options.find(
																					(option) =>
																						option.value ===
																						user.role,
																				)?.label
																			}
																		</span>
																	</div>
																</div>
															)}
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				{this.state.showDelete === true && this.state.selectedUserRole !== 'admin' ? (
					<Modal
						handleClose={() =>
							this.setState({
								showDelete: false,
								showDeactivate: false,
								showDeleteInvite: false,
							})
						}
						show={
							this.state.showDelete ||
							this.state.showDeactivate ||
							this.state.showDeleteInvite
						}
						modalType={'center'}
					>
						<DeleteTenantUserModal
							handleClose={() => this.setState({ showDelete: false })}
							onClickAction={() => this.handleDelete('team')}
						/>
					</Modal>
				) : (
					this.state.showDelete === true &&
					this.state.selectedUserRole == 'admin' &&
					window.alert(`Admins cannot be removed`)
				)}
				<Modal
					handleClose={() => this.showAddTenantUserModal()}
					show={this.state.showAddTenantUserModal}
					modalType={'center'}
				>
					<AddTenantUserModal
						{...this.props}
						isAdmin={this.state.isAdmin}
						isOwner={this.state.isOwner}
						close={() => this.showAddTenantUserModal()}
						addTenant={(e) => this.handleAddTenant(e)}
						tenantUser={this.state.tenantUser}
						step={this.state.sentInviteStep}
						role={this.state.userRoleType}
						email={this.state.emailID}
					/>
				</Modal>
				{this.state.accessControlPopup && (
					<Modal
						handleClose={async () => {
							this.setState({ accessControlPopup: false });
							await this.getTeamMembers('users');
						}}
						show={this.state.accessControlPopup}
						modalType={'center'}
					>
						<div className="profile-setting-outer-container new-wrapper">
							{this.state.isSubscriptionDetailsLoading === true ? (
								<div className="profile-role-wrapper">
									<div className="profile-role-container">
										<div className="profile-left-header-container">
											<div className="profile-role-header-title">
												<Skeleton width={100} height={42} />
											</div>
										</div>

										<div className="b">
											<Skeleton width={200} height={42} />
										</div>
									</div>
								</div>
							) : (
								<>{this.renderAccessControls()}</>
							)}
						</div>
					</Modal>
				)}
			</>
		);
	}
}

export default CompanyTeamSettings;
