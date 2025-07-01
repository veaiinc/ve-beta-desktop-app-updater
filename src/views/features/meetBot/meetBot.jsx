import React from 'react';
import { Drawer } from 'antd';
import './meetBot.scss';

// Dummy data for meetings
const meetings = [
	{
		id: 1,
		time: 'In 30 min',
		user: 'Ankit gajbhe',
		title: 'Interview · Avinash · Construction worker',
		desc: 'The meeting took place on a sunny Wednesday afternoon at the downtown conference center. Attendees included team members from various departments, all eager to discuss the upcoming project milestones.',
		meta: '4:40 PM · 30 min · Ankit gajbhe',
		avatar: 'A',
		image: null, // Could be a URL
		date: 'Wednesday, March 13, 2024',
		isUpcoming: true,
	},
	{
		id: 2,
		time: '',
		user: 'Rohit Sharma',
		title: 'Feedback Session · Priya · Product designer',
		desc: 'The feedback session was held in the design studio, where the team reviewed the latest prototypes. Key insights were gathered from both designers and stakeholders.',
		meta: '3:00 PM · 45 min · Rohit Sharma',
		avatar: 'A',
		image: null,
		date: 'Wednesday, March 13, 2024',
		isUpcoming: false,
	},
	{
		id: 3,
		time: '',
		user: 'Sanjay',
		title: 'Project Kickoff · Sanjay · Project manager',
		desc: 'Kickoff meeting for the new project. The team discussed timelines, deliverables, and assigned initial tasks.',
		meta: '2:00 PM · 60 min · Sanjay',
		avatar: 'A',
		image: null,
		date: 'Wednesday, March 13, 2024',
		isUpcoming: false,
	},
];

function useResponsiveDrawerWidth() {
	const [width, setWidth] = React.useState(
		typeof window !== 'undefined' && window.innerWidth <= 900 ? '100vw' : 420,
	);
	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth <= 900 ? '100vw' : 420);
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	return width;
}

const MeetBot = () => {
	// Find the upcoming meeting and the rest
	const upcomingMeeting = meetings.find((m) => m.isUpcoming);
	const meetingList = meetings.filter((m) => !m.isUpcoming);
	const meetingDate = upcomingMeeting?.date || 'Wednesday, March 13, 2024';
	const drawerWidth = useResponsiveDrawerWidth();
	const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;

	return (
		<div className="meetbot">
			<div className="meetbot__main">
				<div className="meetbot__left">
					{/* Upcoming meeting */}
					<div className="meetbot__upcoming">
						<h2>Upcoming meeting</h2>
						{upcomingMeeting && (
							<div className="meetbot__upcoming-card">
								<div className="meetbot__upcoming-info">
									<span className="meetbot__upcoming-time">
										{upcomingMeeting.time}
									</span>
									<span className="meetbot__upcoming-user">
										{upcomingMeeting.user}
									</span>
									<div className="meetbot__upcoming-title">
										{upcomingMeeting.title}
									</div>
									<div className="meetbot__upcoming-desc">
										{upcomingMeeting.desc}
									</div>
									<button className="meetbot__guide-btn">Guide me</button>
								</div>
							</div>
						)}
					</div>
					<div className="meetbot__list-section">
						<h3>{meetingDate}</h3>
						{/* Meeting cards list */}
						{meetingList.map((meeting) => (
							<div className="meetbot__meeting-card" key={meeting.id}>
								<div className="meetbot__meeting-avatar">{meeting.avatar}</div>
								<div className="meetbot__meeting-info">
									<div className="meetbot__meeting-title">{meeting.title}</div>
									<div className="meetbot__meeting-meta">{meeting.meta}</div>
									<div className="meetbot__meeting-desc">{meeting.desc}</div>
								</div>
								<div className="meetbot__meeting-img">
									{/* Placeholder for image */}
									<div className="meetbot__img-placeholder" />
								</div>
							</div>
						))}
					</div>
				</div>
				<Drawer
					open={true}
					width={drawerWidth}
					placement="right"
					closable={false}
					mask={false}
					headerStyle={{ display: 'none' }}
					bodyStyle={{
						padding: 0,
						background: 'transparent',
						height: isMobile ? 'auto' : '100vh',
						overflow: 'auto',
					}}
					style={{ position: 'relative' }}
					className="meetbot__right meetbot__right--open"
					getContainer={false}
				>
					<div className="meetbot__drawer-header">
						<div className="meetbot__drawer-tabs">
							<button className="meetbot__drawer-tab meetbot__drawer-tab--active">
								Video
							</button>
						</div>
					</div>
					<div className="meetbot__drawer-content">
						<div className="meetbot__drawer-label">Record a live meeting</div>
						<div className="meetbot__drawer-desc">
							Works with Zoom, Google meet, or Microsoft Teams
						</div>
						<input className="meetbot__drawer-input" placeholder="Paste meeting URL" />
					</div>
				</Drawer>
			</div>
		</div>
	);
};

export default MeetBot;
