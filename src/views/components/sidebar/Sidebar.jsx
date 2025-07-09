import { useState, useEffect, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../../assets/scss/sidebar.scss';
import {
	stableNavigationItems,
	betaNavigationItems,
	internalNavigationItems,
} from './sidebarindex';
import OpenedSidebar from './OpenedSidebar';
import Notifications from './notifications/Notifications';
import Notes from './notes/Notes';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import ClosedSidebar from './ClosedSidebar';

const sidebarNavigationMap = {
	beta: betaNavigationItems,
	internal: internalNavigationItems,
	stable: stableNavigationItems,
};

const Sidebar = () => {
	const { workspaceMode } = useWorkspaceMode();
	const sidebarNavigationItems = sidebarNavigationMap[workspaceMode];

	const { pathname } = useLocation();
	const isHome = pathname?.includes('home');

	const sidebarRef = useRef(null);
	const sidebarOpenRef = useRef(null);

	const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
		const sidebarOpen = JSON.parse(localStorage.getItem('isSidebarOpen')) ?? false;
		return sidebarOpen;
	});

	const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
	const [showNotesDrawer, setShowNotesDrawer] = useState(false);

	const [sidebarStates, setsidebarStates] = useState({
		workSpaceOpen: false,
		navStyle: 'close',
		selectedModule: null,
	});

	useEffect(() => {
		localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
	}, [isSidebarOpen]);

	const isEarlyAccessPage = pathname?.includes('/early-access') || pathname?.includes('/pricing');

	return (
		<>
			<div
				className={`FullScreenSidebar
					${
						isSidebarOpen
							? 'opened'
							: sidebarRef.current?.classList?.contains('sidebar-open')
							? 'closed'
							: ''
					}
					`}
				style={{
					height: isSidebarOpen ? '100dvh' : '100dvh',
					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : '',
					maxHeight: isHome ? (isSidebarOpen ? '' : '') : '',
					minHeight: isHome ? (isSidebarOpen ? '' : '250px') : '',
				}}
				ref={sidebarRef}
			>
				<nav className={`sidebarComponent ${!isSidebarOpen && isHome ? 'padding-48' : ''}`}>
					<div
						className={`sidebar-open ${
							isSidebarOpen
								? 'active'
								: sidebarOpenRef.current?.classList?.contains('active')
								? 'inactive'
								: 'inactive'
						}`}
						ref={sidebarOpenRef}
					>
						<OpenedSidebar
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							isSidebarOpen={isSidebarOpen}
							setIsSidebarOpen={setIsSidebarOpen}
							setShowNotificationsDrawer={setShowNotificationsDrawer}
							setShowNotesDrawer={setShowNotesDrawer}
							isThisEarlyAccessPage={isEarlyAccessPage}
						/>
					</div>
				</nav>
				{!isSidebarOpen && (
					<ClosedSidebar
						onIconClick={() => setIsSidebarOpen(true)}
						isEarlyAccessPage={isEarlyAccessPage}
					/>
				)}
				<Notifications
					showNotificationsDrawer={showNotificationsDrawer}
					setShowNotificationsDrawer={setShowNotificationsDrawer}
				/>
				<Notes showNotesDrawer={showNotesDrawer} setShowNotesDrawer={setShowNotesDrawer} />
			</div>

			{isSidebarOpen && <div className="sidebar__overlay"></div>}
		</>
	);
};

export default memo(Sidebar);
