import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/AccountSettings/teamMembers.scss';
import _ from 'lodash';
import Modal from '../../components/modalsV2/index';
import search from '../../../assets/svg/workspaceSettings/searchSettings.svg';
import validator from 'validator';
import Context from '../../../context/context';
import AddNewUserModal from './addNewUser';
import InviteMembersWorkspaceComponent from '../../components/settings/team/InviteMembersWorkspace';
import TeamAccessListComponent from '../../components/settings/team/TeamAccessList';
import { message } from 'antd';

const TeamSettings = () => {
	// Contexts
	const {
		profileInfo: { tenantUserDetails },
		companyInfo: { getTeamMembers, tenantsUserList, inviteNewuser, updateTenantRole },
	} = useContext(Context);

	// useStates
	const [info, setInfo] = useState({
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
		buttonLoading: false,
	});

	const [sendRequestList, setsendRequestList] = useState([
		{
			email: '',
			userRole: 'admin',
			emailIDError: false,
			emailIDMessage: '',
			successTrue: false,
		},
	]);

	const [selectedOption, setselectedOption] = useState({
		tenantid: '',
		role: '',
	});

	const [filteredUsers, setfilteredUsers] = useState([]);
	const [messageApi, contextHolder] = message.useMessage();

	// useEffects
	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (tenantsUserList) {
			const findOwnerId = _.find(tenantsUserList, (item) => item.isOwner);
			setInfo((prev) => ({
				...prev,
				isOwner: findOwnerId ? true : false,
				tenantUser: tenantsUserList,
			}));
			setfilteredUsers(tenantsUserList);
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
		const filtered = info.tenantUser
			?.filter((user) => {
				const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.toLowerCase();
				return (
					fullName.includes(info.searchQuery.toLowerCase()) ||
					user?.email.toLocaleLowerCase().includes(info.searchQuery.toLocaleLowerCase())
				);
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

		setfilteredUsers(filtered);
	}, [info?.searchQuery]);

	const fetchData = async () => {
		if (!tenantsUserList) {
			await getTeamMembers();
		}
		setInfo((prev) => ({
			...prev,
			isloading: false,
		}));
	};

	const handleChnage = (e, index) => {
		const { name, value } = e.target;
		const update = [...sendRequestList];
		update[index][name] = value;
		if (update[index]['emailIDError']) {
			update[index]['emailIDError'] = false;
			update[index]['emailIDMessage'] = '';
		}
		setsendRequestList(update);
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

	const showAddTenantUserModal = () => {
		setInfo((prev) => ({
			...prev,
			showAddTenantUserModal: !prev.showAddTenantUserModal,
		}));
	};

	const validateUsersEmails = (email, index) => {
		const update = [...sendRequestList];
		let emailError = false,
			emailIDMessage = '';
		if (email === null || email === '') {
			emailError = true;
			emailIDMessage = 'Required Field!';
		}
		if (!validator.isEmail(email)) {
			emailError = true;
			emailIDMessage = 'Please enter correct email';
		}
		update[index]['emailIDError'] = emailError;
		update[index]['emailIDMessage'] = emailIDMessage;
		setsendRequestList(update);
		return !emailError;
	};

	const validateDuplicateEmails = (email, index) => {
		const update = [...sendRequestList];
		let emailError = false;
		let emailIDMessage = '';

		const isDuplicate = sendRequestList?.some(
			(item, idx) => item?.email === email && idx !== index,
		);

		if (isDuplicate) {
			emailError = true;
			emailIDMessage = 'Duplicate email found!';
		}

		// Update the state with the error message
		update[index]['emailIDError'] = emailError;
		update[index]['emailIDMessage'] = emailIDMessage;
		setsendRequestList(update);

		// Return whether the email has an error or not
		return !emailError;
	};

	const validateExistUser = (email, index) => {
		const update = [...sendRequestList];
		let emailError = false;
		let emailIDMessage = '';

		// Check if the user already exists
		const isAlreadyExist = info?.tenantUser?.find((item) => item?.email === email || null);
		if (isAlreadyExist) {
			emailError = true;
			emailIDMessage = 'User already exists!';
		}

		// Update the state
		update[index]['emailIDError'] = emailError;
		update[index]['emailIDMessage'] = emailIDMessage;
		setsendRequestList(update);

		// Return whether the email has an error or not
		return !emailError;
	};

	const mapUsersRoleBased = () => {
		const data = sendRequestList.map((singleUser) => {
			return {
				email: singleUser?.email,
				role: singleUser?.userRole || 'admin',
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
		});

		return data;
	};

	const loadingToastFunction = () => {
		messageApi.open({
			type: 'loading',
			content: 'Requests are sending..',
			duration: 0,
		});
	};

	const handleSubmit = async () => {
		try {
			if (info?.buttonLoading) return;

			let isAllCorrect = true;

			for (let index = 0; index < sendRequestList.length; index++) {
				if (!validateUsersEmails(sendRequestList[index].email, index) && isAllCorrect) {
					isAllCorrect = false;
				}
			}

			if (!isAllCorrect) return;

			for (let index = 0; index < sendRequestList.length; index++) {
				if (!validateDuplicateEmails(sendRequestList[index].email, index) && isAllCorrect) {
					isAllCorrect = false;
				}
			}

			if (!isAllCorrect) return;

			for (let index = 0; index < sendRequestList.length; index++) {
				if (!validateExistUser(sendRequestList[index].email, index) && isAllCorrect) {
					isAllCorrect = false;
				}
			}

			if (!isAllCorrect) return;

			const dataRoles = mapUsersRoleBased();
			setInfo((prev) => ({ ...prev, buttonLoading: true }));
			loadingToastFunction();

			const promises = dataRoles?.map((payload) => inviteNewuser(payload));
			const results = await Promise.all(promises);
			const update = [...sendRequestList];
			results?.forEach((singleResult, index) => {
				if (!_.isBoolean(singleResult[0]) && singleResult[0] !== true) {
					update[index].emailIDError = true;
					update[index].emailIDMessage = singleResult[1]?.message;
				} else {
					update[index].emailIDError = false;
					update[index].successTrue = true;
					update[index].emailIDMessage = 'Invitation mail sent successfully';

					setTimeout(() => {
						const tempUpdate = [...sendRequestList];
						tempUpdate[index].successTrue = false;
						tempUpdate[index].emailIDMessage = '';
						setsendRequestList(tempUpdate);
					}, 2000);
				}
			});

			setsendRequestList(update);
			setInfo((prev) => ({ ...prev, buttonLoading: false }));
			getTeamMembers();
			messageApi.destroy();
		} catch (error) {
			console.error(error); // handle any errors that occur
		}
	};

	const updateTenantRoleFunc = (_id, role) => {
		updateTenantRole({ _id, role });
		setselectedOption({ tenantid: '', role: '' });
	};

	return (
		<>
			{contextHolder}

			<div className="TeamMemberContainer">
				<div className="inviteMemberComponent">
					<InviteMembersWorkspaceComponent
						handleChnage={handleChnage}
						info={info}
						handleSubmit={handleSubmit}
						sendRequestList={sendRequestList}
						setsendRequestList={setsendRequestList}
					/>
				</div>

				<div className="yourTeamComponent">
					<TeamAccessListComponent
						search={search}
						handleInputChange={handleInputChange}
						info={info}
						filteredUsers={filteredUsers}
						selectedOption={selectedOption}
						setselectedOption={setselectedOption}
						updateTenantRoleFunc={updateTenantRoleFunc}
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
		</>
	);
};

export default memo(TeamSettings);
