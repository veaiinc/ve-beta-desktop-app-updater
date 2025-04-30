import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/calendar/SessionCard.scss';
import { ReactComponent as PencilSvg } from '../../../assets/svg/calendar/pencil.svg';
import PlusSvg from '../../../assets/svg/my_templates/PlusSvg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import UpdateSessionSlot from '../../../views/components/modalsV2/calendar/UpdateSessionSlot';
import CreateSessionModal from '../../../views/components/modalsV2/calendar/CreateSessionModal';
import dayjs from 'dayjs';

const SessionCard = ({
	schedulerList = [],
	selectedSession,
	sessionFilter = [],
	updateCalendarInfo,
}) => {
	const [info, setInfo] = useState({
		expanded: false,
		isSessionModalOpen: false,
		isCreateModalOpen: false,
		isSessionEditable: false,
		selectedCalendarSession: selectedSession || null,
		scheduleFrom: dayjs(),
		scheduleTo: dayjs().add(1, 'weeks'),
	});
	const expandRef = useRef(null);

	// Update session data when selectedSession changes
	useEffect(() => {
		if (selectedSession) {
			setInfo((prevInfo) => ({
				...prevInfo,
				selectedCalendarSession: selectedSession,
			}));
		}
	}, [selectedSession]);

	// Update session data when schedulerList changes
	useEffect(() => {
		if (schedulerList) {
			if (selectedSession) {
				const session = schedulerList.find((s) => s?._id === selectedSession?._id);
				if (session) {
					setInfo((prevInfo) => ({
						...prevInfo,
						selectedCalendarSession: session,
					}));
				}
			}
		}
	}, [schedulerList, selectedSession]);

	// Handle session expansion
	useEffect(() => {
		const hasItems = Array.isArray(schedulerList) && schedulerList.length > 0;
		if (hasItems && !info?.expanded) {
			setInfo((prev) => ({ ...prev, expanded: true }));
		}
	}, [schedulerList]);

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

	const handleSessionExpand = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			expanded: !prevInfo?.expanded,
		}));
	}, []);

	const handleAddSessionClick = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isCreateModalOpen: true,
			isSessionEditable: false,
		}));
	}, []);

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

				{info?.expanded && Array?.isArray(schedulerList) && (
					<div
						className="sessionsContainer"
						style={{
							overflowY: 'auto',
							maxHeight: '105px',
						}}
					>
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
