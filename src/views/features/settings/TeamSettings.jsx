import React, { useContext, useEffect, useState, memo } from 'react';
import '../../../assets/scss/settings/teamMembers.scss';
import search from '../../../assets/svg/workspaceSettings/searchSettings.svg';
import validator from 'validator';
import Context from '../../../context/context';
import InviteMembersWorkspaceComponent from '../../components/settings/team/InviteMembersWorkspace';
import TeamAccessListComponent from '../../components/settings/team/TeamAccessList';
import { message } from '../../components/globalComponents/CustomToast';

const TeamSettings = () => {
	// Contexts
	const {
		profileInfo: { tenantUserDetails, userDetailsData },
		companyInfo: {
			getTeamMembers,
			tenantsUserList,
			updateTenantRole,
			removeTenantRole,
			addTenantUser,
		},
		subscriptionInfo: { currentPlan },
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
		emailError: '',
	});

	const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

	// useEffects
	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (tenantsUserList) {
			const findOwnerId = tenantsUserList?.find((item) => item?.isOwner);
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
				const emailLower = (user?.email || '').toLowerCase();
				const queryLower = info.searchQuery.toLowerCase();
				return fullName.includes(queryLower) || emailLower.includes(queryLower);
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
		accessControls:
			currentPlan?.apps?.map((option) => ({
				app: option,
				isEnabled: false,
				hasFullAccess: false,
			})) || [],
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

	const handleSubmit = async () => {
		if (info?.isloading) {
			return;
		}
		if (!dataNeeded?.email) {
			message.error('Please enter email');
			return;
		}

		if (!emailRegEx.test(dataNeeded?.email)) {
			message.error('Please enter a valid email address');
			return;
		}

		let updatedAccessControls = [...(dataNeeded?.accessControls || [])];

		if (info?.selectedOption === 'admin') {
			// If role is "admin", enable all access controls
			updatedAccessControls = currentPlan?.apps?.map((control) => ({
				app: control?.app,
				isEnabled: true,
				hasFullAccess: true,
			}));
		} else if (info?.selectedOption === 'default') {
			// Filter only enabled access controls
			updatedAccessControls = updatedAccessControls.filter((control) => control?.isEnabled);

			if (updatedAccessControls.length === 0) {
				message.error('At least one access control must be enabled.');
				return;
			}
		}

		// Prepare final data for API call
		const finalData = {
			...dataNeeded,
			accessControls: updatedAccessControls,
		};

		setInfo((prev) => ({ ...prev, isloading: true }));
		const response = await addTenantUser(finalData);
		if (response?.[0] === true) {
			message.success('User invited successfully');
			setInfo((prev) => ({ ...prev, showAddTenantUserModal: false, isloading: false }));
			setAccessControls((prev) => ({
				...prev,
				accessControls:
					currentPlan?.apps?.map((option) => ({
						app: option?.app,
						isEnabled: false,
						hasFullAccess: false,
					})) || [],
			}));
		} else {
			message.error('Failed to invite user');
			setInfo((prev) => ({ ...prev, isloading: false }));
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
				accessControls: user?.accessControls?.map((option) => ({
					app: option?.app,
					isEnabled: option?.isEnabled,
					hasFullAccess: option?.hasFullAccess,
				})),
			});
		}
	};

	const handleInviteMembers = () => {
		setInfo((prev) => ({
			...prev,
			accessControls:
				currentPlan?.apps?.map((option) => ({
					app: option,
					isEnabled: false,
					hasFullAccess: false,
				})) || [],
			userEmail: '',
			selectedOption: 'admin',
			selectedUser: null,
			showAddTenantUserModal: true,
		}));
	};

	const handleCheckboxChange = (app, checked) => {
		setAccessControls((prevState) => {
			const existingControl = prevState?.accessControls?.find(
				(control) => control?.app === app,
			);

			if (existingControl) {
				return {
					accessControls: prevState?.accessControls?.map((control) =>
						control?.app === app
							? { ...control, isEnabled: checked, hasFullAccess: checked }
							: control,
					),
				};
			} else {
				return {
					accessControls: [
						...prevState?.accessControls,
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
			isloading: false,
			selectedOption: 'admin',
			userEmail: '',
			selectedUser: null,
		}));

		setAccessControls((prev) => ({
			...prev,
			accessControls:
				currentPlan?.apps?.map((option) => ({
					app: option,
					isEnabled: false,
					hasFullAccess: false,
				})) || [],
		}));
	};

	const handleAccessTypeChange = (app, type) => {
		setAccessControls((prev) => ({
			accessControls: prev.accessControls.map((control) =>
				control.app === app
					? {
							...control,
							hasFullAccess: type === 'full',
					  }
					: control,
			),
		}));
	};

	return (
		<>
			<div className="TeamMemberContainer">
				<h1 className="TeamMemberContainerTitle">Team Members</h1>
				<div className="settingsBoxContainer yourTeamComponent">
					<TeamAccessListComponent
						search={search}
						handleInputChange={handleInputChange}
						info={info}
						filteredUsers={filteredUsers}
						handleInviteMembers={handleInviteMembers}
						handleUserClick={handleUserClick}
					/>
				</div>
			</div>
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
				selectableOptions={currentPlan?.apps}
				userEmail={info?.userEmail}
				selectedUser={info?.selectedUser}
				tenantUserId={userDetailsData?._id}
				isSubmitLoading={info?.isloading}
				handleAccessTypeChange={handleAccessTypeChange}
			/>
		</>
	);
};

export default memo(TeamSettings);
