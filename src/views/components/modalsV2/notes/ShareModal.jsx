import { memo, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/notes/modals/shareModal.scss';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/Settings/CrossWhite.svg';
import AccessDropdown from '../../notes/AccessDropDown';
import { ReactComponent as Copy } from '../../../../assets/svg/ai_assistant/url.svg';
import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import jwtDecode from 'jwt-decode';
const tabs = [
	{ value: 'share', label: 'Share' },
	{ value: 'publish', label: 'Publish' },
];

let userId = null;

const ShareModal = ({
	isOpen,
	onClose,
	allMembers,
	membersWithAccess,
	onActionClick,
	updateAccess,
}) => {
	const [info, setInfo] = useState({
		activeTab: 'share',
		inputFocused: false,
		search: '',
		accessType: 'full',
		selectedMembers: [],
		btnLoading: false,
	});

	useEffect(() => {
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

	return (
		<ReactModal
			isOpen={isOpen}
			// closeModal={info?.isLoading ? null : closeModal}
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
					<CrossWhite />
				</div>
				{info?.activeTab === 'share' ? (
					<div className="notes-share-modal-body">
						<div className="note-share-input-area">
							<div className="input-container">
								{info?.selectedMembers?.length > 0 && (
									<div className="selected-user-container">
										<div className="selected-user-wrapper">
											{info?.selectedMembers?.map((user) => (
												<div className="selected-user-list-item">
													<div className="selected-user-avatar">
														{user?.fullName?.charAt(0)}
													</div>
													<div className="selected-user-name">
														{user?.fullName}
													</div>
													<CrossWhite
														onClick={() => handleUserSelection(user)}
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
														<div className="access-control-list-item">
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
											<div className="access-control-list-item">
												<div className="access-control-avatar"></div>
												<div className="access-control-name-wrapper">
													<div className="access-control-name">
														Sabith
														<span className="you-indicator">
															{' '}
															(You)
														</span>
													</div>
													<div className="access-control-email">
														sabith@gmail.com
													</div>
												</div>
												<AccessDropdown selectedAccess={'view'} />
											</div>
										</div>
									</div>
									<button className="notes-access-copy-link-btn">
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
						<>
							<div className="link-container">
								<div className="publish-link-input-container">
									<div className="domain-section">sabith.ve.ai/page/</div>
									<input type="text" className="slug-input" />
								</div>
								<button className="publish-copy-link-button">
									<Copy className="notes-share-copy-svg" />
								</button>
							</div>
							<div className="publish-options-wrapper">
								<div className="publish-options-heading">Link expires</div>
								<div className="optionSelector"></div>
							</div>
							<div className="publish-button-wrapper">
								<button className="unpublish-btn">Unpublish</button>
								<button className="view-site-btn">View site</button>
							</div>
						</>
						{/* <>
							<div className="publish-to-web-wrapper">Publish to web</div>
							<button className="publish-to-web-btn">Publish</button>
						</> */}
					</div>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(ShareModal);
