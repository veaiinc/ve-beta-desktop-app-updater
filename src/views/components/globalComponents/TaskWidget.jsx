import React, { memo, useContext, useEffect, useState, useMemo } from 'react';
import '../../../assets/scss/globalComponents/taskWidget.scss';
import { ReactComponent as DownArrowIcon } from '../../../assets/svg/chat/downArrow.svg';
import { ReactComponent as FiltersIcon } from '../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import ListViewSidebar from '../modalsV2/tasks/ListViewSidebar';
import { colors, rowTypes } from '../../features/tasks/Tasks';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import CreateTaskPopup from '../modalsV2/tasks/CreateTaskPopup';

const skeletonLoaders = Array.from({ length: 6 }, (_, index) => index + 1);

const options = [
	{ id: 1, title: 'Pending Tasks', value: 'pending' },
	{ id: 2, title: 'Today', value: 'today' },
	{ id: 3, title: 'Overdue', value: 'overdue' },
];
const TaskWidget = ({ width, height }) => {
	const navigate = useNavigate();
	const {
		tasks: { listTasks, getListItems, hasNextPage, taskMetadata, getTaskMetadata },
		companyInfo: { getTeamMembers, tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		limit: 20,
		page: 1,
		loading: false,
		promptPopupOpen: false,
		selectedCard: null,
		isModalOpen: false,
		selectedTask: null,
		tenantUsers: [],
		taskMetadata: null,
		createTaskPopup: false,
	});
	useEffect(() => {
		if (!listTasks) {
			getTasksList(info?.page);
		}
	}, []);

	const responseMetadata = useMemo(
		() => ({
			title: {
				type: 'text',
				name: 'Title',
				Icon: textSvg,
				props: {},
				doSplit: true,
				isTitle: true,
			},
			description: { type: 'text', name: 'Description', Icon: textSvg, props: {} },
			status: {
				type: 'status',
				name: 'Status',
				Icon: PieSvg,
				props: {
					options: {
						todo: info?.taskMetadata?.todoGroupLabels,
						inProgress: info?.taskMetadata?.inProgressGroupLabels,
						completed: info?.taskMetadata?.completedGroupLabels,
					},
				},
			},
			priority: {
				type: 'select',
				name: 'Priority',
				Icon: PrioritySvg,
				props: {
					options: [
						{ label: 'Low', _id: 'low', color: '1' },
						{ label: 'Medium', _id: 'medium', color: '2' },
						{ label: 'High', _id: 'high', color: '3' },
					],
				},
			},
			parentTask: {
				type: 'parentTask',
				name: 'Parent Task',
				Icon: WorkflowSvg,
				props: { options: info?.parentTasks },
			},
			childTasks: {
				type: 'childTasks',
				name: 'Sub Tasks',
				Icon: WorkflowSvg,
				props: {},
			},
			assignedTo: {
				type: 'person',
				name: 'Assigned To',
				Icon: PersonSvg,
				props: {
					options: info?.tenantUsers || [],
					multiSelect: true,
					parseValue: true,
				},
			},
			dueDate: { type: 'date', name: 'Due Date', Icon: ClockSvg, props: {} },
			assignedBy: {
				type: 'person',
				name: 'Assigned By',
				Icon: PersonSvg,
				props: {
					options: info?.tenantUsers || [],
					disabled: true,
					parseValue: true,
				},
			},
			assignedAt: {
				type: 'date',
				name: 'Assigned At',
				Icon: ClockSvg,
				props: { timestamp: true },
			},
			completedAt: { type: 'date', name: 'Completed At', Icon: CalendarSvg, props: {} },
			createdAt: {
				type: 'date',
				name: 'Created At',
				Icon: CalendarSvg,
				props: { timestamp: true },
			},
			updatedAt: {
				type: 'date',
				name: 'Updated At',
				Icon: CalendarSvg,
				props: { timestamp: true },
			},
			createdBy: {
				type: 'person',
				name: 'Created By',
				Icon: PersonSvg,
				props: { options: info?.tenantUsers, disabled: true, parseValue: true },
			},
			updatedBy: {
				type: 'person',
				name: 'Updated By',
				Icon: PersonSvg,
				props: { options: info?.tenantUsers, disabled: true, parseValue: true },
			},
			taskSlNo: {
				type: 'id',
				name: 'Id',
				Icon: textSvg,
				props: { prefix: info?.taskMetadata?.prefix },
			},
			clients: {
				type: 'personMultiSelect',
				name: 'Clients',
				Icon: PersonSvg,
				props: {},
			},
		}),
		[info?.tenantUsers, info?.taskMetadata],
	);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = tenantsUserList?.map(({ firstName, lastName, _id }) => ({
				label: `${firstName} ${lastName}`,
				value: _id,
			}));

			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
			}));
		}
	}, [tenantsUserList]);

	useEffect(() => {
		if (!taskMetadata) {
			getTaskMetadata();
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskMetadata: taskMetadata,
			}));
		}
	}, [taskMetadata]);

	const getTasksList = async (page) => {
		setInfo((prev) => ({ ...prev, loading: true }));
		const response = await getListItems({
			taskFilterInput: {
				limit: 20,
				page,
			},
		});
		const nextPage = response?.[1]?.data?.listTasks?.currentPage + 1;
		const hasNextPage = response?.[1]?.data?.listTasks?.hasNextPage;
		setInfo((prev) => ({
			...prev,
			loading: false,
			page: nextPage,
			hasNextPage,
		}));
	};

	const fetchMoreData = () => {
		if (hasNextPage) {
			getTasksList(info?.page);
		}
	};

	const handleTaskClick = (tasks) => {
		setInfo((prev) => ({
			...prev,
			selectedTask: tasks,
			isModalOpen: true,
		}));
	};

	const handleModalClose = () => {
		setInfo((prev) => ({
			...prev,
			isModalOpen: false,
		}));
	};
	const handleCreateTaskPopup = () => {
		setInfo((prev) => ({
			...prev,
			createTaskPopup: true,
		}));
	};
	const handleCloseTaskPopup = () => {
		setInfo((prev) => ({
			...prev,
			createTaskPopup: false,
		}));
	};
	return (
		<div className="task-main-container" style={{ width: width }}>
			<div className="taskWidgetContainer">
				<div className="taskWidgetBody">
					<div className="taskWidgetBodyHeader">
						<div className="taskWidgetBodyHeaderLeft">
							<span className="taskWidgetDay">{listTasks?.data?.length}</span>
							<span className="taskWidgetRemainder">Reminder</span>
						</div>
						{/* <div className="taskWidgetBodyHeaderRight">
							<div className="taskWidgetDaysFilter">
								<span>Today</span>
								<DownArrowIcon />
							</div>
							<FiltersIcon />
						</div> */}
					</div>
					<div className="taskWidgetBodyContainer" id="taskWidgetBodyContainer">
						{info?.loading ? (
							skeletonLoaders?.map((item) => (
								<Skeleton
									width="300px"
									height="36px"
									style={{
										'--highlight-color': 'gray',
										'--base-color': 'transparent',
									}}
								/>
							))
						) : (
							<InfiniteScroll
								dataLength={listTasks?.data?.length || 0}
								hasMore={info?.hasNextPage}
								next={fetchMoreData}
								loader={<div>Loading...</div>}
								scrollableTarget="taskWidgetBodyContainer"
								scrollThreshold="90%"
							>
								{listTasks?.data?.map((eachOption) => (
									<>
										{eachOption?.status === 'Overdue' && (
											<div className="taskWidgetStatusContainer">
												<div className="taskWidgetStatusTitle">
													{eachOption?.status}
												</div>
												<hr className="taskWidgetHr" />
											</div>
										)}
										<div
											className="taskWidgetOption"
											onClick={() => handleTaskClick(eachOption)}
										>
											{/* <div className="taskWidgetSelectOption"></div> */}
											<div className="taskWidgetOptionDetails">
												<div className="taskWidgetOptionTitle">
													{eachOption?.title}
												</div>
												<div className="taskWidgetOptionName">
													{eachOption?.createdBy?.name}
												</div>
											</div>
										</div>
									</>
								))}
							</InfiniteScroll>
						)}
					</div>
				</div>
				<div
					className="taskWidgetFooter"
					onClick={() => {
						navigate('/tasks');
					}}
					style={{ cursor: 'pointer' }}
				>
					<div className="taskWidgetFooterTitle">View Task</div>
					<PlusIcon
						onClick={(e) => {
							e.stopPropagation();
							handleCreateTaskPopup();
						}}
					/>
				</div>
			</div>
			<ListViewSidebar
				selectedRow={info?.selectedTask}
				sidebarIsOpen={info?.isModalOpen}
				closeSidebar={handleModalClose}
				handleUpdate={() => {}}
				deleteTask={() => {}}
				rowTypes={rowTypes}
				responseMetadata={responseMetadata}
				properties={info?.properties}
				colors={colors}
				toggleSidebarExpand={
					() => {}
					// updateTaskInfo({ isSidebarExpanded: !info?.isSidebarExpanded })
				}
				isSidebarExpanded={info?.isSidebarExpanded}
				headerText={
					`${info?.taskMetadata?.prefix ? info?.taskMetadata?.prefix + '-' : ''}` +
					(info?.selectedRow?.taskSlNo || '')
				}
				breadCrumbs={info?.breadCrumbs}
				handleBreadCrumbsClick={() => {}}
				// sidebarChildren={
				// 	info?.selectedRow ? (
				// 		<ChildTaskComponent
				// 			parentTaskId={info?.selectedTask?._id}
				// 			childTasks={info?.selectedTask?.childTasks}
				// 			completedStatus={info?.taskMetadata?.completedGroupLabels}
				// 			rowTypes={rowTypes}
				// 			responseMetadata={responseMetadata}
				// 			colors={colors}
				// 			properties={info?.properties}
				// 			onAddButtonClick={handleCreateSubTaskClick}
				// 			handleUpdate={(...args) => updatePropertyValue(...args, true)}
				// 			handleRowClick={handleSubTaskClick}
				// 		/>
				// 	) : null
				// }
			/>
			<CreateTaskPopup
				isOpen={info?.createTaskPopup}
				closeModal={() => handleCloseTaskPopup()}
			/>
		</div>
	);
};

export default memo(TaskWidget);
