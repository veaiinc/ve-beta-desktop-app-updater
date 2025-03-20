import React, { memo, useState, useEffect, useContext } from 'react';
import { Tooltip, message } from 'antd';
import '../../../assets/scss/notes/shareComponent.scss';
import { ReactComponent as Copy } from '../../../assets/svg/ai_assistant/url.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/checkmark.svg';
import Context from '../../../context/context';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';

const accessOptions = [
	{
		label: 'Full access',
		value: 'full',
		description: 'Edit, comment and share with others',
	},
	{
		label: 'Can edit',
		value: 'edit',
		description: 'Edit, suggest and comment',
	},
	{
		label: 'Can view',
		value: 'view',
	},
];

const GeneralAccessOptions = [
	{
		label: 'Can view',
		value: 'view',
	},
];

const ShareComponent = ({ pageId }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		notes: { getNotesAccess, notesAccess, addNotesAccess, updateNotesState },
	} = useContext(Context);
	const [info, setInfo] = useState({
		isOpen: false,
		tenantUsers: [],
		inputFocused: false,
		selectedUsers: [],
		membersWithAccess: [],
		accessType: 'full',
		btnLoading: false,
	});

	useEffect(() => {
		if (notesAccess) {
			setInfo((prevInfo) => ({
				...prevInfo,
				membersWithAccess: notesAccess,
			}));
		} else {
			getNotesAccess({ pageId });
		}
	}, [notesAccess]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = tenantsUserList?.map(({ firstName, lastName, _id, email }) => ({
				fullName: `${firstName}${lastName ? ` ${lastName}` : ''}`,
				email,
				userId: _id,
			}));

			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
			}));
		}
	}, [tenantsUserList]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({
			...prev,
			...data,
		}));
	};

	const handleUserSelection = (user) => {
		if (info?.selectedUsers?.some((selectedUser) => selectedUser?.userId === user?.userId)) {
			handleInfoChange({
				selectedUsers: info?.selectedUsers?.filter(
					(selectedUser) => selectedUser?.userId !== user?.userId,
				),
			});
		} else {
			handleInfoChange({ selectedUsers: [...info?.selectedUsers, user] });
		}
	};

	const handleAddMembers = async () => {
		const usersPermissionInput = info?.selectedUsers?.map((user) => ({
			userId: user?.userId,
			access: info?.accessType,
		}));
		setInfo((prev) => ({
			...prev,
			btnLoading: true,
		}));
		const response = await addNotesAccess({
			pageId,
			usersPermissionInput,
		});

		if (response?.[0]) {
			updateNotesState({
				notesAccess: [...info?.membersWithAccess, ...info?.selectedUsers],
			});
			handleInfoChange({
				selectedUsers: [],
				accessType: 'full',
				btnLoading: false,
			});
		} else {
			handleInfoChange({ btnLoading: false });
			message.error(response?.[1]?.message);
		}
	};

	return (
		<div className="notes-nav-menu-item-share">
			<Tooltip
				title={
					<div className="notes-nav-menu-item-share-dropdown">
						<div className="notes-nav-menu-item-share-dropdown-header">
							{info?.inputFocused ? (
								<div
									className="notes-nav-menu-item-share-dropdown-header-title"
									onClick={() =>
										handleInfoChange({
											inputFocused: false,
											selectedUsers: [],
										})
									}
								>
									<ChevronRightThinSvg style={{ transform: 'rotate(180deg)' }} />{' '}
									Invite
								</div>
							) : (
								<div className="notes-nav-menu-item-share-dropdown-header-title">
									Share
								</div>
							)}
							<button className="notes-nav-menu-item-share-dropdown-header-copy-btn">
								<Copy />
								Copy link
							</button>
						</div>
						<div className="notes-nav-menu-item-share-dropdown-body">
							<div className="notes-nav-menu-item-share-dropdown-body-search-container">
								<div className="notes-access-input-wrapper">
									{info?.selectedUsers?.length > 0 && (
										<div className="notes-access-input-wrapper-selected-users-wrapper">
											<div className="notes-access-input-wrapper-selected-users">
												{info?.selectedUsers?.map((user) => (
													<div
														className="notes-access-input-wrapper-selected-users-user"
														key={user?.userId}
													>
														<div className="avatar">
															{user?.fullName?.charAt(0)}
														</div>
														<span className="name">
															{user?.fullName}
														</span>
														<CrossSvg
															onClick={() =>
																handleUserSelection(user)
															}
															className="cursor-pointer"
														/>
													</div>
												))}
											</div>
											<AccessDropdown
												selectedAccess={info?.accessType}
												showRemoveButton={false}
												onChange={(value) =>
													handleInfoChange({ accessType: value })
												}
											/>
										</div>
									)}
									<input
										type="text"
										placeholder="Email or group, separated by commas"
										className="notes-access-input-wrapper-input"
										onFocus={() => handleInfoChange({ inputFocused: true })}
									/>
								</div>
								<button
									className="notes-nav-menu-item-share-dropdown-body-search-container-invite-btn"
									onClick={handleAddMembers}
									disabled={info?.btnLoading}
								>
									{info?.btnLoading ? 'Inviting...' : 'Invite'}
								</button>
							</div>
							{info?.inputFocused ? (
								<div className="notes-nav-menu-item-share-dropdown-body-select">
									{info?.tenantUsers?.length > 0 ? (
										info?.tenantUsers?.map((user) => (
											<div
												key={user?.userId}
												className="notes-nav-menu-item-share-dropdown-body-select-item cursor-pointer"
												onClick={() => handleUserSelection(user)}
											>
												<div className="notes-share-dropdown-avatar">
													{user?.fullName?.charAt(0)}
												</div>
												<div className="notes-share-dropdown-name-wrapper">
													<span className="notes-share-dropdown-name">
														{user?.fullName}
													</span>
													<span className="notes-share-dropdown-email">
														{user?.email}
													</span>
												</div>
												{info?.selectedUsers?.some(
													(selectedUser) =>
														selectedUser?.userId === user?.userId,
												) && <Check width={16} height={16} />}
											</div>
										))
									) : (
										<span>No users found</span>
									)}
								</div>
							) : (
								<div className="notes-nav-menu-item-share-dropdown-body-select">
									{info?.membersWithAccess?.length > 0 &&
										info?.membersWithAccess?.map((member) => (
											<div
												className="notes-nav-menu-item-share-dropdown-body-select-item"
												key={member?.userId}
											>
												<div className="notes-share-dropdown-avatar">
													{member?.fullName?.charAt(0)}
												</div>
												<div className="notes-share-dropdown-name-wrapper">
													<span className="notes-share-dropdown-name">
														{member?.fullName}
													</span>
													<span className="notes-share-dropdown-email">
														{member?.email}
													</span>
												</div>
												<AccessDropdown selectedAccess={member?.access} />
											</div>
										))}
								</div>
							)}
							{/* <div className="notes-nav-menu-item-share-dropdown-body-footer">
								<span className="notes-nav-menu-item-share-dropdown-body-footer-text">
									General access
								</span>
								<div className="notes-nav-menu-item-share-dropdown-body-footer-access-container">
									<AccessDropdown selectedAccess="full" />
								</div>
							</div> */}
						</div>
					</div>
				}
				placement="bottomLeft"
				color="transparent"
				trigger="click"
				open={info.isOpen}
				arrow={false}
				onOpenChange={(open) => {
					if (!open) {
						handleInfoChange({ isOpen: false });
					}
				}}
				overlayStyle={{
					minWidth: '381px',
				}}
			>
				<button onClick={() => handleInfoChange({ isOpen: !info.isOpen })}>Share</button>
			</Tooltip>
		</div>
	);
};

