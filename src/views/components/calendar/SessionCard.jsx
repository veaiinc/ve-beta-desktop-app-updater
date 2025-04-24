import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/calendar/SessionCard.scss';
import { ReactComponent as PencilSvg } from '../../../assets/svg/calendar/pencil.svg';
import PlusSvg from '../../../assets/svg/my_templates/PlusSvg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import UpdateSessionSlot from '../../../views/components/modalsV2/calendar/UpdateSessionSlot';
import CreateSessionModal from '../../../views/components/modalsV2/calendar/CreateSessionModal';
import dayjs from 'dayjs';

const expandedHeight = '192px'; // Pre-calculated: 40 + (2 * 40) + (3 * 12) + 32 + 4

const SessionCard = ({
	schedulerList = [],
	selectedSession,
	sessionFilter = [],
	updateCalendarInfo,
}) => {
	const [info, setInfo] = useState({
		expanded: false,
		height: '62px',
		isSessionModalOpen: false,
		isCreateModalOpen: false,
		isSessionEditable: false,
		selectedCalendarSession: selectedSession || null,
		scheduleFrom: dayjs(),
		scheduleTo: dayjs().add(1, 'weeks'),
	});
	const expandRef = useRef(null);

	useEffect(() => {
		const hasItems = Array.isArray(schedulerList) && schedulerList.length > 0;
		if (hasItems && !info.expanded) {
			setInfo((prev) => ({ ...prev, expanded: true }));
		}
	}, [schedulerList]);

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			height: info?.expanded ? expandedHeight : '62px',
		}));
	}, [info?.expanded]);

	const handleSessionExpand = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			expanded: !prevInfo.expanded,
		}));
	}, []);

	const handleAddSessionClick = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isCreateModalOpen: true,
			isSessionEditable: false,
		}));
	}, []);

	const handleEditSession = useCallback(
		(session) => {
			if (!session || typeof session !== 'object') return;

			setInfo((prevInfo) => ({
				...prevInfo,
				isSessionEditable: true,
				selectedCalendarSession: session,
			}));
			updateCalendarInfo('selectedSession', session);
			updateCalendarInfo('showEditScheduler', true);
		},
		[updateCalendarInfo],
	);

	const handleCheckboxChange = (sessionId) => {
		if (!sessionId) return;

		const defaultSession = schedulerList?.find(
			(session) => session?.sessionName?.toLowerCase() === 'all',
		)?._id;

		// If selecting Default session
		if (sessionId === defaultSession) {
			// If Default is already selected, keep it selected, otherwise select only Default
			const updatedFilter = sessionFilter?.includes(defaultSession)
				? [defaultSession]
				: [defaultSession];
			updateCalendarInfo('sessionFilter', updatedFilter);
			return;
		}

		// If selecting a non-Default session
		let updatedFilter;
		if (sessionFilter?.includes(sessionId)) {
			// Unselect the session if it's already selected
			updatedFilter = sessionFilter?.filter((id) => id !== sessionId);
			// If this would result in an empty filter, select the default session
			if (updatedFilter.length === 0) {
				updatedFilter = [defaultSession];
			}
		} else {
			// Add the session and remove Default if it was selected
			updatedFilter = [...sessionFilter?.filter((id) => id !== defaultSession), sessionId];
		}

		updateCalendarInfo('sessionFilter', updatedFilter);
	};

	const handleSessionCreated = useCallback(
		(session) => {
			handleEditSession(session);
		},
		[handleEditSession],
	);

	return (
		<>
			<div
				className={`sessionCardContainer ${info?.expanded ? 'expanded' : ''}`}
				style={{
					height: info?.height,
				}}
				ref={expandRef}
			>
				<div className="sessionHeader">
					<div className="headerContainer">
						<span className="headLabel">Sessions</span>
					</div>
					<div className="headerButtonsContainer">
						<div className="addSessionButton" onClick={handleAddSessionClick}>
							<PlusSvg />
						</div>
						<div className="expandIcon" onClick={handleSessionExpand}>
							<DownSvg />
						</div>
					</div>
				</div>

				{info?.expanded && Array.isArray(schedulerList) && (
					<div className="sessionsContainer">
						{schedulerList.map((session) => {
							if (!session || typeof session !== 'object') return null;

							const isChecked =
								Array.isArray(sessionFilter) &&
								sessionFilter.includes(session?._id);
							return (
								<div className="sessionItem" key={session?._id}>
									<div className="sessionWrapper">
										<span
											className="statusIndicator"
											style={{
												backgroundColor: session?.sessionColor || '#6366F1',
											}}
										></span>
										<label
											htmlFor={`${session?.sessionName}-checkbox`}
											className="sessionLabel"
										>
											{session?.sessionName || 'Unnamed Session'}
											{session?.sessionName?.toLowerCase() !== 'all' && (
												<button
													className="editButton"
													onClick={() => handleEditSession(session)}
												>
													<PencilSvg />
												</button>
											)}
										</label>
										<input
											type="checkbox"
											className="checkBox"
											id={`${session?.sessionName}-checkbox`}
											checked={isChecked}
											onChange={() => handleCheckboxChange(session?._id)}
											aria-checked={isChecked}
											aria-label={`${
												session?.sessionName || 'Unnamed Session'
											} session`}
										/>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
			<CreateSessionModal
				open={info?.isCreateModalOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, isCreateModalOpen: false }))}
				onSessionCreated={handleSessionCreated}
			/>
			<UpdateSessionSlot
				open={info?.isSessionModalOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, isSessionModalOpen: false }))}
				schedulerList={schedulerList}
				selectedSlotData={info?.selectedCalendarSession}
				updateCalendarInfo={updateCalendarInfo}
			/>
		</>
	);
};

export default memo(SessionCard);
