import { memo, useCallback, useContext } from 'react';
import '../../../assets/scss/sidebar.scss';
import {
	stableNavigationItems,
	betaNavigationItems,
	internalNavigationItems
} from './sidebarindex.js';

import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosingPrimary.svg';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Cropper from 'react-easy-crop';
import CreditsLeftSvg from './chatHistory/CreditsLeftSvg';
import { Tooltip } from 'antd';
import ObjectID from 'bson-objectid';

const navigationItemsMap = {
	beta: betaNavigationItems,
	internal: internalNavigationItems,
	stable: stableNavigationItems,
	suspended: betaNavigationItems
};

const ClosedSidebar = ({ onIconClick, isEarlyAccessPage }) => {
	const navigate = useNavigate();
	const { workspaceMode } = useWorkspaceMode();
	const location = useLocation();

	const {
		profileInfo: { userDetailsData },
		subscriptionInfo: { currentPlan }
	} = useContext(Context);

	const sidebarNavigationItems = navigationItemsMap[workspaceMode];

	const getInitials = (firstName, lastName) => {
		const firstNameInitial = firstName ? firstName?.charAt(0) : '-';
		const lastNameInitial = lastName ? lastName?.charAt(0) : '';
		const initials = `${firstNameInitial?.toUpperCase()}${lastNameInitial?.toUpperCase()}`;
		return initials;
	};

	const handleNewChat = () => {
		// For stable workspaceMode, redirecting to /home, check stableNavigationItems
		if (workspaceMode === 'stable') {
			navigate('/home');
			return;
		}
		const sessionId = ObjectID()?.toString();
		navigate(`/chat/${sessionId}`);
		updateStateValues({
			currentChatData: null
		});
	};

	const onOptionsClick = (item) => {
		if (item?.name === 'New Chat') {
			handleNewChat();
		} else {
			navigate(item?.route);
		}
	};

	const isExactPathMatch = useCallback(
		(route) => {
			// strip trailing slash
			const current = location.pathname.replace(/\/$/, '');
			const target = route.replace(/\/$/, '');

			// decide once: in “stable” workspace new‐chat = /home, otherwise /chat
			const chatRoute = workspaceMode === 'stable' ? '/home' : '/chat';

			if (target === '/agents') {
				// agents nav should also highlight on /ai-assistant
				return current.includes('/agents') || current.includes('/ai-assistant');
			}

			if (target === '/chat' || target === 'New Chat') {
				// whenever you ask “does /chat match?”, actually compare to our dynamic chatRoute
				return current?.includes(chatRoute);
			}

			// all other routes just match exact
			return current === target;
		},
		[location.pathname, workspaceMode]
	);

	const profileSelected = () => {
		localStorage.setItem('showSettingsSidebar', true);
		navigate('/settings/my-profile');
		onIconClick();
	};

	return (
		<div className="sidebar-closing" onClick={() => onIconClick()}>
			<div className="topContainerClosed">
				<SidebarClosingSvg onClick={() => onIconClick()} />
				{!isEarlyAccessPage && (
					<div className="closedIconsContainer">
						{sidebarNavigationItems?.map((item, index) => (
							<Tooltip
								key={index}
								title={<div className="tooltip-text">{item?.name}</div>}
								placement="right"
								arrow={false}
								color={'transparent'}
							>
								<div
									className={`closed-sidebar-item ${
										isExactPathMatch(item.route) ? 'active' : ''
									}`}
									onClick={(e) => {
										e.stopPropagation();
										onOptionsClick(item);
									}}
									style={{ cursor: 'pointer' }}
								>
									<item.icon
										fill={
											item.name === 'Notes' ||
											item.name === 'Calendar' ||
											item.name === 'Tasks' ||
											item.name === 'Contacts' ||
											item.name === 'Automations' ||
											item.name === 'Database'
												? 'none'
												: 'var(--primary-font)'
										}
										style={{
											stroke:
												item.name === 'Notes' ||
												item.name === 'Calendar' ||
												item.name === 'Tasks' ||
												item.name === 'Contacts' ||
												item.name === 'Automations' ||
												item.name === 'Database' ||
												item.name === 'Home' ||
												item.name === 'Database' ||
												item.name === 'Home'
													? 'var(--primary-font)'
													: 'none'
										}}
									/>
								</div>
							</Tooltip>
						))}
					</div>
				)}
			</div>
			<div className="bottomContainerClosed">
				<Tooltip
					title={
						<div className="tooltip-text">
							{currentPlan?.totalAiCreditLimit - currentPlan?.totalAiCreditUsed}{' '}
							Credits Left
						</div>
					}
					placement="right"
					arrow={false}
					color={'transparent'}
				>
					<div style={{ marginBottom: '10px' }}>
						<CreditsLeftSvg
							totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
							totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
						/>
					</div>
				</Tooltip>
				<Tooltip
					title={<div className="tooltip-text">My profile</div>}
					placement="right"
					arrow={false}
					color={'transparent'}
				>
					<div
						className="closedSidebarProfile"
						onClick={profileSelected}
						style={{
							cursor: 'pointer'
						}}
					>
						{userDetailsData?.logoURL ? (
							<div className="crop-container">
								<Cropper
									image={userDetailsData?.logoURL} // Image URL to crop
									crop={userDetailsData?.cropSettings?.crop}
									zoom={userDetailsData?.cropSettings?.zoom}
									showGrid={false}
									onCropChange={(e) => ''}
									onCropComplete={(e) => ''}
									onZoomChange={(e) => ''}
								/>
							</div>
						) : (
							<div
								className="noImageText"
								style={{
									background: userDetailsData?.cropSettings?.profileDpColor || '',
									fontSize: '12px'
								}}
							>
								{getInitials(userDetailsData?.firstName, userDetailsData?.lastName)}
							</div>
						)}
					</div>
				</Tooltip>
			</div>
		</div>
	);
};

export default memo(ClosedSidebar);
