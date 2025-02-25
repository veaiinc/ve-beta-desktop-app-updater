import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/scheduler/schedulerMainPage.scss';
import SessionCards from '../../components/scheduler/SessionCard';
import SchedulerAvailability from '../../components/scheduler/SchedulerAvailability';
import CreateSessionModal from '../../components/modalsV2/calendar/CreateSessionModal';
import UpdateSessionSlot from '../../components/modalsV2/calendar/UpdateSessionSlot';
const sessionGridItems = [
	{
		id: 1,
		title: 'Yoga Session',
		duration: '45 minutes',
		price: 'Rs.3200',
		location: 'Moonshine Studio, Banjara hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: true,
	},
	{
		id: 2,
		title: 'Meditation Class',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 3,
		title: 'Technical Class',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 4,
		title: 'Clasical Session',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 5,
		title: 'Dance Session',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 6,
		title: 'Nutrition Class',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
];

const SchedulerMainPage = () => {
	const [info, setInfo] = useState({
		createSessionModal: false,
		updateSessionSlot: false,
	});

	const handleCreateSessionModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			createSessionModal: !prev.createSessionModal,
		}));
	}, []);

	const handleUpdateSessionSlot = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			updateSessionSlot: !prev.updateSessionSlot,
		}));
	}, [info?.updateSessionSlot]);
	return (
		<>
			<div className="schedulerMainPageParentContainer">
				<div className="calendarHeaderContainer">
					<div className="calendarHeaderTitle">
						<span>Manage</span> Your Sessions
					</div>
					<div className="calendarHeaderSubTitle">
						Effortlessly manage your time with AI scheduling.
					</div>
				</div>

				<div className="schedulerMainPageContainer">
					<div className="sessionGridParentContainer">
						<div
							className="sessionGridContainer addNewSession"
							onClick={handleCreateSessionModal}
						>
							<div>+ New session</div>
						</div>
						{sessionGridItems?.length > 0 &&
							sessionGridItems?.map((item) => <SessionCards item={item} />)}
					</div>

					<SchedulerAvailability
						isUpdateSessionSlot={info?.updateSessionSlot}
						handleUpdateSessionSlot={handleUpdateSessionSlot}
					/>
				</div>
			</div>
			<CreateSessionModal
				open={info?.createSessionModal}
				closeModal={handleCreateSessionModal}
			/>
			<UpdateSessionSlot
				open={info?.updateSessionSlot}
				// open={true}
				closeModal={handleUpdateSessionSlot}
			/>
		</>
	);
};

export default memo(SchedulerMainPage);
