import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/CompanySettings/teamMembers.scss';
import Line from './Line';
import _ from 'lodash';
import Modal from '../../components/modalsV2/index';
import search from '../../../assets/svg/workspaceSettings/searchSettings.svg';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import validator from 'validator';
import Context from '../../../context/context';
import { getInitials } from '../profile_settings/getInitials';

import AddNewUserModal from './addNewUser';
import {
	InviteMembersWorkspaceComponent,
	TeamAccessListComponent,
} from '../../components/settings/TeamSettings';

const TeamSettings = () => {
	const {
		profileInfo: { getTenantUserDetails, tenantUserDetails },
		companyInfo: { getTeamMembers, tenantsUserList, inviteUserRes },
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

	useEffect(() => {
		console.log(inviteUserRes, 'this is called');
		if (inviteUserRes === 'success') {
			getTeamMembers();
		}
	}, [inviteUserRes]);

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
	const handleClearInput = () => {
		setInfo((prev) => ({
			...prev,
			emailID: '',
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
				<InviteMembersWorkspaceComponent
					handleChnage={handleChnage}
					info={info}
					handleSubmit={handleSubmit}
				/>
			</div>
			<Line />
			<div className="yourTeamContainer">
				<TeamAccessListComponent
					search={search}
					handleInputChange={handleInputChange}
					info={info}
					filteredUsers={filteredUsers}
				/>
			</div>
			<Modal closeModal={showAddTenantUserModal} isOpen={info.showAddTenantUserModal}>
				<AddNewUserModal
					isAdmin={info.isAdmin}
					isOwner={info.isOwner}
					close={showAddTenantUserModal}
					tenantUser={info?.tenantUser}
					step={info.sentInvitationSteps}
					role={info.userRoleType}
					email={info.emailID}
					clearForm={handleClearInput}
				/>
			</Modal>
		</div>
	);
};

export default TeamSettings;
