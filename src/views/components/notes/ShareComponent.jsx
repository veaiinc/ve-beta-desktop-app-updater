import { memo, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Tooltip } from 'antd';
import { message } from '../../components/globalComponents/CustomToast';
import '../../../assets/scss/notes/shareComponent.scss';
import { ReactComponent as Copy } from '../../../assets/svg/ai_assistant/url.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/checkmark.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import Context from '../../../context/context';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import Skeleton from 'react-loading-skeleton';
import slugify from 'slugify';
import moment from 'moment';

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

let workspace = '';

const today = new Date();
today.setDate(today.getDate() + 1);
const minDate = today.toISOString().split('T')[0];

const ShareComponent = ({ pageId }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		notes: {
			getNotesAccess,
			notesAccess,
			addNotesAccess,
			updateNotesState,
			changeNotesAccess,
			removeNotesAccess,
			getNotesPageData,
			notesPageData,
			updatePage,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		isOpen: false,
		tenantUsers: [],
		inputFocused: false,
		selectedUsers: [],
		membersWithAccess: [],
		accessType: 'full',
		btnLoading: false,
		search: '',
		tenantUserLoading: true,
		isPublishOpen: false,
		isPublished: false,
		slug: '',
		expiresAt: null,
		publishLoading: false,
		slugError: '',
		prevSlug: '',
	});

	const debounceRef = useRef(null);
	const dateInputRef = useRef(null);
	useEffect(() => {
		getNotesPageData({ pageId });
	}, [pageId]);

	useEffect(() => {
		if (notesPageData && pageId) {
			const { isPublished = false, slug = pageId, expiresAt = null } = notesPageData || {};

			setInfo((prev) => ({
				...prev,
				isPublished,
				slug: slug || pageId,
				expiresAt,
				prevSlug: slug || pageId,
			}));
		}
	}, [notesPageData, pageId]);

	useEffect(() => {
		if (notesAccess) {
			const filteredUsers = filterUsers(tenantsUserList, notesAccess);
			setInfo((prevInfo) => ({
				...prevInfo,
				membersWithAccess: notesAccess,
				tenantUsers: filteredUsers,
			}));
		} else {
			getNotesAccess({ pageId });
		}
	}, [notesAccess]);

	useEffect(() => {
		if (pageId) {
			getNotesAccess({ pageId });
		}
	}, [pageId]);

	useEffect(() => {
		workspace = localStorage.getItem('workspaceId');
	}, []);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = filterUsers(tenantsUserList, info?.membersWithAccess);
			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
				tenantUserLoading: false,
			}));
		}
	}, [tenantsUserList]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({
			...prev,
			...data,
		}));
	};

	const filterUsers = (tenantUsers = [], membersWithAccess = []) => {
		return tenantUsers
			?.filter((user) => !membersWithAccess?.some((member) => member?.userId === user?._id))
			?.map(({ firstName, lastName, _id, email }) => ({
				fullName: `${firstName}${lastName ? ` ${lastName}` : ''}`,
				email,
				userId: _id,
			}))
			?.sort((a, b) => a?.fullName?.localeCompare(b?.fullName));
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

	const handleInputEnter = (e) => {
		if (e?.key === 'Enter') {
			handleUserSelection(
				info?.tenantUsers?.find(
					(user) =>
						user?.fullName?.toLowerCase()?.includes(info?.search?.toLowerCase()) ||
						user?.email?.toLowerCase()?.includes(info?.search?.toLowerCase()),
				),
			);
			handleInfoChange({ search: '' });
		}
		if (e?.key === 'Backspace' && !info?.search?.length) {
			handleInfoChange({ selectedUsers: info?.selectedUsers?.slice(0, -1) });
		}
	};

	const handleAddMembers = async () => {
		if (info?.selectedUsers?.length === 0 || info?.btnLoading) {
			return;
		}
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
			const selectedUserWithAccess = info?.selectedUsers?.map((user) => ({
				...user,
				access: info?.accessType,
			}));
			updateNotesState({
				notesAccess: [...info?.membersWithAccess, ...selectedUserWithAccess],
			});
			handleInfoChange({
				selectedUsers: [],
				accessType: 'full',
				btnLoading: false,
				search: '',
				inputFocused: false,
			});
			message.success(response?.[1]?.message);
		} else {
			handleInfoChange({ btnLoading: false });
			message.error(response?.[1]?.message);
		}
	};

	const handleChangeAccess = async (userId, access) => {
		if (access === 'remove') {
			const response = await removeNotesAccess({
				pageId,
				userId,
			});
			if (response?.[0]) {
				message.success(response?.[1]?.message);
				const updatedMembersWithAccess = info?.membersWithAccess?.filter(
					(member) => member?.userId !== userId,
				);
				updateNotesState({ notesAccess: updatedMembersWithAccess });
			} else {
				message.error(response?.[1]?.message);
			}
		} else {
			const response = await changeNotesAccess({
				pageId,
				userPermissionInput: {
					userId,
					access,
				},
			});
			if (response?.[0]) {
				message.success(response?.[1]?.message);
				const updatedMembersWithAccess = info?.membersWithAccess?.map((member) =>
					member?.userId === userId ? { ...member, access } : member,
				);
				updateNotesState({
					notesAccess: updatedMembersWithAccess,
				});
			} else {
				message.error(response?.[1]?.message);
			}
		}
	};

	const handlePublishPage = useCallback(
		async ({ isPublished, slug, expiresAt }) => {
			handleInfoChange({ publishLoading: true });
			const [success, data] = await updatePage({
				pageId: pageId,
				input: {
					isPublished,
					...(slug && { slug }),
					...(expiresAt && { expiresAt }),
				},
			});
			if (success) {
				handleInfoChange({
					isPublished,
					slug,
					slugError: '',
					...(expiresAt && { expiresAt }),
					prevSlug: slug,
				});
			} else {
				if (data?.message?.includes('Slug already exists')) {
					handleInfoChange({
						slugError: 'Slug already exists',
					});
				} else {
					message.error(data?.message);
				}
			}
			handleInfoChange({ publishLoading: false });
		},
		[pageId],
	);

	const handleSlugChange = (e) => {
		const newSlug = e?.target?.value;
		let slug = slugify(newSlug, {
			lower: true,
			strict: true,
			trim: true,
		});
		if (newSlug.trim().endsWith('-')) {
			slug += '-';
		}

		handleInfoChange({ slug });

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		if (!slug || slug?.endsWith('-') || slug === info?.prevSlug) return;

		debounceRef.current = setTimeout(() => {
			handlePublishPage({ isPublished: true, slug });
		}, 500);
	};

	const handleCopyLink = () => {
		if (!info?.slug?.trim()) {
			message.error('Please enter a slug');
			return;
		}
		navigator.clipboard.writeText(`https://${workspace}.ve.ai/page/${info?.prevSlug}`);
		message.success('Link copied to clipboard');
	};

	const openDatePicker = () => {
		if (document.activeElement === dateInputRef.current) {
			dateInputRef.current.blur(); // Try to close it
		} else {
			if (dateInputRef.current?.showPicker) {
				dateInputRef.current.showPicker();
			} else {
				dateInputRef.current.focus(); // fallback for unsupported browsers
			}
		}
	};

	const handleDateChange = (e) => {
		const date = e?.target?.value;
		const unixDate = date ? moment(date).unix() : null;
		handleInfoChange({ expiresAt: unixDate });
		handlePublishPage({ isPublished: true, expiresAt: unixDate });
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
									<button
										className={
											'notes-nav-menu-item-share-dropdown-header-title-btn' +
											(!info?.isPublishOpen ? ' active' : '')
										}
										onClick={() =>
											handleInfoChange({
												isPublishOpen: false,
											})
										}
									>
										Share
									</button>{' '}
									<span className="divider" />
									<button
										className={
											'notes-nav-menu-item-share-dropdown-header-title-btn' +
											(info?.isPublishOpen ? ' active' : '')
										}
										onClick={() =>
											handleInfoChange({
												isPublishOpen: !info?.isPublishOpen,
											})
										}
									>
										Publish
									</button>
								</div>
							)}
							{/* <button
								className="notes-nav-menu-item-share-dropdown-header-copy-btn"
								onClick={handleCopyLink}
							>
								<Copy />
								Copy link
							</button> */}
						</div>
						{info?.isPublishOpen ? (
							<div className="notes-nav-menu-item-share-dropdown-body">
								{info?.isPublished ? (
									<>
										<div className={'url-input-wrapper'}>
											<div className="url-prefix">
												{workspace}.ve.ai/page/
											</div>
											<input
												type="text"
												name=""
												id=""
												className="url-input"
												value={info?.slug}
												onChange={handleSlugChange}
											/>
											{info?.slug &&
												!info?.slugError &&
												!info?.slug?.endsWith('-') && (
													<button
														className="url-input-copy-btn"
														onClick={handleCopyLink}
													>
														<Copy />
													</button>
												)}
										</div>
										{info?.slugError && (
											<div className="publish-screen-footer-error">
												{info?.slugError}
											</div>
										)}
										<div className="publish-screen-footer">
											<div className="publish-screen-footer-item">
												<span className="publish-screen-footer-item-label">
													Link expires
												</span>
												<div className="publish-screen-footer-item-input-wrapper">
													<input
														type="date"
														name=""
														id=""
														min={minDate}
														className={
															'publish-screen-footer-item-input' +
															(!info?.expiresAt ? ' not-set' : '')
														}
														ref={dateInputRef}
														onChange={handleDateChange}
														value={
															info?.expiresAt
																? moment
																		.unix(info?.expiresAt)
																		.format('YYYY-MM-DD')
																: ''
														}
													/>

													{!info?.expiresAt && (
														<span className="publish-screen-footer-item-input-label">
															Never
														</span>
													)}

													<button
														className="publish-screen-footer-item-input-btn"
														onClick={openDatePicker}
													>
														<CalendarSvg />
													</button>
												</div>
											</div>
											<div className="footer-btn-wrapper">
												<button
													className="footer-btn"
													disabled={info?.publishLoading}
													onClick={() =>
														handlePublishPage({ isPublished: false })
													}
												>
													Unpublish
												</button>
												<button
													className="footer-btn"
													disabled={
														!info?.slug?.trim() ||
														info?.slug?.endsWith('-')
													}
													onClick={() =>
														window.open(
															`https://${workspace}.ve.ai/page/${info?.prevSlug}`,
															'_blank',
														)
													}
												>
													View site
												</button>
											</div>
										</div>
									</>
								) : (
									<div className="publish-screen">
										<h2 className="publish-screen-title">Publish to web</h2>
										<button
											className="publish-screen-btn"
											disabled={!info?.slug?.trim()}
											onClick={() =>
												handlePublishPage({
													isPublished: true,
													slug: info?.slug,
													expiresAt: info?.expiresAt,
												})
											}
										>
											{info?.publishLoading ? 'Publishing...' : 'Publish'}
										</button>
									</div>
								)}
							</div>
						) : (
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
											onChange={(e) =>
												handleInfoChange({ search: e?.target?.value })
											}
											value={info?.search}
											onKeyDown={handleInputEnter}
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
									<>
										<div className="notes-nav-menu-item-share-dropdown-body-title">
											{info?.search?.length > 0
												? 'Not invited to page'
												: 'Suggested'}
										</div>
										<div className="notes-nav-menu-item-share-dropdown-body-select">
											{info?.tenantUserLoading ? (
												[...Array(3)].map((_, index) => (
													<div key={index}>
														<Skeleton
															color="var(--primary-font)"
															width="100%"
															height="38px"
															borderRadius="12px"
														/>
													</div>
												))
											) : info?.tenantUsers?.length > 0 ? (
												info?.tenantUsers
													?.filter(
														(user) =>
															user?.fullName
																?.toLowerCase()
																?.includes(
																	info?.search?.toLowerCase(),
																) ||
															user?.email
																?.toLowerCase()
																?.includes(
																	info?.search?.toLowerCase(),
																),
													)
													?.map((user) => (
														<div
															key={user?.userId}
															className="notes-nav-menu-item-share-dropdown-body-select-item cursor-pointer"
															onClick={() =>
																handleUserSelection(user)
															}
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
																	selectedUser?.userId ===
																	user?.userId,
															) && <Check width={16} height={16} />}
														</div>
													))
											) : (
												<span>No users found</span>
											)}
										</div>
									</>
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
													<AccessDropdown
														selectedAccess={member?.access}
														onChange={(value) =>
															handleChangeAccess(
																member?.userId,
																value,
															)
														}
													/>
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
						)}
					</div>
				}
				placement="bottomLeft"
				color="transparent"
				trigger="click"
				open={info.isOpen}
				arrow={false}
				onOpenChange={(open) => {
					if (!open) {
						handleInfoChange({ isOpen: false, isPublishOpen: false });
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
							<button
								className="notes-share-dropdown-access-tooltip-footer-button"
								onClick={() => {
									onChange('remove');
									handleInfoChange({ isOpen: false });
								}}
							>
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
