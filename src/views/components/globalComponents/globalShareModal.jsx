import { memo, useEffect } from 'react';
import ReactModal from '../modalsV2/index';
import { ReactComponent as CrossWhite } from '../../../assets/svg/Settings/CrossWhite.svg';
import AccessDropdown from '../notes/AccessDropDown';
import { ReactComponent as Copy } from '../../../assets/svg/ai_assistant/url.svg';
import '../../../assets/scss/notes/modals/shareModal.scss';
import { ReactComponent as Check } from '../../../assets/svg/tasks/checkmark.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { Tooltip } from 'antd';
import { ReactComponent as LockIconSvg } from '../../../assets/svg/workspaceSettings/lock-big.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import moment from 'moment';

const ShareModal = ({
	// Modal control
	isOpen,
	onClose,

	// Tabs configuration
	tabs = [],
	activeTab,
	onTabChange,
	showShareTab = true,
	showPublishTab = false,

	// Share tab data
	selectedMembers = [],
	onMemberSelect,
	onMemberRemove,
	searchValue = '',
	onSearchChange,
	onSearchFocus,
	isInputFocused = false,
	onInputFocusChange,
	inviteButtonText = 'Invite',
	isInviteLoading = false,
	onInviteClick,
	accessType = 'full',
	onAccessTypeChange,

	// Members list
	membersWithAccess = [],
	onAccessChange,
	currentUserId,
	showAccessControl = true,

	// Global access
	showGlobalAccess = false,
	globalAccess = null,
	onGlobalAccessChange,
	isGlobalAccessDropdownOpen = false,
	onGlobalAccessDropdownChange,
	workspaceImage,
	businessName,

	// Copy link
	showCopyLink = false,
	onCopyLink,
	copyLinkText = 'Copy Link',

	// Handle invite section
	showInviteSection = false,

	// Publish tab
	isPublished = false,
	slug = '',
	onSlugChange,
	slugError = '',
	domain = '',
	onPublishClick,
	onUnpublishClick,
	onViewSiteClick,
	publishButtonText = 'Publish',
	unpublishButtonText = 'Unpublish',
	viewSiteButtonText = 'View Site',
	isPublishLoading = false,

	// Expiration
	showExpiration = false,
	expiresAt = null,
	onExpirationChange,
	onDatePickerClick,
	dateInputRef,
	minDate,

	// Custom styles
	customStyles = {},
	customClassNames = {},

	// New customization props
	// Search/Filter
	filteredMembers = [],
	onSearchKeyDown,

	// Custom Access Types
	accessTypes = ['full', 'view'],
	accessTypeLabels = {},

	// Custom Validation
	validateSlug,
	validateMember,

	// Loading States
	isLoading = false,
	loadingText = 'Loading...',

	// Error Handling
	onError,
	errorMessage,

	// Custom Icons
	customIcons = {
		close: null,
		copy: null,
		check: null,
		chevron: null,
		lock: null,
		calendar: null,
	},

	// Translations
	translations = {
		invite: 'Invite',
		accessControl: 'Access Control',
		generalAccess: 'General access',
		publish: 'Publish',
		unpublish: 'Unpublish',
		viewSite: 'View Site',
		linkExpires: 'Link expires',
		never: 'Never',
		onlyPeopleInvited: 'Only people invited',
		everyoneInWorkspace: 'Everyone in this workspace',
		everyoneAtBusiness: 'Everyone at {businessName}',
		noUserFound: 'No user found',
		publishToWeb: 'Publish to web',
		enterEmail: 'Enter Email, separate by commas',
		suggested: 'Suggested',
		you: '(You)',
	},

	// Modal Size
	modalWidth = '',
	modalHeight = 'auto',
}) => {
	// Get custom icons or use defaults
	const CloseIcon = customIcons.close || CrossWhite;
	const CopyIcon = customIcons.copy || Copy;
	const CheckIcon = customIcons.check || Check;
	const ChevronIcon = customIcons.chevron || ChevronRightThinSvg;
	const LockIcon = customIcons.lock || LockIconSvg;
	const CalendarIcon = customIcons.calendar || CalendarSvg;

	// Get custom class names or use defaults
	const getClassName = (baseClass) => {
		return customClassNames[baseClass] || baseClass;
	};

	// Get translation with business name replacement
	const getTranslation = (key) => {
		const translation = translations[key] || key;
		return translation.replace('{businessName}', businessName || '');
	};

	// Ensure active tab is valid based on visibility
	useEffect(() => {
		if (!showShareTab && activeTab === 'share') {
			onTabChange('publish');
		} else if (!showPublishTab && activeTab === 'publish') {
			onTabChange('share');
		}
	}, [showShareTab, showPublishTab, activeTab]);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 50002,
					width: modalWidth,
					height: modalHeight,
					...customStyles.content,
				},
				overlay: {
					zIndex: 50000,
					...customStyles.overlay,
				},
			}}
		>
			<div className={getClassName('notes-share-modal')}>
				<div className={getClassName('notes-share-modal-header')}>
					<div className={getClassName('notes-share-modal-header-left')}>
						{isInputFocused ? (
							<div
								className={getClassName('invite-header')}
								onClick={() => onInputFocusChange(false)}
							>
								<ChevronIcon />
								{getTranslation('invite')}
							</div>
						) : (
							tabs
								?.filter(
									(tab) =>
										(tab.value === 'share' && showShareTab) ||
										(tab.value === 'publish' && showPublishTab),
								)
								.map((tab) => (
									<div
										className={getClassName('notes-share-tab-wrapper')}
										onClick={() => onTabChange(tab?.value)}
										key={tab?.value}
									>
										<div className={getClassName('tab-label')}>
											{tab?.label}
										</div>
										<div
											className={`${getClassName('tab-indicator')} ${
												activeTab === tab.value && `active`
											} `}
										></div>
									</div>
								))
						)}
					</div>
					<CloseIcon onClick={onClose} className="cursor-pointer" />
				</div>

				{isLoading ? (
					<div className={getClassName('notes-share-modal-loading')}>{loadingText}</div>
				) : (
					<>
						{activeTab === 'share' && showShareTab ? (
							<div className={getClassName('notes-share-modal-body')}>
								{showInviteSection && (
									<div className={getClassName('note-share-input-area')}>
										<div className={getClassName('input-container')}>
											{selectedMembers?.length > 0 && (
												<div
													className={getClassName(
														'selected-user-container',
													)}
												>
													<div
														className={getClassName(
															'selected-user-wrapper',
														)}
													>
														{selectedMembers?.map((user) => (
															<div
																className={getClassName(
																	'selected-user-list-item',
																)}
																key={user?.userId}
															>
																<div
																	className={getClassName(
																		'selected-user-avatar',
																	)}
																>
																	{user?.fullName?.charAt(0)}
																</div>
																<div
																	className={getClassName(
																		'selected-user-name',
																	)}
																>
																	{user?.fullName}
																</div>
																<CloseIcon
																	onClick={() =>
																		onMemberRemove(user)
																	}
																	className="cursor-pointer"
																/>
															</div>
														))}
													</div>
													<AccessDropdown
														selectedAccess={accessType}
														onChange={onAccessTypeChange}
														showRemoveButton={false}
														accessTypes={accessTypes}
														accessTypeLabels={accessTypeLabels}
													/>
												</div>
											)}
											<input
												type="text"
												className={getClassName('invite-user-input')}
												placeholder={getTranslation('enterEmail')}
												onFocus={() => onSearchFocus()}
												onChange={(e) => onSearchChange(e?.target?.value)}
												onKeyDown={onSearchKeyDown}
												value={searchValue}
											/>
										</div>
										<button
											className={getClassName('notes-share-invite-btn')}
											disabled={isInviteLoading}
											onClick={onInviteClick}
										>
											{!isInviteLoading ? inviteButtonText : 'Inviting...'}
										</button>
									</div>
								)}

								<div
									className={getClassName('note-share-access-control-container')}
								>
									{!isInputFocused ? (
										<>
											{showAccessControl && membersWithAccess?.length > 0 && (
												<div
													className={getClassName(
														'access-control-wrapper',
													)}
												>
													<div
														className={getClassName(
															'access-control-heading',
														)}
													>
														{getTranslation('accessControl')}
													</div>
													<div
														className={getClassName(
															'access-control-list-item-wrapper',
														)}
													>
														{membersWithAccess?.map((member) => (
															<div
																className={getClassName(
																	'access-control-list-item',
																)}
																key={member?.userId}
															>
																<div
																	className={getClassName(
																		'access-control-avatar',
																	)}
																>
																	{member?.fullName?.charAt(0)}
																</div>
																<div
																	className={getClassName(
																		'access-control-name-wrapper',
																	)}
																>
																	<div
																		className={getClassName(
																			'access-control-name',
																		)}
																	>
																		{member?.fullName}
																		{currentUserId ===
																			member?.userId && (
																			<span
																				className={getClassName(
																					'you-indicator',
																				)}
																			>
																				{' '}
																				{getTranslation(
																					'you',
																				)}
																			</span>
																		)}
																	</div>
																	<div
																		className={getClassName(
																			'access-control-email',
																		)}
																	>
																		{member?.email}
																	</div>
																</div>
																<AccessDropdown
																	disabled={
																		currentUserId ===
																		member?.userId
																	}
																	selectedAccess={member?.access}
																	onChange={(value) =>
																		onAccessChange(
																			member?.userId,
																			value,
																		)
																	}
																	accessTypes={accessTypes}
																	accessTypeLabels={
																		accessTypeLabels
																	}
																/>
															</div>
														))}
													</div>
												</div>
											)}

											{showGlobalAccess && (
												<div
													className={getClassName(
														'access-control-wrapper',
													)}
												>
													<div
														className={getClassName(
															'access-control-heading',
														)}
													>
														{getTranslation('generalAccess')}
													</div>
													<div
														className={getClassName(
															'access-control-list-item-wrapper',
														)}
													>
														<Tooltip
															arrow={false}
															placement="bottomLeft"
															color="transparent"
															overlayStyle={{
																minWidth: '256px',
																zIndex: 50003,
															}}
															trigger="click"
															open={isGlobalAccessDropdownOpen}
															onOpenChange={
																onGlobalAccessDropdownChange
															}
															title={
																<div
																	className={getClassName(
																		'general-access-drop-dropdown',
																	)}
																>
																	<div
																		className={getClassName(
																			'general-access-item',
																		)}
																		onClick={() =>
																			onGlobalAccessChange(
																				false,
																			)
																		}
																	>
																		{getTranslation(
																			'onlyPeopleInvited',
																		)}
																	</div>
																	<div
																		className={getClassName(
																			'general-access-item',
																		)}
																		onClick={() =>
																			onGlobalAccessChange(
																				true,
																				globalAccess?.access,
																			)
																		}
																	>
																		{getTranslation(
																			businessName
																				? 'everyoneAtBusiness'
																				: 'everyoneInWorkspace',
																		)}
																	</div>
																</div>
															}
														>
															<div
																className={getClassName(
																	'access-control-list-item',
																)}
																onClick={() =>
																	onGlobalAccessDropdownChange(
																		!isGlobalAccessDropdownOpen,
																	)
																}
															>
																<div
																	className={getClassName(
																		'access-control-avatar no-border',
																	)}
																>
																	{globalAccess?.isEnabled ? (
																		<img
																			className={getClassName(
																				'workspaceLogo',
																			)}
																			src={workspaceImage}
																			alt={businessName}
																		/>
																	) : (
																		<LockIcon
																			width={16}
																			height={16}
																		/>
																	)}
																</div>

																<div
																	className={getClassName(
																		'general-access-selected',
																	)}
																>
																	{globalAccess?.isEnabled
																		? getTranslation(
																				businessName
																					? 'everyoneAtBusiness'
																					: 'everyoneInWorkspace',
																		  )
																		: getTranslation(
																				'onlyPeopleInvited',
																		  )}
																	<ChevronIcon
																		className={`${
																			isGlobalAccessDropdownOpen &&
																			`global-dropdown-open`
																		}`}
																	/>
																</div>

																{globalAccess?.isEnabled && (
																	<AccessDropdown
																		selectedAccess={
																			globalAccess?.access
																		}
																		showRemoveButton={false}
																		onChange={(value) =>
																			onGlobalAccessChange(
																				true,
																				value,
																			)
																		}
																		accessTypes={accessTypes}
																		accessTypeLabels={
																			accessTypeLabels
																		}
																	/>
																)}
															</div>
														</Tooltip>
													</div>
												</div>
											)}

											{showCopyLink && (
												<button
													className={getClassName(
														'notes-access-copy-link-btn',
													)}
													onClick={onCopyLink}
												>
													<CopyIcon
														className={getClassName(
															'notes-share-copy-svg',
														)}
													/>
													{copyLinkText}
												</button>
											)}
										</>
									) : (
										<div
											className={getClassName(
												'access-control-wrapper suggested-wrapper',
											)}
										>
											<div className={getClassName('access-control-heading')}>
												{getTranslation('suggested')}
											</div>
											<div
												className={getClassName(
													'access-control-list-item-wrapper',
												)}
											>
												{filteredMembers?.length > 0 ? (
													filteredMembers?.map((user) => (
														<div
															className={getClassName(
																'access-control-list-item',
															)}
															onClick={() => onMemberSelect(user)}
															key={user?.userId}
														>
															<div
																className={getClassName(
																	'access-control-avatar',
																)}
															>
																{user?.fullName?.charAt(0)}
															</div>
															<div
																className={getClassName(
																	'access-control-name-wrapper',
																)}
															>
																<div
																	className={getClassName(
																		'access-control-name',
																	)}
																>
																	{user?.fullName}
																</div>
																<div
																	className={getClassName(
																		'access-control-email',
																	)}
																>
																	{user?.email}
																</div>
															</div>

															{selectedMembers?.some(
																(selectedUser) =>
																	selectedUser?.userId ===
																	user?.userId,
															) ? (
																<div
																	className={getClassName(
																		'selection-indicator active',
																	)}
																>
																	<CheckIcon />
																</div>
															) : (
																<div
																	className={getClassName(
																		'selection-indicator',
																	)}
																/>
															)}
														</div>
													))
												) : (
													<span className={getClassName('no-user-found')}>
														{getTranslation('noUserFound')}
													</span>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						) : showPublishTab ? (
							<div className={getClassName('notes-share-modal-body')}>
								{isPublished ? (
									<>
										<div className={getClassName('link-container')}>
											<div className={getClassName('link-container-wrapper')}>
												<div
													className={getClassName(
														'publish-link-input-container',
													)}
												>
													<div className={getClassName('domain-section')}>
														{domain}
													</div>
													<input
														type="text"
														className={getClassName('slug-input')}
														value={slug}
														onChange={onSlugChange}
													/>
												</div>
												<button
													className={getClassName(
														'publish-copy-link-button',
													)}
													onClick={onCopyLink}
													disabled={
														!slug || slugError || slug?.endsWith('-')
													}
												>
													<CopyIcon
														className={getClassName(
															'notes-share-copy-svg',
														)}
													/>
												</button>
											</div>
											{slugError && (
												<div
													className={getClassName(
														'publish-screen-footer-error',
													)}
												>
													{slugError}
												</div>
											)}
										</div>

										{showExpiration && (
											<div
												className={getClassName('publish-options-wrapper')}
											>
												<div
													className={getClassName(
														'publish-options-heading',
													)}
												>
													{getTranslation('linkExpires')}
												</div>
												<div
													className={getClassName(
														'publish-screen-footer-item-input-wrapper',
													)}
												>
													<input
														type="date"
														min={minDate}
														className={`${getClassName(
															'publish-screen-footer-item-input',
														)} ${!expiresAt ? ' not-set' : ''}`}
														ref={dateInputRef}
														onChange={onExpirationChange}
														value={
															expiresAt
																? moment
																		.unix(expiresAt)
																		.format('YYYY-MM-DD')
																: ''
														}
													/>
													{!expiresAt && (
														<span
															className={getClassName(
																'publish-screen-footer-item-input-label',
															)}
														>
															{getTranslation('never')}
														</span>
													)}
													<button
														className={getClassName(
															'publish-screen-footer-item-input-btn',
														)}
														onClick={onDatePickerClick}
													>
														<CalendarIcon />
													</button>
												</div>
											</div>
										)}

										<div className={getClassName('publish-button-wrapper')}>
											<button
												className={getClassName('unpublish-btn')}
												disabled={isPublishLoading}
												onClick={onUnpublishClick}
											>
												{unpublishButtonText}
											</button>
											<button
												className={getClassName('view-site-btn')}
												disabled={!slug?.trim() || slug?.endsWith('-')}
												onClick={onViewSiteClick}
											>
												{viewSiteButtonText}
											</button>
										</div>
									</>
								) : (
									<>
										<div className={getClassName('publish-to-web-wrapper')}>
											{getTranslation('publishToWeb')}
										</div>
										<button
											className={getClassName('publish-to-web-btn')}
											onClick={onPublishClick}
										>
											{isPublishLoading ? 'Publishing...' : publishButtonText}
										</button>
									</>
								)}
							</div>
						) : null}
					</>
				)}

				{errorMessage && (
					<div className={getClassName('notes-share-modal-error')}>{errorMessage}</div>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(ShareModal);
