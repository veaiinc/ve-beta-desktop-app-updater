import React, { useContext, useEffect, useCallback, useState, memo } from 'react';
import '../../../assets/scss/settings/teamMembers.scss';
import search from '../../../assets/svg/workspaceSettings/searchSettings.svg';
import validator from 'validator';
import Context from '../../../context/context';
import InviteMembersWorkspaceComponent from '../../components/settings/team/InviteMembersWorkspace';
import TeamAccessListComponent from '../../components/settings/team/TeamAccessList';
import { message } from 'antd';

const TeamSettings = () => {
	// Contexts
	const {
		profileInfo: { tenantUserDetails, userDetailsData },
		companyInfo: {
			getTeamMembers,
			tenantsUserList,
			inviteNewuser,
			updateTenantRole,
			removeTenantRole,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	// useStates
	const [info, setInfo] = useState({
		showAddTenantUserModal: false,
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

	const [filteredUsers, setfilteredUsers] = useState([]);
	const [messageApi, contextHolder] = message.useMessage();

	// useEffects
	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (tenantsUserList) {
			const findOwnerId = tenantsUserList?.find((item) => item.isOwner);
			setInfo((prev) => ({
				...prev,
				isOwner: findOwnerId ? true : false,
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
		const filtered = tenantsUserList
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
			emailIDMessage = 'Please enter verified email';
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
		const isAlreadyExist = tenantsUserList?.find((item) => item?.email === email || null);
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
			if (
				validateExpiryData &&
				validateExpiryData?.restrictWorkflows &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}
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
			let update = [...sendRequestList];
			let completionCount = 0;
			results?.forEach((singleResult, index) => {
				if (typeof singleResult[0] !== 'boolean' || singleResult[0] !== true) {
					update[index].emailIDError = true;
					update[index].emailIDMessage = singleResult[1]?.message;
				} else {
					update[index].emailIDError = false;
					update[index].successTrue = true;
					update[index].emailIDMessage = 'Invitation mail sent successfully';
					completionCount++;

					setTimeout(() => {
						if (sendRequestList?.length === completionCount) return;
						const tempUpdate = [...sendRequestList];
						tempUpdate[index].successTrue = false;
						tempUpdate[index].emailIDMessage = '';
						setsendRequestList(tempUpdate);
					}, 2000);
				}
			});

			if (completionCount === results?.length) {
				update = [
					{
						email: '',
						userRole: 'admin',
						emailIDError: false,
						emailIDMessage: '',
						successTrue: false,
					},
				];
			}
			setsendRequestList(update);
			setInfo((prev) => ({ ...prev, buttonLoading: false }));
			getTeamMembers();
			messageApi.destroy();
		} catch (error) {
			console.log('error==>handleSubmit', error);
		}
	};

	const updateTenantRoleFunc = async (_id, role) => {
		const json = {
			role,
		};

		const response =
			role === 'remove' ? await removeTenantRole(_id) : await updateTenantRole(_id, json);
		if (response?.[0] === true) {
			messageApi.success(response?.[1]?.message);
			if (userDetailsData?._id === _id) {
				window.location.reload();
			}
		} else {
			messageApi.error(response?.[1]?.message);
		}
	};

	return (
		<>
			{contextHolder}

			<div className="TeamMemberContainer">
				<div className="settingsBoxContainer inviteMemberComponent">
					<InviteMembersWorkspaceComponent
						handleChnage={handleChnage}
						info={info}
						handleSubmit={handleSubmit}
						sendRequestList={sendRequestList}
						setsendRequestList={setsendRequestList}
					/>
				</div>

				<div className="settingsBoxContainer yourTeamComponent">
					<TeamAccessListComponent
						search={search}
						handleInputChange={handleInputChange}
						info={info}
						filteredUsers={filteredUsers}
						updateTenantRoleFunc={updateTenantRoleFunc}
					/>
				</div>
			</div>
		</>
	);
};

export default memo(TeamSettings);
