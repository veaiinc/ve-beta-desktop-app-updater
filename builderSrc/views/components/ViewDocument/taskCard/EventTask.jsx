// import React, { useContext, useState } from 'react';
// import './TaskCard.scss';
// import Select from '../../../../../src/views/components/tasks/listView/Select';
// import Context from '../../../../../src/context/context';

// export const EventTask = ({ event, updateEvent }) => {
// 	const {
// 		companyInfo: { getTeamMembers, tenantsUserList },
// 	} = useContext(Context);
// 	const [eventData, setEventData] = useState({
// 		title: event?.title,
// 		date: event?.date,
// 		location: event?.location,
// 		event: event,
// 	});
// 	useEffect(() => {
// 		if (!tenantsUserList || tenantsUserList.length === 0) {
// 			getTeamMembers();
// 		}
// 	}, []);
// 	const updateEvent = (event, updateObj) => {
// 		setEventData((prev) => ({
// 			...prev,
// 			event: prev.event.map((item) =>
// 				item.key === event.key ? { ...item, ...updateObj } : item,
// 			),
// 		}));
// 		console.log(eventData.event, 'eventData');
// 		// updateEvent(event);
// 	};
// 	return (
// 		<div style={{ margin: '10px' }} className="taskCard">
// 			<div className="taskCard-body">
// 				<div className="taskCard-row">
// 					{eventData?.event?.map((item, index) => (
// 						<div key={index}>
// 							<div className="taskCard-info">
// 								<div className="taskCard-label">{`${item?.categories?.length} ${item?.type}`}</div>
// 								<div className="taskCard-value">
// 									<Select
// 										options={tenantsUserList}
// 										value={item?.assignedTo || { tenantUsers: [] }}
// 										onChange={(e) =>
// 											updateEvent(event, { assignedTo: e.target.value })
// 										}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
//
