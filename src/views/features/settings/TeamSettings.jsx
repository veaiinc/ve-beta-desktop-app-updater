import React, { useContext, useEffect, useCallback, useState, memo } from 'react';
import '../../../assets/scss/settings/teamMembers.scss';
import search from '../../../assets/svg/workspaceSettings/searchSettings.svg';
import validator from 'validator';
import Context from '../../../context/context';
import InviteMembersWorkspaceComponent from '../../components/settings/team/InviteMembersWorkspace';
import TeamAccessListComponent from '../../components/settings/team/TeamAccessList';
import { message } from 'antd';

const selectableOptions = [
	{ id: 1, title: 'Documents', value: 'workflow' },
	{ id: 2, title: 'Classic Gallery', value: 'classicGallery' },
	{ id: 3, title: 'Lite Gallery', value: 'liteGallery' },
	{ id: 4, title: 'Conversational Agent', value: 'conversationalAgent' },
	{ id: 5, title: 'Folder', value: 'folder' },
	{ id: 6, title: 'Template', value: 'template' },
	{ id: 7, title: 'Task', value: 'task' },
	{ id: 8, title: 'Calendar', value: 'calendar' },
	{ id: 9, title: 'Form', value: 'form' },
];

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
			addTenantUser,
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
		selectedOption: 'admin',
		userEmail: '',
		selectedUser: null,
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
		if (name === 'email') {
			setInfo((prev) => ({ ...prev, userEmail: value }));
		} else {
			setInfo((prev) => ({ ...prev, selectedOption: value }));
		}
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

	const [accessControls, setAccessControls] = useState({
		accessControls: selectableOptions.map((option) => ({
			app: option.value,
			isEnabled: false,
			hasFullAccess: false,
		})),
	});

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

	const dataNeededForInvite = () => {
		const data = {
			email: info?.userEmail,
			role: info?.selectedOption,
			accessControls: info?.selectedOption === 'admin' ? [] : accessControls?.accessControls,
		};
		return data;
	};

	const dataNeeded = dataNeededForInvite();

	const loadingToastFunction = () => {
		messageApi.open({
			type: 'loading',
			content: 'Requests are sending..',
			duration: 0,
		});
	};

	// const handleSubmit = async () => {
	// 	try {
	// 		if (
	// 			validateExpiryData &&
	// 			validateExpiryData?.restrictWorkflows &&
	// 			validateExpiryData?.isExpired
	// 		) {
	// 			return updateSubscriptionState({ expiredSubscriptionModal: true });
	// 		}
	// 		if (info?.buttonLoading) return;

	// 		let isAllCorrect = true;

	// 		for (let index = 0; index < sendRequestList.length; index++) {
	// 			if (!validateUsersEmails(sendRequestList[index].email, index) && isAllCorrect) {
	// 				isAllCorrect = false;
	// 			}
	// 		}

	// 		if (!isAllCorrect) return;

	// 		for (let index = 0; index < sendRequestList.length; index++) {
	// 			if (!validateDuplicateEmails(sendRequestList[index].email, index) && isAllCorrect) {
	// 				isAllCorrect = false;
	// 			}
	// 		}

	// 		if (!isAllCorrect) return;

	// 		for (let index = 0; index < sendRequestList.length; index++) {
	// 			if (!validateExistUser(sendRequestList[index].email, index) && isAllCorrect) {
	// 				isAllCorrect = false;
	// 			}
	// 		}

	// 		if (!isAllCorrect) return;

	// 		const dataRoles = mapUsersRoleBased();
	// 		setInfo((prev) => ({ ...prev, buttonLoading: true }));
	// 		loadingToastFunction();

	// 		const promises = dataRoles?.map((payload) => inviteNewuser(payload));
	// 		const results = await Promise.all(promises);
	// 		let update = [...sendRequestList];
	// 		let completionCount = 0;
	// 		results?.forEach((singleResult, index) => {
	// 			if (typeof singleResult[0] !== 'boolean' || singleResult[0] !== true) {
	// 				update[index].emailIDError = true;
	// 				update[index].emailIDMessage = singleResult[1]?.message;
	// 			} else {
	// 				update[index].emailIDError = false;
	// 				update[index].successTrue = true;
	// 				update[index].emailIDMessage = 'Invitation mail sent successfully';
	// 				completionCount++;

	// 				setTimeout(() => {
	// 					if (sendRequestList?.length === completionCount) return;
	// 					const tempUpdate = [...sendRequestList];
	// 					tempUpdate[index].successTrue = false;
	// 					tempUpdate[index].emailIDMessage = '';
	// 					setsendRequestList(tempUpdate);
	// 				}, 2000);
	// 			}
	// 		});

	// 		if (completionCount === results?.length) {
	// 			update = [
	// 				{
	// 					email: '',
	// 					userRole: 'admin',
	// 					emailIDError: false,
	// 					emailIDMessage: '',
	// 					successTrue: false,
	// 				},
	// 			];
	// 		}
	// 		setsendRequestList(update);
	// 		setInfo((prev) => ({ ...prev, buttonLoading: false }));
	// 		getTeamMembers();
	// 		messageApi.destroy();
	// 	} catch (error) {
	// 		console.log('error==>handleSubmit', error);
	// 	}
	// };

	const handleSubmit = async () => {
		if (dataNeeded?.email === '') {
			messageApi.error('Please enter email');
			return;
		}
		const hasEnabledAccess = dataNeeded?.accessControls?.some((control) => control.isEnabled);

		if (!hasEnabledAccess) {
			messageApi.error('At least one access control must be enabled.');
			return;
		}
		const response = await addTenantUser(dataNeeded);
		if (response?.[0] === true) {
			messageApi.success(response?.[1]?.message);
			setInfo((prev) => ({ ...prev, showAddTenantUserModal: false }));
		} else {
			messageApi.error(response?.[1]?.message);
		}
		getTeamMembers();
	};

	const handleUserClick = (user) => {
		if (user?.role === 'default') {
			setInfo((prev) => ({
				...prev,
				showAddTenantUserModal: true, // Open the modal
				selectedUser: user, // Store the selected user data
				userEmail: user?.email, // Pre-fill the email field
				selectedOption: user?.role, // Pre-fill the role
			}));

			// Set the access controls for the selected user
			setAccessControls({
				accessControls:
					user?.accessControls ||
					selectableOptions.map((option) => ({
						app: option.value,
						isEnabled: false,
						hasFullAccess: false,
					})),
			});
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

	const handleInviteMembers = () => {
		setInfo((prev) => ({
			...prev,
			accessControls: selectableOptions.map((option) => ({
				app: option.value,
				isEnabled: false,
				hasFullAccess: false,
			})),
			userEmail: '',
			selectedOption: 'admin',
			selectedUser: null,
			showAddTenantUserModal: true,
		}));
	};

	const handleCheckboxChange = (app, checked) => {
		setAccessControls((prevState) => {
			const existingControl = prevState.accessControls.find((control) => control.app === app);

			if (existingControl) {
				return {
					accessControls: prevState.accessControls.map((control) =>
						control.app === app
							? { ...control, isEnabled: checked, hasFullAccess: checked }
							: control,
					),
				};
			} else {
				return {
					accessControls: [
						...prevState.accessControls,
						{ app, isEnabled: checked, hasFullAccess: checked },
					],
				};
			}
		});
	};

	const closeModal = () => {
		setInfo((prev) => ({
			...prev,
			showAddTenantUserModal: false,
			selectedOption: 'admin',
			userEmail: '',
			selectedUser: null,
		}));

		setAccessControls((prev) => ({
			...prev,
			accessControls: selectableOptions.map((option) => ({
				app: option.value,
				isEnabled: false,
				hasFullAccess: false,
			})),
		}));
	};

	return (
		<>
			{contextHolder}

			<div className="TeamMemberContainer">
				<div className="settingsBoxContainer yourTeamComponent">
					<TeamAccessListComponent
						search={search}
						handleInputChange={handleInputChange}
						info={info}
						filteredUsers={filteredUsers}
						updateTenantRoleFunc={updateTenantRoleFunc}
						handleInviteMembers={handleInviteMembers}
						handleUserClick={handleUserClick}
					/>
				</div>
			</div>
			{info?.showAddTenantUserModal && (
				<InviteMembersWorkspaceComponent
					isOpen={info?.showAddTenantUserModal}
					closeModal={closeModal}
					handleChnage={handleChnage}
					info={info}
					handleSubmit={handleSubmit}
					sendRequestList={sendRequestList}
					setsendRequestList={setsendRequestList}
					selectedOption={info?.selectedOption}
					accessControls={accessControls}
					handleCheckboxChange={handleCheckboxChange}
					selectableOptions={selectableOptions}
					userEmail={info?.userEmail}
					selectedUser={info?.selectedUser}
					tenantUserId={userDetailsData?._id}
				/>
			)}
		</>
	);
};

export default memo(TeamSettings);
