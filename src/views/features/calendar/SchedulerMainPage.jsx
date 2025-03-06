import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/scheduler/schedulerMainPage.scss';
import SessionCards from '../../components/scheduler/SessionCard';
import SchedulerAvailability from '../../components/scheduler/SchedulerAvailability';
import CreateSessionModal from '../../components/modalsV2/calendar/CreateSessionModal';
import UpdateSessionSlot from '../../components/modalsV2/calendar/UpdateSessionSlot';
import Context from '../../../context/context';

const SchedulerMainPage = () => {
	const {
		calendarInfo: { getSchedulerList, schedulerList, createdSession, resetSchedulerState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		createSessionModal: false,
		updateSlotModal: false,
		sessionsLoading: true,
		schedulerList: null,
		createdSession: null,
	});

	useEffect(() => {
		getSchedulerList();
	}, []);

	useEffect(() => {
		if (schedulerList) {
			setInfo((prev) => ({
				...prev,
				schedulerList,
				sessionsLoading: false,
			}));
		}
	}, [schedulerList]);

	useEffect(() => {
		if (createdSession) {
			setInfo((prev) => ({
				...prev,
				createSessionModal: false,
				schedulerList: [...prev.schedulerList, createdSession],
			}));
		}
	}, [createdSession]);

	//cleanup
	useEffect(() => {
		return () => {
			resetSchedulerState();
			setInfo({
				createSessionModal: false,
				updateSessionSlot: false,
				sessionsLoading: true,
				schedulerList: null,
				createdSession: null,
			});
		};
	}, []);

	const handleCreateSessionModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			createSessionModal: !prev.createSessionModal,
		}));
	}, []);

	const toggleUpdateSlotModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			updateSlotModal: !prev.updateSlotModal,
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
								<SessionCards key={item._id} item={item} />
							))
						)}
					</div>

					<SchedulerAvailability
						updateSlotModal={info?.updateSlotModal}
						toggleUpdateSlotModal={toggleUpdateSlotModal}
						schedulerList={info?.schedulerList}
					/>
				</div>
			</div>
			<CreateSessionModal
				open={info?.createSessionModal}
				closeModal={handleCreateSessionModal}
			/>
			<UpdateSessionSlot
				open={info?.updateSlotModal}
				closeModal={toggleUpdateSlotModal}
				schedulerList={info?.schedulerList}
			/>
		</>
	);
};

export default memo(SchedulerMainPage);

export const SessionCardSkeleton = () => {
	return (
		<>
			{[{}, {}, {}].map((item, index) => (
				<div key={index} className="sessionGridContainer sessionCardSkeleton">
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
