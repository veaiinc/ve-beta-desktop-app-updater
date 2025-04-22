import { memo, useCallback, useState, useRef, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarCategories.scss';
import { ReactComponent as PencilSvg } from '../../../assets/svg/calendar/pencil.svg';
import PlusSvg from '../../../assets/svg/my_templates/PlusSvg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import UpdateSessionSlot from '../../../views/components/modalsV2/calendar/UpdateSessionSlot';
import CreateSessionModal from '../../../views/components/modalsV2/calendar/CreateSessionModal';

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
	});
	const expandRef = useRef(null);

	useEffect(() => {
		const hasItems = Array.isArray(schedulerList) && schedulerList.length > 0;
		if (hasItems && !info.expanded) {
			setInfo((prev) => ({ ...prev, expanded: true }));
		}
	}, [schedulerList]);

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
				isSessionModalOpen: true,
				isSessionEditable: true,
				selectedCalendarSession: session,
			}));
			updateCalendarInfo('selectedSession', session);
		},
		[updateCalendarInfo],
	);

	const handleCheckboxChange = (sessionId) => {
		if (!sessionId) return;

		const defaultSession = Array.isArray(schedulerList)
			? schedulerList.find((session) => session?.sessionName?.toLowerCase() === 'all')?._id
			: null;

		if (!defaultSession) return;

		if (sessionId === defaultSession) {
			const updatedFilter = sessionFilter?.includes(defaultSession)
				? [defaultSession]
				: [defaultSession];
			updateCalendarInfo('sessionFilter', updatedFilter);
			return;
		}

		let updatedFilter;
		if (sessionFilter?.includes(sessionId)) {
			updatedFilter = sessionFilter?.filter((id) => id !== sessionId);
			if (updatedFilter.length === 0) {
				updatedFilter = [defaultSession];
			}
		} else {
			updatedFilter = [...sessionFilter?.filter((id) => id !== defaultSession), sessionId];
		}

		updateCalendarInfo('sessionFilter', updatedFilter);
	};

	return (
		<>
			<div
				className={`categoriesParentContainer ${info?.expanded ? 'expanded' : ''}`}
				ref={expandRef}
			>
				<div className="categoriesHeadWrapper">
					<div className="headerContainer">
						<span className="headLabel">Sessions</span>
					</div>
					<div className="headerButtonsContainer">
						<div className="addCategoryButton" onClick={handleAddSessionClick}>
							<PlusSvg />
						</div>
						<div className="expandIcon" onClick={handleSessionExpand}>
							<DownSvg />
						</div>
					</div>
				</div>

				{info?.expanded && Array.isArray(schedulerList) && (
					<div className="categoriesContainer">
						{schedulerList.map((session) => {
							if (!session || typeof session !== 'object') return null;

							const isChecked =
								Array.isArray(sessionFilter) &&
								sessionFilter.includes(session?._id);
							return (
								<div className="categoryTypeContainer" key={session?._id}>
									<div className="typeWrapper">
										<span
											className="statusIndicator"
											style={{
												backgroundColor: session?.sessionColor || '#6366F1',
											}}
										></span>
										<label
											htmlFor={`${session?.sessionName}-checkbox`}
											className="typeLabel"
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
