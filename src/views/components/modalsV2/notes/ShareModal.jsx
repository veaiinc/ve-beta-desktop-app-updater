import { memo, useContext, useEffect, useRef, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/notes/modals/shareModal.scss';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/Settings/CrossWhite.svg';
import AccessDropdown from '../../notes/AccessDropDown';
import { ReactComponent as Copy } from '../../../../assets/svg/ai_assistant/url.svg';
import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import jwtDecode from 'jwt-decode';
import { Tooltip } from 'antd';
import Context from '../../../../context/context';
import { message } from '../../../components/globalComponents/CustomToast';
import { ReactComponent as LockIcon } from '../../../../assets/svg/workspaceSettings/lock-big.svg';
import { ReactComponent as CalendarSvg } from '../../../../assets/svg/tasks/calendar.svg';
import moment from 'moment';
const tabs = [
	{ value: 'share', label: 'Share' },
	{ value: 'publish', label: 'Publish' },
];

let userId,
	activeWorkspaceId = null;
const today = new Date();
today.setDate(today.getDate() + 1);
const minDate = today.toISOString().split('T')[0];
const ShareModal = ({
	isOpen,
	onClose,
	allMembers,
	membersWithAccess,
	onActionClick,
	updateAccess,
	globalAccess,
	handleGlobalAccessUpdate,
	isPublished,
	slug,
	slugError,
	prevSlug,
	handleSlugChange,
	handlePublishPage,
	expiresAt,
	publishLoading,
}) => {
	const {
		profileInfo: { tennantSettingsData },
	} = useContext(Context);
	const dateInputRef = useRef(null);

	const [info, setInfo] = useState({
		activeTab: 'share',
		inputFocused: false,
		search: '',
		accessType: 'full',
		selectedMembers: [],
		btnLoading: false,
		globalAccessDropdown: false,
	});

	useEffect(() => {
		activeWorkspaceId = localStorage.getItem('workspaceId');
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		userId = user_id;
	}, []);

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleUserSelection = (user) => {
		if (info?.selectedMembers?.some((selectedUser) => selectedUser?.userId === user?.userId)) {
			handleInfoChange({
				selectedMembers: info?.selectedMembers?.filter(
					(selectedUser) => selectedUser?.userId !== user?.userId,
				),
			});
		} else {
			handleInfoChange({ selectedMembers: [...info?.selectedMembers, user] });
		}
	};

	const handleInputEnter = (e) => {
		if (e?.key === 'Enter') {
			const user = allMembers?.find(
				(user) =>
					user?.fullName?.toLowerCase()?.includes(info?.search?.toLowerCase()) ||
					user?.email?.toLowerCase()?.includes(info?.search?.toLowerCase()),
			);
			if (!user) return;
			handleUserSelection(user);
			handleInfoChange({ search: '' });
		}
		if (e?.key === 'Backspace' && !info?.search?.length) {
			handleInfoChange({ selectedMembers: info?.selectedMembers?.slice(0, -1) });
		}
	};

	const handleAddMembers = async () => {
		if (info?.selectedMembers?.length === 0 || info?.btnLoading) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			btnLoading: true,
		}));

		const response = await onActionClick(info?.selectedMembers, info?.accessType);

		if (response) {
			handleInfoChange({
				selectedMembers: [],
				accessType: 'full',
				btnLoading: false,
				search: '',
				inputFocused: false,
			});
		} else {
			handleInfoChange({ btnLoading: false });
		}
	};

	const filteredSuggestedMembers = allMembers?.filter(
		(user) =>
			user?.fullName?.toLowerCase()?.includes(info?.search?.toLowerCase()) ||
			user?.email?.toLowerCase()?.includes(info?.search?.toLowerCase()),
	);

	const handleCopyLink = () => {
		if (!slug?.trim()) {
			message.error('Please enter a slug');
			return;
		}
		if (tennantSettingsData?.customDomain) {
			navigator.clipboard.writeText(
				`https://${tennantSettingsData?.customDomain}/page/${prevSlug}`,
			);
		} else {
			navigator.clipboard.writeText(`https://${activeWorkspaceId}.ve.ai/page/${prevSlug}`);
		}
		message.success('Link copied to clipboard');
	};

	const handleCopyCurrentPageLink = () => {
		navigator.clipboard.writeText(window?.location?.href);
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

	const handleGlobalAccessChange = (isEnabled, access = 'view') => {
		if (globalAccess?.isEnabled === isEnabled && globalAccess?.access === access) {
			handleInfoChange({
				globalAccessDropdown: false,
			});
			return;
		}
		handleGlobalAccessUpdate({
			isEnabled,
			access,
		});
		handleInfoChange({
			globalAccessDropdown: false,
		});
	};

	const { businessName, logo_s3_500w_key: workspaceImage } = tennantSettingsData || {};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 50002,
				},
				overlay: {
					zIndex: 50000,
				},
			}}
		>
			<div className="notes-share-modal">
				<div className="notes-share-modal-header">
					<div className="notes-share-modal-header-left">
						{info?.inputFocused ? (
							<div
								className="invite-header"
								onClick={() =>
									handleInfoChange({
										inputFocused: false,
										selectedMembers: [],
									})
								}
							>
								<ChevronRightThinSvg />
								Invite
							</div>
						) : (
							tabs?.map((tab) => (
								<div
									className="notes-share-tab-wrapper"
									onClick={() => handleInfoChange({ activeTab: tab?.value })}
									key={tab?.value}
								>
									<div className="tab-label">{tab?.label}</div>
									<div
										className={`tab-indicator ${
											info?.activeTab === tab.value && `active`
										} `}
									></div>
								</div>
							))
						)}
					</div>
					<CrossWhite onClick={onClose} className="cursor-pointer" />
				</div>
				{info?.activeTab === 'share' ? (
					<div className="notes-share-modal-body">
						<div className="note-share-input-area">
							<div className="input-container">
								{info?.selectedMembers?.length > 0 && (
									<div className="selected-user-container">
										<div className="selected-user-wrapper">
											{info?.selectedMembers?.map((user) => (
												<div
													className="selected-user-list-item"
													key={user?.userId}
												>
													<div className="selected-user-avatar">
														{user?.fullName?.charAt(0)}
													</div>
													<div className="selected-user-name">
														{user?.fullName}
													</div>
													<CrossWhite
														onClick={() => handleUserSelection(user)}
														className="cursor-pointer"
													/>
												</div>
											))}
										</div>
										<AccessDropdown
											selectedAccess={info?.accessType}
											onChange={(value) =>
												handleInfoChange({ accessType: value })
											}
											showRemoveButton={false}
										/>
									</div>
								)}
								<input
									type="text"
									className="invite-user-input"
									placeholder="Enter Email, separate by commas"
									onFocus={() => handleInfoChange({ inputFocused: true })}
									onChange={(e) => handleInfoChange({ search: e?.target?.value })}
									value={info?.search}
									onKeyDown={handleInputEnter}
								/>
							</div>
							<button
								className="notes-share-invite-btn"
								disabled={info?.btnLoading}
								onClick={handleAddMembers}
							>
								{!info?.btnLoading ? 'Invite' : 'Inviting...'}
							</button>
						</div>

						<div className="note-share-access-control-container">
							{!info?.inputFocused ? (
								<>
									<div className="access-control-wrapper">
										<div className="access-control-heading">Access Control</div>
										<div className="access-control-list-item-wrapper">
											{membersWithAccess?.length > 0
												? membersWithAccess?.map((member) => (
														<div
															className="access-control-list-item"
															key={member?.userId}
														>
															<div className="access-control-avatar">
																{member?.fullName?.charAt(0)}
															</div>
															<div className="access-control-name-wrapper">
																<div className="access-control-name">
																	{member?.fullName}
																	{userId === member?.userId && (
																		<span className="you-indicator">
																			{' '}
																			(You)
																		</span>
																	)}
																</div>
																<div className="access-control-email">
																	{member?.email}
																</div>
															</div>
															<AccessDropdown
																disabled={userId === member?.userId}
																selectedAccess={member?.access}
																onChange={(value) =>
																	updateAccess(
																		member?.userId,
																		value,
																	)
																}
															/>
														</div>
												  ))
												: null}
										</div>
									</div>
									<div className="access-control-wrapper">
										<div className="access-control-heading">General access</div>
										<div className="access-control-list-item-wrapper">
											<Tooltip
												arrow={false}
												placement="bottomLeft"
												color="transparent"
												overlayStyle={{
													minWidth: '256px',
													zIndex: 50003,
												}}
												trigger="click"
												open={info?.globalAccessDropdown}
												onOpenChange={(open) => {
													if (!open) {
														handleInfoChange({
															globalAccessDropdown: false,
														});
													}
												}}
												title={
													<div className="general-access-drop-dropdown">
														<div
															className="general-access-item"
															onClick={() =>
																handleGlobalAccessChange(false)
															}
														>
															Only people invited
														</div>
														<div
															className="general-access-item"
															onClick={() =>
																handleGlobalAccessChange(
																	true,
																	globalAccess?.access,
																)
															}
														>
															{businessName
																? `Everyone at ${businessName}`
																: `Everyone in this workspace`}
														</div>
													</div>
												}
											>
												<div
													className="access-control-list-item"
													onClick={() =>
														handleInfoChange({
															globalAccessDropdown:
																!info?.globalAccessDropdown,
														})
													}
												>
													<div className="access-control-avatar no-border">
														{globalAccess?.isEnabled ? (
															<img
																className="workspaceLogo"
																src={workspaceImage}
																alt={businessName}
															/>
														) : (
															<LockIcon width={16} height={16} />
														)}
													</div>

													<div className="general-access-selected">
														{globalAccess?.isEnabled
															? businessName
																? `Everyone at ${businessName}`
																: `Everyone in this workspace`
															: 'Only people invited'}
														<ChevronRightThinSvg
															className={`${
																info?.globalAccessDropdown &&
																`global-dropdown-open`
															}`}
														/>
													</div>

													{globalAccess?.isEnabled && (
														<AccessDropdown
															selectedAccess={globalAccess?.access}
															showRemoveButton={false}
															onChange={(value) =>
																handleGlobalAccessChange(
																	true,
																	value,
																)
															}
														/>
													)}
												</div>
											</Tooltip>
										</div>
									</div>
									<button
										className="notes-access-copy-link-btn"
										onClick={handleCopyCurrentPageLink}
									>
										<Copy className="notes-share-copy-svg" />
										Copy Link
									</button>
								</>
							) : (
								<div className="access-control-wrapper suggested-wrapper">
									<div className="access-control-heading">Suggested</div>
									<div className="access-control-list-item-wrapper">
										{filteredSuggestedMembers?.length > 0 ? (
											filteredSuggestedMembers?.map((user) => (
												<div
													className="access-control-list-item"
													onClick={() => handleUserSelection(user)}
													key={user?.userId}
												>
													<div className="access-control-avatar">
														{user?.fullName?.charAt(0)}
													</div>
													<div className="access-control-name-wrapper">
														<div className="access-control-name">
															{user?.fullName}
															{/* <span className="you-indicator"></span> */}
														</div>
														<div className="access-control-email">
															{user?.email}
														</div>
													</div>

													{info?.selectedMembers?.some(
														(selectedUser) =>
															selectedUser?.userId === user?.userId,
													) ? (
														<div className="selection-indicator active">
															<Check />
														</div>
													) : (
														<div className="selection-indicator" />
													)}
												</div>
											))
										) : (
											<span className="no-user-found">No user found</span>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="notes-share-modal-body">
						{isPublished ? (
							<>
								<div className="link-container">
									<div className="link-container-wrapper">
										<div className="publish-link-input-container">
											<div className="domain-section">
												{tennantSettingsData?.customDomain
													? `${tennantSettingsData?.customDomain}/page/`
													: `${activeWorkspaceId}.ve.ai/page/`}
											</div>
											<input
												type="text"
												className="slug-input"
												value={slug}
												onChange={handleSlugChange}
											/>
										</div>
										<button
											className="publish-copy-link-button"
											onClick={handleCopyLink}
											disabled={!slug || slugError || slug?.endsWith('-')}
										>
											<Copy className="notes-share-copy-svg" />
										</button>
									</div>
									{slugError && (
										<div className="publish-screen-footer-error">
											{slugError}
										</div>
									)}
								</div>

								<div className="publish-options-wrapper">
									<div className="publish-options-heading">Link expires</div>
									<div className="publish-screen-footer-item-input-wrapper">
										<input
											type="date"
											name=""
											id=""
											min={minDate}
											className={
												'publish-screen-footer-item-input' +
												(!expiresAt ? ' not-set' : '')
											}
											ref={dateInputRef}
											onChange={handleDateChange}
											value={
												expiresAt
													? moment.unix(expiresAt).format('YYYY-MM-DD')
													: ''
											}
										/>
										{!expiresAt && (
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
								<div className="publish-button-wrapper">
									<button
										className="unpublish-btn"
										disabled={publishLoading}
										onClick={() =>
											handlePublishPage({
												isPublished: false,
											})
										}
									>
										Unpublish
									</button>
									<button
										className="view-site-btn"
										disabled={!slug?.trim() || slug?.endsWith('-')}
										onClick={() =>
											window.open(
												`https://${
													tennantSettingsData?.customDomain
														? tennantSettingsData?.customDomain
														: `${activeWorkspaceId}.ve.ai`
												}/page/${prevSlug}`,
												'_blank',
											)
										}
									>
										View site
									</button>
								</div>
							</>
						) : (
							<>
								<div className="publish-to-web-wrapper">Publish to web</div>
								<button
									className="publish-to-web-btn"
									onClick={() =>
										handlePublishPage({
											isPublished: true,
											slug: slug,
											expiresAt: expiresAt,
										})
									}
								>
									{publishLoading ? 'Publishing...' : 'Publish'}
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(ShareModal);
