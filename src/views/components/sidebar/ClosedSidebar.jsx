import React, { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg';

import DropDrownMenu from './DropDrownMenu';
import AddCalenderSvg from '../../../assets/svg/sidebar/AddCalenderSvg';
import CalendarSvg from '../../../assets/svg/sidebar/CalendarSvg';
import TranscriptSvg from '../../../assets/svg/sidebar/TranscriptSvg';
import SettingsSvg from '../../../assets/svg/sidebar/SettingsSvg';
import { ReactComponent as TaskSvg } from '../../../assets/svg/sidebar/Task.svg';
import { Tooltip } from 'antd';
import { closedSidebarIcons } from './sidebarindex';
const ClosedSideBarHoverStateIcons = ({ Icon, initialColor = null, hoverClassName = '' }) => {
	const [isHover, setisHover] = useState(false);
	return (
		<div
			onMouseEnter={() => setisHover(true)}
			onMouseLeave={() => setisHover(false)}
			className={`hoverStateIconsClosed ${isHover ? hoverClassName : ''}`}
		>
			{Icon && <Icon fill={isHover ? '#FFF' : initialColor} />}
		</div>
	);
};
const getPathInfo = (path) => {
	// Remove trailing slash and get the base path
	const cleanPath = path.replace(/\/$/, '');

	// Map of paths to their display names
	const pathInfo = {
		'/home': {
			title: 'Home',
			description: 'Your central dashboard for quick access to everything',
		},
		'/settings': {
			title: 'Settings',
			description: 'Configure your account preferences and system settings',
		},
		'/settings/my-profile': {
			title: 'Settings',
			description: 'Update your personal information and profile settings',
		},
		'/settings/billing': {
			title: 'Settings',
			description: 'Manage your subscription and billing information',
		},
		'/calendar': {
			title: 'Calendar',
			description: 'Schedule and manage your appointments and events',
		},
		'/transcript': {
			title: 'Transcript',
			description: 'Access and review your conversation history',
		},
		'/galleries': {
			title: 'Gallery',
			description: 'Browse and organize your media collections',
		},
		'/playbook': {
			title: 'Playbook',
			description: 'Explore and manage your playbook content',
		},
	};

	return pathInfo[cleanPath] || { title: 'Home', description: 'Your workspace dashboard' };
};

const ClosedSideBarItemsComponent = ({ sidebarStates, setsidebarStates, info, setInfo }) => {
	const navigate = useNavigate();
	const [showRaindrop, setShowRaindrop] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState(null);
	const [lastVisitedLocation, setLastVisitedLocation] = useState('');

	useEffect(() => {
		const currentPath = window.location.pathname;
		const { title } = getPathInfo(currentPath);
		setLastVisitedLocation(title);
	}, [window.location.pathname]);

	const openModuleFunction = () => {
		setsidebarStates({ ...sidebarStates, isOpen: true, navStyle: 'open' });
	};

	const openNewFeaturePlus = () => {
		setInfo((prev) => ({ ...prev, isNewFeaturePlusOpen: !prev.isNewFeaturePlusOpen }));
	};
	const handleIconClick = (index, route) => {
		setSelectedIcon(index);
		const selectedIconName = closedSidebarIcons[index]?.name || 'Home';
		setLastVisitedLocation(selectedIconName);
	};
	return (
		<>
			<div className="closedSideBarComponent">
				<Tooltip
					title={
						<div>
							<h3
								style={{
									margin: 0,
									marginBottom: '8px',
									display: 'flex',
									alignItems: 'center',
									gap: '12px',
									fontSize: '14px',
									fontWeight: '500',
									fontFamily: 'Inter',
									fontStyle: 'normal',
									lineHeight: '20px',
								}}
							>
								<TaskSvg style={{ height: '20px', width: '20px' }} />
								{getPathInfo(window.location.pathname).title}
							</h3>
							<p
								style={{
									margin: 0,
									fontSize: '12px',
									fontWeight: '500',
									fontFamily: 'Inter',
									fontStyle: 'normal',
								}}
							>
								{getPathInfo(window.location.pathname).description}
							</p>
						</div>
					}
					open={showRaindrop}
					placement="rightTop"
					arrow={false}
					overlayInnerStyle={{
						padding: '20px 25px',
						borderRadius: '24px',
						fontSize: '14px',
						backgroundColor: '#1f1f1f',
						color: 'white',
						width: '220px',
						height: '145px',
						transformOrigin: 'left center',
					}}
					overlayStyle={{
						paddingLeft: '12px', // adds some space between the circle and tooltip
					}}
				>
					<div
						className="openWorkFlowContainer"
						onClick={openModuleFunction}
						onMouseEnter={() => setShowRaindrop(true)}
						onMouseLeave={() => setShowRaindrop(false)}
					>
						<div className="gradientCirlce">
							<p
								style={{
									textTransform: 'capitalize',
									fontSize: '20px',
									fontFamily: 'Inter',
									fontWeight: '500',
									color: 'white',
								}}
							>
								C
							</p>
						</div>
					</div>
				</Tooltip>
				<div className="ClosedIconsContainer">
					{closedSidebarIcons?.map((singleItem, index) => (
						<div
							className={`iconContainer ${selectedIcon === index ? 'selected' : ''}`}
							onClick={() => {
								handleIconClick(index);
								navigate(singleItem?.route);
							}}
						>
							<ClosedSideBarHoverStateIcons
								Icon={singleItem?.icon}
								initialColor={singleItem?.initialColor}
							/>
						</div>
					))}
				</div>
				<div className="TabOptions">
					<div>
						<div className="dropDownMenuContainer" onClick={openNewFeaturePlus}>
							<ClosedSideBarHoverStateIcons
								Icon={PlusSvg}
								hoverClassName="plusIconHover"
							/>
							<DropDrownMenu info={info} setInfo={setInfo} />
						</div>
					</div>

					<div onClick={() => navigate('/home')}>
						<ClosedSideBarHoverStateIcons Icon={AppartmentHomeSvg} />
					</div>
					<div className="activeWorkspaceDiv" onClick={openModuleFunction}>
						<img
							src={info?.activeBusniessName?.logo_s3_500w_key}
							alt={info?.activeBusniessName?.activeWorkspaceId}
						/>
					</div>
				</div>
			</div>
			{/* {showRaindrop && (
				<div className="raindropEffect">
					<h3 style={{ color: 'white' }}>{lastVisitedLocation}</h3>
				</div>
			)} */}
		</>
	);
};

export default memo(ClosedSideBarItemsComponent);
