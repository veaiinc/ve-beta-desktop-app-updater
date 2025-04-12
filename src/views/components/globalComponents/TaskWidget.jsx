import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/globalComponents/taskWidget.scss';
import { ReactComponent as DownArrowIcon } from '../../../assets/svg/chat/downArrow.svg';
import { ReactComponent as FiltersIcon } from '../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as AutomationIcon } from '../../../assets/svg/contacts/automation.svg';
import { ReactComponent as DeepSearchIcon } from '../../../assets/svg/contacts/deepsearch.svg';
import { ReactComponent as TaskSuggestionIcon } from '../../../assets/svg/contacts/tasksuggestion.svg';
import { PromptData } from '../homePage/PromptData.js';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import PromptPopup from '../homePage/PromptPopup.jsx';

const iconMap = {
	automation: <AutomationIcon />,
	deepsearch: <DeepSearchIcon />,
	task: <TaskSuggestionIcon />,
};

const skeletonLoaders = Array.from({ length: 6 }, (_, index) => index + 1);
const TaskWidget = ({ width, height }) => {
	const navigate = useNavigate();
	const {
		tasks: { listTasks, getListItems, hasNextPage },
	} = useContext(Context);

	const [info, setInfo] = useState({
		limit: 20,
		page: 1,
		loading: false,
		promptPopupOpen: false,
		selectedCard: null,
	});
	useEffect(() => {
		if (!listTasks) {
			getTasksList(info?.page);
		}
	}, []);

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

	const handlePromptPopup = (item) => {
		setInfo((prev) => ({ ...prev, promptPopupOpen: true, selectedCard: item }));
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
						<div className="taskWidgetBodyHeaderRight">
							<div className="taskWidgetDaysFilter">
								<span>Today</span>
								<DownArrowIcon />
							</div>
							<FiltersIcon />
						</div>
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
										<div className="taskWidgetOption">
											<div className="taskWidgetSelectOption"></div>
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
					<PlusIcon />
				</div>
			</div>
		</div>
	);
};

export default memo(TaskWidget);
