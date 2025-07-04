import { memo, useContext } from 'react';
import '../../../assets/scss/sidebar.scss';
import {
	stableNavigationItems,
	betaNavigationItems,
	internalNavigationItems,
} from './sidebarindex.js';

import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Cropper from 'react-easy-crop';
import CreditsLeftSvg from './chatHistory/CreditsLeftSvg';
import { Tooltip } from 'antd';
import ObjectID from 'bson-objectid';

const navigationItemsMap = {
	beta: betaNavigationItems,
	internal: internalNavigationItems,
	stable: stableNavigationItems,
};

const ClosedSidebar = ({ onIconClick, isEarlyAccessPage }) => {
	const navigate = useNavigate();
	const { workspaceMode } = useWorkspaceMode();
	const {
		profileInfo: { userDetailsData },
		subscriptionInfo: { currentPlan },
	} = useContext(Context);

	const sidebarNavigationItems = navigationItemsMap[workspaceMode];

	const getInitials = (firstName, lastName) => {
		const firstNameInitial = firstName ? firstName?.charAt(0) : '-';
		const lastNameInitial = lastName ? lastName?.charAt(0) : '';
		const initials = `${firstNameInitial?.toUpperCase()}${lastNameInitial?.toUpperCase()}`;
		return initials;
	};

	const onOptionsClick = (item) => {
		if (item?.name === 'New Chat') {
			const sessionId = ObjectID()?.toString();
			navigate(`/chat/${sessionId}`);
		} else {
			navigate(item?.route);
		}
	};
	return (
		<div className="sidebar-closing" onClick={() => onIconClick()}>
			<div className="topContainerClosed">
				<SidebarClosingSvg onClick={() => onIconClick()} />
				{!isEarlyAccessPage && (
					<div className="closedIconsContainer">
						{sidebarNavigationItems.map((item) => (
							<Tooltip
								key={item?.id}
								title={<div className="tooltip-text">{item?.name}</div>}
								placement="right"
								arrow={false}
								color={'transparent'}
							>
								<div
									className="closed-sidebar-item"
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
												: 'var(--secondary-font)'
										}
										style={{
											color:
												item.name === 'Notes' ||
												item.name === 'Calendar' ||
												item.name === 'Tasks' ||
												item.name === 'Contacts' ||
												item.name === 'Automations' ||
												item.name === 'Database'
													? 'var(--secondary-font)'
													: 'none',
										}}
									/>
								</div>
							</Tooltip>
						))}
					</div>
				)}
			</div>
			<div className="bottomContainerClosed">
				<div style={{ marginBottom: '10px' }}>
					<CreditsLeftSvg
						totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
						totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
					/>
				</div>
				<div className="closedSidebarProfile">
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
								fontSize: '12px',
							}}
						>
							{getInitials(userDetailsData?.firstName, userDetailsData?.lastName)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(ClosedSidebar);
