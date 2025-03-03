import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/scheduler/schedulerMainPage.scss';
import SessionCards from '../../components/scheduler/SessionCard';
import SchedulerAvailability from '../../components/scheduler/SchedulerAvailability';
import CreateSessionModal from '../../components/modalsV2/calendar/CreateSessionModal';
import UpdateSessionSlot from '../../components/modalsV2/calendar/UpdateSessionSlot';
import Context from '../../../context/context';

const SchedulerMainPage = () => {
	const {
		calendarInfo: { getSchedulerList, schedulerList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		createSessionModal: false,
		updateSessionSlot: false,
		sessionsLoading: true,
		schedulerList: null,
	});

	useEffect(() => {
		getSchedulerList();
	}, []);

	useEffect(() => {
		if (schedulerList) {
			setInfo((prev) => ({
				...prev,
				schedulerList: schedulerList,
				sessionsLoading: false,
			}));
		}
	}, [schedulerList]);

	console.log('schedulerList==>', info?.schedulerList);

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
	}, []);
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
						{info.sessionsLoading ? (
							<SessionCardSkeleton />
						) : (
							info?.schedulerList?.length > 0 &&
							info?.schedulerList?.map((item) => (
								<SessionCards key={item.id} item={item} />
							))
						)}
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
				closeModal={handleUpdateSessionSlot}
			/>
		</>
	);
};

export default memo(SchedulerMainPage);

export const SessionCardSkeleton = () => {
	return (
		<>
			{[{}, {}, {}].map((item) => (
				<div key={item} className="sessionGridContainer sessionCardSkeleton">
					<div className="sessionGridItem">
						<div className="sessionImage" />
						<div className="sessionContent">
							<div className="sessionHeader">
								<span />
							</div>
							<div className="sessionInfo">
								<div className="duration" />
								<div className="priceSeparator">|</div>
								<div className="price" />
							</div>
							<div className="location" />
						</div>
					</div>
				</div>
			))}
		</>
	);
};
