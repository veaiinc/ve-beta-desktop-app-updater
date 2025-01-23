import React, { useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/home_page/tasks.scss';
import { ReactComponent as CheckIcon } from '../../../../assets/svg/home_page/Check.svg';
import Context from '../../../../context/context';
import ListViewSidebar from '../../modalsV2/tasks/ListViewSidebar';
const TasksTab = () => {
	const {
		tasks: { getListItems, listTasks },
	} = useContext(Context);

	const [info, setInfo] = useState({
		sidebarIsOpen: false,
	});

	useEffect(() => {
		getListItems({
			taskFilterInput: {
				limit: 30,
				page: 1,
				filters: [
					{
						key: 'dueDate',
						value: 1737743399,
					},
				],
			},
		});
	}, []);

	const closeSideBar = () => {
		setInfo((prev) => ({
			...prev,
			sidebarIsOpen: false,
		}));
	};
	const openSideBar = () => {
		setInfo((prev) => ({
			...prev,
			sidebarIsOpen: true,
		}));
	};

	return (
		<>
			<div className="tasks">
				<div className="today-tasks">Today</div>
				<div className="tasks-container">
					{listTasks?.data?.map(({ title, assignedTo, description, dueDate }) => {
						return (
							<div className="task-container">
								<div className="task-content">
									<div className="title">{title}</div>
									<div className="description">{description}</div>
								</div>

								<div className="show-more">
									<div className="assigned-to"></div>
									<div className="check-icon-container">
										<CheckIcon />
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<div className="over-due-tasks">Over due</div>
				<div className="tasks-container">
					{listTasks?.data?.map(({ title, assignedTo, description, dueDate }) => {
						return (
							<div className="task-container">
								<div className="task-content">
									<div className="title">{title}</div>
									<div className="description">{description}</div>
								</div>

								<div className="show-more">
									<div className="assigned-to"></div>
									<div className="check-icon-container" onClick={openSideBar}>
										<CheckIcon />
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<ListViewSidebar closeSidebar={closeSideBar} sidebarIsOpen={info?.sidebarIsOpen} />
		</>
	);
};

export default TasksTab;
