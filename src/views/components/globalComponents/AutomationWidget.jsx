import React, { useContext, useState, useEffect } from 'react';
import '../../../assets/scss/globalComponents/automationWidget.scss';
import { ReactComponent as AiSuggest } from '../../../assets/svg/aiIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/svg/arrowRightIcon.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as AutomationIcon } from '../../../assets/svg/contacts/automation.svg';
import { ReactComponent as DeepSearchIcon } from '../../../assets/svg/contacts/deepsearch.svg';
import { ReactComponent as TaskSuggestionIcon } from '../../../assets/svg/contacts/tasksuggestion.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { PromptData } from '../homePage/PromptData.js';
import PromptPopup from '../homePage/PromptPopup.jsx';
const iconMap = {
	automation: <AutomationIcon />,
	deepsearch: <DeepSearchIcon />,
	tasksuggestion: <TaskSuggestionIcon />,
};
const statusColors = {
	published: '#B2FF00',
	unpublished: '#93989F',
	draft: '#FF5960',
};
const limit = 10;
const append = true;

const infiniteScrollStyle = {
	display: 'flex',
	alignItems: 'flex-start',
	flexDirection: 'column',
	gap: '12px',
	width: '100%',
};

const skeletonLoaders = Array.from({ length: 5 }, (_, index) => index + 1);
const AutomationWidget = ({ width, height }) => {
	const navigate = useNavigate();
	const {
		automationBuilder: { automationsList, getAutomationsList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isLoading: false,
		promptPopupOpen: false,
		selectedCard: null,
	});
	const automations = automationsList?.data;
	const automationsLoading = automationsList ? false : true;
	const automationsLength = automations?.length ?? 0;
	const automationsEmpty = automationsLength === 0 && !automationsLoading;
	const automationsHasNextPage = Boolean(automationsList?.hasNextPage);
	const automationsCurrentPage = Number(automationsList?.currentPage) || 1;

	useEffect(() => {
		if (!automationsList) {
			fetchAutomation();
		}
	}, []);

	const fetchNextAutomations = () => {
		if (automationsHasNextPage) {
			const page = automationsCurrentPage + 1;
			getAutomationsList(page, limit, append);
		}
	};

	const fetchAutomation = async () => {
		setInfo((prev) => ({
			...prev,
			isLoading: true,
		}));
		await getAutomationsList();
		setInfo((prev) => ({
			...prev,
			isLoading: false,
		}));
	};

	const handlePromptPopup = (item) => {
		setInfo((prev) => ({ ...prev, promptPopupOpen: true, selectedCard: item }));
	};

	return (
		<div className="automation" style={{ width: width }}>
			<div className="automationWidgetContainer">
				<div className="automationWidgetBody">
					<div className="automationWidgetBodyHeader" id="automationWidgetBodyHeader">
						{info?.isLoading ? (
							skeletonLoaders?.map((item) => (
								<Skeleton
									width="280px"
									height="36px"
									style={{
										'--highlight-color': 'gray',
										'--base-color': 'transparent',
									}}
								/>
							))
						) : (
							<InfiniteScroll
								dataLength={automationsLength}
								next={fetchNextAutomations}
								hasMore={automationsHasNextPage}
								loader={<div>Loading...</div>}
								scrollableTarget="automationWidgetBodyHeader"
								style={infiniteScrollStyle}
							>
								{automationsList?.data?.map((automation) => (
									<div className="automationWidgetBodyItem">
										<div className="automationWidgetOptionDetails">
											<div className="automationWidgetOptionDetailsTitle">
												{automation.name}
											</div>
											<div
												className="automationWidgetOptionDetailsSubtitle"
												style={{ color: statusColors[automation.status] }}
											>
												{automation.status}
											</div>
										</div>
									</div>
								))}
							</InfiniteScroll>
						)}
					</div>
				</div>
				<div
					className="automationWidgetFooter"
					onClick={() => {
						navigate('/automations');
					}}
					style={{ cursor: 'pointer' }}
				>
					<div className="automationWidgetFooterTitle">View Automations</div>
					<PlusIcon />
				</div>
			</div>
			<div className="automationWidgetSection2">
				{PromptData.filter((item) => item.type === 'automation').map((item) => (
					<div
						className="automationWidgetSection2Item"
						onClick={() => handlePromptPopup(item)}
					>
						<div className="automationWidgetSection2ItemContainer">
							{iconMap[item.type]}
							<div className="automationWidgetSection2ItemTitle">
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</div>
						</div>
						<div
							className="automationWidgetSection2ItemSubtitle
"
						>
							{item.title}
						</div>
					</div>
				))}
			</div>
			<PromptPopup
				open={info?.promptPopupOpen}
				closeModal={() =>
					setInfo((prev) => ({ ...prev, promptPopupOpen: false, selectedCard: null }))
				}
				selectedCard={info?.selectedCard}
			/>
		</div>
	);
};

export default AutomationWidget;