export default memo(ShareComponent);

const AccessDropdown = memo(({ selectedAccess, showRemoveButton = true, onChange = () => {} }) => {
	const [info, setInfo] = useState({
		isOpen: false,
		selectedAccess: null,
	});

	useEffect(() => {
		if (selectedAccess) {
			const selectedAccessOption = accessOptions.find(
				(option) => option.value === selectedAccess,
			);
			handleInfoChange({ selectedAccess: selectedAccessOption });
		}
	}, [selectedAccess]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	return (
		<Tooltip
			title={
				<div className="notes-share-dropdown-access-tooltip">
					<div className="notes-share-dropdown-access-tooltip-options">
						{accessOptions?.map((option) => (
							<div
								key={option?.value}
								className="notes-share-dropdown-access-tooltip-options-item"
								onClick={() => {
									onChange(option?.value);
									handleInfoChange({ isOpen: false });
								}}
							>
								<div className="notes-share-dropdown-access-tooltip-options-item-text">
									<span className="notes-share-dropdown-access-tooltip-text-label">
										{option?.label}
									</span>
									{option?.description && (
										<span className="notes-share-dropdown-access-tooltip-text-description">
											{option?.description}
										</span>
									)}
								</div>
								{info?.selectedAccess?.value === option?.value && (
									<Check width={16} height={16} />
								)}
							</div>
						))}
					</div>
					{showRemoveButton && (
						<div className="notes-share-dropdown-access-tooltip-footer">
							<button className="notes-share-dropdown-access-tooltip-footer-button">
								Remove
							</button>
						</div>
					)}
				</div>
			}
			arrow={false}
			placement="bottomLeft"
			color="transparent"
			overlayStyle={{
				minWidth: '256px',
			}}
			trigger="click"
			open={info?.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleInfoChange({ isOpen: false });
				}
			}}
		>
			<div
				className="notes-share-dropdown-access"
				onClick={() => handleInfoChange({ isOpen: !info.isOpen })}
			>
				<span className="notes-share-dropdown-access-text">
					{info.selectedAccess?.label}{' '}
				</span>
				<ChevronRightThinSvg
					style={{ transform: info?.isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
				/>
			</div>
		</Tooltip>
	);
});

// const GeneralAccessDropdown = memo(({ selectedAccess, showRemoveButton = true }) => {
// 	const [info, setInfo] = useState({
// 		isOpen: false,
// 		selectedAccess: null,
// 	});

// 	useEffect(() => {
// 		if (selectedAccess) {
// 			const selectedAccessOption = accessOptions.find(
// 				(option) => option.value === selectedAccess,
// 			);
// 			handleInfoChange({ selectedAccess: selectedAccessOption });
// 		}
// 	}, [selectedAccess]);

// 	const handleInfoChange = (data) => {
// 		setInfo((prev) => ({ ...prev, ...data }));
// 	};

// 	return (
// 		<Tooltip
// 			title={
// 				<div className="notes-share-dropdown-access-tooltip">
// 					<div className="notes-share-dropdown-access-tooltip-options">
// 						{accessOptions?.map((option) => (
// 							<div
// 								key={option?.value}
// 								className="notes-share-dropdown-access-tooltip-options-item"
// 							>
// 								<div className="notes-share-dropdown-access-tooltip-options-item-text">
// 									<span className="notes-share-dropdown-access-tooltip-text-label">
// 										{option?.label}
// 									</span>
// 									{option?.description && (
// 										<span className="notes-share-dropdown-access-tooltip-text-description">
// 											{option?.description}
// 										</span>
// 									)}
// 								</div>
// 								{info?.selectedAccess?.value === option?.value && (
// 									<Check width={16} height={16} />
// 								)}
// 							</div>
// 						))}
// 					</div>
// 					{showRemoveButton && (
// 						<div className="notes-share-dropdown-access-tooltip-footer">
// 							<button className="notes-share-dropdown-access-tooltip-footer-button">
// 								Remove
// 							</button>
// 						</div>
// 					)}
// 				</div>
// 			}
// 			arrow={false}
// 			placement="bottomLeft"
// 			color="transparent"
// 			overlayStyle={{
// 				minWidth: '256px',
// 			}}
// 			trigger="click"
// 			open={info?.isOpen}
// 			onOpenChange={(open) => {
// 				if (!open) {
// 					handleInfoChange({ isOpen: false });
// 				}
// 			}}
// 		>
// 			<div
// 				className="notes-share-dropdown-access"
// 				onClick={() => handleInfoChange({ isOpen: !info.isOpen })}
// 			>
// 				<span className="notes-share-dropdown-access-text">
// 					{info.selectedAccess?.label}{' '}
// 				</span>
// 				<ChevronRightThinSvg
// 					style={{ transform: info?.isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
// 				/>
// 			</div>
// 		</Tooltip>
// 	);
// });
