import React, { useState } from 'react';
import QuickActions from '../globalComponents/QuickActions';
import { ReactComponent as BackSvg } from '../../../assets/svg/calendar/CaretLeft.svg';
import '../../../assets/scss/calendar/SchedulerMainPage.scss';
import { ReactComponent as CaretRightSvg } from '../../../assets/svg/calendar/CaretLeft.svg';
import SchedulerRightDrawer from './SchedulerRightDrawer';
const SchedulerMainPage = ({ onBackToCalendar, schedulerList = [], onCreateScheduler }) => {
	const [open, setOpen] = useState(false);
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
					<div
						className="option"
						onClick={() => {
							onCreateScheduler?.('one-on-one');
							setOpen(true);
						}}
					>
						<div className="option-content">
							<div className="option-title">
								One-on-One
							</div>
							<div className="option-desc">1 host 1 invitee</div>
						</div>
						<div className="option-icon">
							<CaretRightSvg />
						</div>
					</div>
					<div
						className="option"
						onClick={() => {
							onCreateScheduler?.('group');
							setOpen(true);
						}}
					>
						<div className="option-content">
							<div className="option-title">Group</div>
							<div className="option-desc">Host multiple invitees</div>
						</div>
						<div className="option-icon">
							<CaretRightSvg />
						</div>
					</div>
					<div
						className="option"
						onClick={() => {
							onCreateScheduler?.('round-robin');
							setOpen(true);
						}}
					>
						<div className="option-content">
							<div className="option-title">Round Robin</div>
							<div className="option-desc">Rotating Hosts - One invitee</div>
						</div>
						<div className="option-icon">
							<CaretRightSvg />
						</div>
					</div>
				</div>
				{/* Right: List of Schedulers */}
				<div className="schedulerListCards">
					{schedulerList.map((session, idx) => (
						<div className="sessionCard" key={session._id || idx}>
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
				open={open}
				onClose={() => setOpen(false)}
			/>
		</div>
	);
};

export default SchedulerMainPage;
