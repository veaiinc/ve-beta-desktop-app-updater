import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/CompanySettings/teamMembers.scss';
import Line from './Line';
import _ from 'lodash';
import Modal from '../../components/modalsV2/index';
// import AddNewUserModal from '../../components/modals/tenantUser/addNewUser';
import search from '../../../assets/svg/workspaceSettings/searchSettings.svg';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import validator from 'validator';
import Context from '../../../context/context';
import { getInitials } from '../profile_settings/getInitials';
import Skeleton from 'react-loading-skeleton';
import AddNewUserModal from './addNewUser';

const CompanyTeamMembers = () => {
	const {
		profileInfo: { getTenantUserDetails, tenantUserDetails },
		companyInfo: { getTeamMembers, tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		emailID: '',
		emailIDError: '',
		emailIDMessage: '',
		sentInvitationSteps: '',
		userRoleType: 'admin',
		showAddTenantUserModal: false,
		tenantUser: [],
		activeUserId: '',
		isOwner: '',
		isAdmin: '',
		searchQuery: '',
		isloading: true,
		showDelete: false,
		selectedUserRole: '',
		showDeactivate: '',
		showDeleteInvite: '',
	});

	useEffect(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		if (!tenantUserDetails) {
			await getTenantUserDetails();
		}
		if (!tenantsUserList) {
			await getTeamMembers();
		}
		setInfo((prev) => ({
			...prev,
			isloading: false,
		}));
	};
	useEffect(() => {
		if (tenantsUserList) {
			setInfo((prev) => ({
				...prev,
				tenantUser: tenantsUserList,
			}));
		}
	}, [tenantsUserList]);
	useEffect(() => {
		if (tenantUserDetails) {
			setInfo((prev) => ({
				...prev,
				isOwner: tenantUserDetails?.isOwner,
				isAdmin: tenantUserDetails?.role === 'admin',
			}));
		}
	}, [tenantUserDetails]);

	const handleChnage = (e) => {
		const { name, value } = e.target;
		setInfo((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleInputChange = (event) => {
		setInfo((prev) => ({
			...prev,
			searchQuery: event.target.value,
		}));
	};

	const filteredUsers = info.tenantUser
		?.filter((user) => {
			const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.toLowerCase();
			return fullName.includes(info.searchQuery.toLowerCase());
		})
		.sort((a, b) => {
			if (a.role === 'admin' && b.role !== 'admin') {
				return -1;
			} else if (a.role !== 'admin' && b.role === 'admin') {
				return 1;
			} else {
				return 0;
			}
		});

	const showAddTenantUserModal = () => {
		setInfo((prev) => ({
			...prev,
			showAddTenantUserModal: !prev.showAddTenantUserModal,
		}));
	};
	const handleSubmit = () => {
		if (info.emailID === null || info.emailID === '') {
			setInfo((prev) => ({
				...prev,
				emailIDError: true,
				emailIDMessage: 'Required Field!',
			}));
			return;
		} else if (!validator.isEmail(info.emailID)) {
			setInfo((prev) => ({
				...prev,
				emailIDError: true,
				emailIDMessage: 'Please enter correct email',
			}));
			return;
		} else {
			setInfo((prev) => ({
				...prev,
				emailIDError: false,
				emailIDMessage: '',
				sentInvitationSteps: info.userRoleType === 'admin' ? 1 : 3,
			}));
			showAddTenantUserModal();
		}
		let isExisting = undefined;
		let userType = '';
		let userId = '';
		let emailID = info.emailID;
		let isUserExisting = _.find(info.tenantUser, function (o) {
			return (
				(o.email && o.email === emailID) || (o.inviteeEmail && o.inviteeEmail === emailID)
			);
		});

		if (_.size(isUserExisting) > 0) {
			userId = isUserExisting._id;
			userType = isUserExisting.email ? 'active' : 'invited';
			isExisting = true;
		} else {
			isExisting = false;
		}
		if (
			info.emailID !== null &&
			info.emailID !== '' &&
			validator.isEmail(info.emailID) &&
			!isExisting
		) {
			setInfo((prev) => ({
				...prev,
				sentInvitationSteps: 2,
			}));
		} else if (
			info.emailID !== null &&
			info.emailID !== '' &&
			validator.isEmail(info.emailID) &&
			isExisting === true &&
			userType === 'active'
		) {
			setInfo((prev) => ({
				...prev,
				activeUserId: userId,
				sentInvitationSteps: 3,
			}));
		} else if (
			info.emailID !== null &&
			info.emailID !== '' &&
			validator.isEmail(info.emailID) &&
			isExisting === true &&
			userType === 'invited'
		) {
			setInfo((prev) => ({
				...prev,
				activeUserId: userId,
				sentInvitationSteps: 4,
			}));
		}
	};

	return (
		<div className="companyTeamMemberContainer">
			<h1>Team Members</h1>
			<Line />
			<div className="inviteMemberContainer">
				<div className="inviteMemberText">
					<h1>Invite Members to Workspace</h1>
					<p>
						Members you invite will have full access to your workspace unless you
						customise user roles
					</p>
				</div>
				<div>
					<div className="sendRequestInputContainer">
						<div className="sendRequestInput">
							<input
								type="email"
								className="textInput"
								placeholder="Enter text here..."
								name="emailID"
								onChange={handleChnage}
								value={info.emailID}
							/>
							<div className="dropdownContainer">
								<select className="dropdownInput">
									<option value="">Admin</option>
									{/* <option value="option1">Option 1</option>
							<option value="option2">Option 2</option> */}
								</select>
							</div>
						</div>
						<div style={{ minWidth: '150px' }}>
							<ReusableButtonSettings text="Send Request" func={handleSubmit} />
						</div>
					</div>
					{info.emailIDError && (
						<p
							style={{
								color: 'crimson',
								fontSize: '11px',
								fontFamily: 'Inter',
								marginLeft: '10px',
							}}
						>
							{info.emailIDMessage}
						</p>
					)}
				</div>
			</div>
			<Line />
			<div className="yourTeamContainer">
				<div className="yourTeamTitle">
					<h1>Your Team</h1>
					<div className="yourTeamFilter">
						<img src={search} alt="searchh" />
						<input
							type="text"
							placeholder="search"
							onChange={handleInputChange}
							value={info.searchQuery}
						/>
					</div>
				</div>
				<div>
					<div>
						{filteredUsers.map((user, index) => (
							<div className="tenantDetailsContainer">
								<div className="tenantProfileContainer">
									<div className="tenantLogo">
										{getInitials(user?.firstName, user?.lastName)}
									</div>
									<div className="tenantProfileName">
										<h1>
											{!user?.firstName && !user?.lastName
												? 'No Name'
												: user?.firstName
												? user.firstName
												: ' ' + ' ' + user?.lastName
												? user.lastName
												: ''}
										</h1>
										<p>{user?.email ? user?.email : ''}</p>
									</div>
								</div>
								<div>
									<div className="AccessControl">
										{user?.isOwner ? (
											<p className="owner">Owner</p>
										) : (
											<div className="editAccessControl">
												{/* <p className="Edit">Edit Access</p> */}
												<p className="role">Admin</p>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
					<div>
						{info.isloading ? (
							<div>
								<Skeleton height={100} />
								<Skeleton height={100} />
								<Skeleton height={100} />
								<Skeleton height={100} />
							</div>
						) : (
							' '
						)}
					</div>
				</div>
			</div>
			<Modal closeModal={() => showAddTenantUserModal()} isOpen={info.showAddTenantUserModal}>
				<AddNewUserModal
					isAdmin={info.isAdmin}
					isOwner={info.isOwner}
					close={() => showAddTenantUserModal()}
					tenantUser={info?.tenantUser}
					step={info.sentInvitationSteps}
					role={info.userRoleType}
					email={info.emailID}
				/>
			</Modal>
		</div>
	);
};

export default CompanyTeamMembers;
