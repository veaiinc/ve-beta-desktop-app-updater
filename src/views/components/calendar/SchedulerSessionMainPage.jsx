import { useState, memo } from 'react';
import QuickActions from '../globalComponents/QuickActions';
import { ReactComponent as BackSvg } from '../../../assets/svg/calendar/CaretLeft.svg';
import '../../../assets/scss/calendar/SchedulerMainPage.scss';
import { ReactComponent as CaretRightSvg } from '../../../assets/svg/calendar/CaretLeft.svg';
import SchedulerRightDrawer from './SchedulerRightDrawer';

const SchedulerSessionMainPage = ({
	onBackToCalendar,
	schedulerList: initialSchedulerList = [],
	onCreateScheduler,
}) => {
	const [schedulerList, setSchedulerList] = useState(initialSchedulerList);
	const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
	const [rightDrawerSession, setRightDrawerSession] = useState(null);
	const [drawerMode, setDrawerMode] = useState('create');
	const [initialTab, setInitialTab] = useState('one-on-one');

	const handleOpenCreate = (tab) => {
		setDrawerMode('create');
		setRightDrawerSession(null);
		setInitialTab(tab);
		setRightDrawerOpen(true);
	};

	const handleOpenEdit = (session) => {
		setDrawerMode('edit');
		setRightDrawerSession(session);
		setInitialTab(session.sessionTypeInfo?.sessionType || 'one-on-one');
		setRightDrawerOpen(true);
	};

	const handleCloseDrawer = () => {
		setRightDrawerOpen(false);
		setRightDrawerSession(null);
		setDrawerMode('create');
	};

	const handleSessionUpdated = (updatedSession) => {
		setSchedulerList((prev) =>
			prev.map((s) => (s._id === updatedSession._id ? updatedSession : s)),
		);
		setRightDrawerSession(updatedSession);
	};

	const handleSessionDeleted = (deletedSessionId) => {
		setSchedulerList((prev) => prev.filter((s) => s._id !== deletedSessionId));
		setRightDrawerOpen(false);
		setRightDrawerSession(null);
	};

	return (
		<div className="schedulerMainPageContainer">
			<div className="header">
				<h1 className="header-title">
					<BackSvg onClick={onBackToCalendar} />
					<span className="lineOne">Scheduler</span>
				</h1>
				<QuickActions />
			</div>
			<div className="scheduler-main-body-row">
				{/* Left: Create Scheduler */}
				<div className="createSchedulerCard">
					<div className="create-title">Create Scheduler</div>
					<div className="option" onClick={() => handleOpenCreate('one-on-one')}>
						<div className="option-content">
							<div className="option-title">One-on-One</div>
							<div className="option-desc">1 host 1 invitee</div>
						</div>
						<div className="option-icon">
							<CaretRightSvg />
						</div>
					</div>
					<div className="option" onClick={() => handleOpenCreate('group')}>
						<div className="option-content">
							<div className="option-title">Group</div>
							<div className="option-desc">Host multiple invitees</div>
						</div>
						<div className="option-icon">
							<CaretRightSvg />
						</div>
					</div>
					{/* <div
						className="option"
						onClick={() => handleOpenCreate('round-robin')}
					>
						<div className="option-content">
							<div className="option-title">Round Robin</div>
							<div className="option-desc">Rotating Hosts - One invitee</div>
						</div>
						<div className="option-icon">
							<CaretRightSvg />
						</div>
					</div> */}
				</div>
				{/* Right: List of Schedulers */}
				<div className="schedulerListCards">
					{schedulerList.map((session, idx) => (
						<div
							className="sessionCard"
							key={session._id || idx}
							onClick={() => handleOpenEdit(session)}
						>
							<div className="session-content">
								<div className="session-title">
									{session.sessionName || 'Untitled'}
								</div>
								<div className="session-type">
									{session.sessionTypeInfo?.sessionType || ''}
								</div>
							</div>
							<div
								className="session-color"
								style={{
									width: 16,
									height: 16,
									borderRadius: 4,
									background: session.sessionColor || '#6366F1',
									marginTop: 12,
								}}
							/>
						</div>
					))}
				</div>
			</div>
			<SchedulerRightDrawer
				open={rightDrawerOpen}
				onClose={handleCloseDrawer}
				mode={drawerMode}
				sessionId={rightDrawerSession?._id}
				sessionData={rightDrawerSession}
				onSessionUpdated={handleSessionUpdated}
				onSessionDeleted={handleSessionDeleted}
				initialTab={initialTab}
			/>
		</div>
	);
};

export default memo(SchedulerSessionMainPage);
