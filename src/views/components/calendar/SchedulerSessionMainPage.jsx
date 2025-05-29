import { useState, memo, useCallback, useContext } from 'react';
import QuickActions from '../globalComponents/QuickActions';
import { ReactComponent as BackSvg } from '../../../assets/svg/calendar/CaretLeft.svg';
import '../../../assets/scss/calendar/SchedulerMainPage.scss';
import { ReactComponent as CaretRightSvg } from '../../../assets/svg/calendar/CaretLeft.svg';
import SchedulerRightDrawer from './SchedulerRightDrawer';
import SchedulerAvailability from '../scheduler/SchedulerAvailability';
import UpdateSessionSlot from '../modalsV2/calendar/UpdateSessionSlot';
import Context from '../../../context/context';
const SchedulerSessionMainPage = ({
	onBackToCalendar,
	schedulerList: initialSchedulerList = [],
	onCreateScheduler,
}) => {
	const {
		calendarInfo: { updateSchedulerSession },
	} = useContext(Context);
	const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
	const [rightDrawerSession, setRightDrawerSession] = useState(null);
	const [drawerMode, setDrawerMode] = useState('create');
	const [initialTab, setInitialTab] = useState('one-on-one');

	const [info, setInfo] = useState({
		updateSlotModal: false,
		selectedSlotData: null,
		schedulerList: initialSchedulerList,
		createSessionModal: false,
	});

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
		setInfo((prev) => ({
			...prev,
			schedulerList: prev.schedulerList.map((s) =>
				s._id === updatedSession._id ? updatedSession : s,
			),
		}));
		setRightDrawerSession(updatedSession);
	};

	const handleSessionDeleted = (deletedSessionId) => {
		setInfo((prev) => ({
			...prev,
			schedulerList: prev.schedulerList.filter((s) => s._id !== deletedSessionId),
		}));
		setRightDrawerOpen(false);
		setRightDrawerSession(null);
	};

	const handleSessionCreated = (newSession) => {
		setInfo((prev) => ({
			...prev,
			schedulerList: [...prev.schedulerList, newSession],
		}));
		setRightDrawerOpen(false);
		setRightDrawerSession(null);
	};

	const toggleUpdateSlotModal = useCallback((slotData) => {
		setInfo((prev) => ({
			...prev,
			updateSlotModal: !prev.updateSlotModal,
			selectedSlotData: slotData || null,
		}));
	}, []);

	const handleUpdateSession = useCallback(
		(updatedSession) => {
			console.log('updatedSession', updatedSession);
			// Only send availabilitySlots as the payload
			const payload = {
				availabilitySlots: updatedSession.availabilitySlots,
			};

			// Call the API to update the session
			updateSchedulerSession(updatedSession._id, payload)
				.then((response) => {
					// Update local state after successful API call
					setInfo((prev) => {
						// Find the session in the list and update it with the response data
						const updatedSchedulerList = prev.schedulerList.map((session) => {
							if (session._id === updatedSession._id) {
								// Merge the existing session with the response data
								return {
									...session,
									availabilitySlots:
										response.availabilitySlots || session.availabilitySlots,
								};
							}
							return session;
						});

						return {
							...prev,
							schedulerList: updatedSchedulerList,
							updateSlotModal: false,
							selectedSlotData: null,
						};
					});
				})
				.catch((error) => {
					console.error('Error updating session:', error);
				});
		},
		[updateSchedulerSession],
	);

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
					{info.schedulerList.map((session, idx) => (
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
				<SchedulerAvailability
					updateSlotModal={info?.updateSlotModal}
					toggleUpdateSlotModal={toggleUpdateSlotModal}
					schedulerList={info.schedulerList}
				/>

			<UpdateSessionSlot
				open={info?.updateSlotModal}
				closeModal={toggleUpdateSlotModal}
				schedulerList={info.schedulerList}
				selectedSlotData={info?.selectedSlotData}
				updateCalendarInfo={handleUpdateSession}
			/>
			<SchedulerRightDrawer
				open={rightDrawerOpen}
				onClose={handleCloseDrawer}
				mode={drawerMode}
				sessionId={rightDrawerSession?._id}
				sessionData={rightDrawerSession}
				onSessionUpdated={handleSessionUpdated}
				onSessionDeleted={handleSessionDeleted}
				onSessionCreated={handleSessionCreated}
				initialTab={initialTab}
			/>
		</div>
	);
};

export default memo(SchedulerSessionMainPage);
