import { memo, useContext } from 'react';
import '../../../assets/scss/sidebar.scss';
import { stableNavigationItems, betaNaviagationItems } from './sidebarindex';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import useWorkspaceMode from '../../hooks/useWorkspaceMode';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Cropper from 'react-easy-crop';
import CreditsLeftSvg from './chatHistory/CreditsLeftSvg';
import { Tooltip } from 'antd';
const ClosedSidebar = ({ onIconClick }) => {
	const navigate = useNavigate();
	const { workspaceMode } = useWorkspaceMode();
	const {
		profileInfo: { userDetailsData },
		subscriptionInfo: { currentPlan },
	} = useContext(Context);
	const sidebarNavigationItems =
		workspaceMode === 'stable' ? stableNavigationItems : betaNaviagationItems;

	const getInitials = (firstName, lastName) => {
		const firstNameInitial = firstName ? firstName?.charAt(0) : '-';
		const lastNameInitial = lastName ? lastName?.charAt(0) : '';
		const initials = `${firstNameInitial?.toUpperCase()}${lastNameInitial?.toUpperCase()}`;
		return initials;
	};

	return (
		<div className="sidebar-closing">
			<div className="topContainerClosed">
				<SidebarClosingSvg onClick={() => onIconClick()} />
				<div className="closedIconsContainer">
					{sidebarNavigationItems.map((item) => (
						<Tooltip
							title={<div className="tooltip-text">{item?.name}</div>}
							placement="right"
							arrow={false}
							color={'transparent'}
						>
							<div
								className="closed-sidebar-item"
								onClick={() => navigate(item?.route)}
								style={{ cursor: 'pointer' }}
							>
								<item.icon
									fill={
										item.name === 'Notes' ||
										item.name === 'Calendar' ||
										item.name === 'Tasks' ||
										item.name === 'Contacts' ||
										item.name === 'Automations'
											? 'none'
											: 'var(--secondary-font)'
									}
									style={{
										color:
											item.name === 'Notes' ||
											item.name === 'Calendar' ||
											item.name === 'Tasks' ||
											item.name === 'Contacts' ||
											item.name === 'Automations'
												? 'var(--secondary-font)'
												: 'none',
									}}
								/>
							</div>
						</Tooltip>
					))}
				</div>
			</div>
			<div className="bottomContainerClosed">
				<CreditsLeftSvg
					totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
					totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
				/>
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
