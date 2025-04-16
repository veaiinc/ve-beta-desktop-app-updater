import React, { useContext, useState, useEffect } from 'react';
import '../../../assets/scss/globalComponents/automationWidget.scss';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { message } from '../globalComponents/CustomToast';
import AutomationLoaderModal from '../modalsV2/automationBuilder/AutomationLoaderModal';

const statusColors = {
	published: 'var(--success)',
	unpublished: 'orange',
	draft: 'orange',
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
		automationBuilder: { automationsList, getAutomationsList, createAutomation },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isLoading: false,
		promptPopupOpen: false,
		selectedAutomation: null,
		loading: false,
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
	const handleAutomationClick = (automation) => {
		navigate(`/automation-builder/${automation?._id}`);
	};

	const handleCreateAutomation = async () => {
		if (info?.loading) return; // Prevent multiple clicks
		try {
			setInfo((prev) => ({
				...prev,
				loading: true,
				promptPopupOpen: false, // Adjust as needed
			}));
			const response = await createAutomation({
				name: 'Untitled Automation',
				version: 1,
				steps: [],
				status: 'draft',
			});
			if (response?.[0]) {
				navigate(`/automation-builder/${response?.[1]?._id}`);
			} else {
				message.error('Failed to create automation');
			}
		} catch (error) {
			message.error('Failed to create automation');
		} finally {
			setInfo((prev) => ({
				...prev,
				loading: false,
			}));
		}
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
						) : automationsLength > 0 ? (
							<InfiniteScroll
								dataLength={automationsLength}
								next={fetchNextAutomations}
								hasMore={automationsHasNextPage}
								loader={<div>Loading...</div>}
								scrollableTarget="automationWidgetBodyHeader"
								style={infiniteScrollStyle}
							>
								{automationsList?.data?.map((automation) => (
									<div
										className="automationWidgetBodyItem"
										onClick={() => handleAutomationClick(automation)}
									>
										<div className="automationWidgetOptionDetails">
											<div className="automationWidgetOptionDetailsTitle">
												{automation.name}
											</div>
											<div
												className="automationWidgetOptionDetailsSubtitle"
												style={{
													color: statusColors[automation.status],
												}}
											>
												{automation.status}
											</div>
										</div>
									</div>
								))}
							</InfiniteScroll>
						) : (
							<div className="noAutomations">No automations Found</div>
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
					<PlusIcon
						onClick={(e) => {
							e.stopPropagation();
							handleCreateAutomation();
						}}
					/>
				</div>
			</div>
			<AutomationLoaderModal loading={info?.showLoader} message={info?.loaderMessage} />
		</div>
	);
};

export default AutomationWidget;
