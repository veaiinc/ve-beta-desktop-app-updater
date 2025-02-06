import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aichatlogs.scss';
import { ReactComponent as DownArrow } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as Export } from '../../../assets/svg/gallery/download2.svg';
import { ReactComponent as Refresh } from '../../../assets/svg/sidebar/Refresh.svg';
import { Tooltip } from 'antd';
import Skeleton from 'react-loading-skeleton';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';

const initialInfo = {
	aiChatLogsList: null,
	chatListLoading: true,
	hasNextPage: false,
	currentPage: 1,
	sourceOptions: ['All', 'Playground', 'Slack', 'Workflows'],
	feedbackOptions: ['All', 'Contains Thumbs up', 'Contains Thumbs down'],
	confidenceScoreOptions: ['All', 'Contains Thumbs up', 'Contains Thumbs down'],
};

const AiChatLogs = ({ assistant }) => {
	const {
		aiSetup: { aiChatLogs, moreAiChatLogs, getAiChatLogs },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialInfo,
		isSourceDropdownOpen: false,
		isConfidenceScoreDropdownOpen: false,
		isFeedbackDropdownOpen: false,
	});

	useEffect(() => {
		return () => {
			setInfo(() => ({
				...initialInfo,
			}));
		};
	}, []);

	useEffect(() => {
		getAiChatLogs(assistant?._id);
	}, [assistant]);

	useEffect(() => {
		if (aiChatLogs) {
			setInfo((prevInfo) => ({
				...prevInfo,
				aiChatLogsList: aiChatLogs?.data,
				hasNextPage: aiChatLogs?.hasNextPage,
				currentPage: aiChatLogs?.currentPage,
				chatListLoading: false,
			}));
		}
	}, [aiChatLogs]);

	useEffect(() => {
		if (moreAiChatLogs) {
			setInfo((prevInfo) => ({
				...prevInfo,
				aiChatLogsList: [...prevInfo?.aiChatLogsList, ...moreAiChatLogs?.data],
				hasNextPage: moreAiChatLogs?.hasNextPage,
				currentPage: moreAiChatLogs?.currentPage,
			}));
		}
	}, [moreAiChatLogs]);

	const fetchMoreChatLogs = useCallback(() => {
		if (info?.hasNextPage) {
			getAiChatLogs(assistant?._id, info?.currentPage + 1, 20, true);
		}
	}, [info?.currentPage, info?.hasNextPage, assistant]);

	return (
		<div className="aiChatLogsParentContainer">
			<div className="aiChatLogsContainer">
				<div className="aiChatLogsHeaderContainer">
					<div className="leftActionBtnContainer">
						{/* Date */}
						<div className="chatLogsActionBtn">
							Date <DownArrow />
						</div>

						{/* Source */}
						<Tooltip
							open={info?.isSourceDropdownOpen}
							onOpenChange={() =>
								setInfo({
									...info,
									isSourceDropdownOpen: !info?.isSourceDropdownOpen,
								})
							}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{info?.sourceOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => {
												setInfo({
													...info,
													isSourceDropdownOpen: false,
												});
											}}
										>
											{option}
										</div>
									))}
								</div>
							}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
						>
							<div className="chatLogsActionBtn">
								Source <DownArrow />
							</div>
						</Tooltip>

						{/* Feedback */}
						<Tooltip
							open={info?.isFeedbackDropdownOpen}
							onOpenChange={() =>
								setInfo({
									...info,
									isFeedbackDropdownOpen: !info?.isFeedbackDropdownOpen,
								})
							}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{info?.feedbackOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => {
												setInfo({
													...info,
													isFeedbackDropdownOpen: false,
												});
											}}
										>
											{option}
										</div>
									))}
								</div>
							}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
						>
							<div className="chatLogsActionBtn">
								Feedback <DownArrow />
							</div>
						</Tooltip>

						{/* Confidence Score */}
						<div className="chatLogsActionBtn">
							Confidence Score <DownArrow />
						</div>
					</div>
					<div className="rightActionBtnContainer">
						<div className="chatLogsActionBtn">
							Refresh <Refresh />
						</div>
						<div className="chatLogsActionBtn">
							Export <Export />
						</div>
					</div>
				</div>

				<div className="aiChatLogsBodyContainer">
					<div className="chatListContainer">
						{info?.chatListLoading ? (
							[{}, {}, {}, {}, {}, {}]?.map((ele, index) => (
								<Skeleton key={index} height={80} />
							))
						) : (
							<InfiniteScroll
								dataLength={info?.aiChatLogsList?.length || 0}
								next={fetchMoreChatLogs}
								hasMore={info?.hasNextPage}
								loader={<FetchMoreLoaderComp />}
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '8px',
									width: '100%',
								}}
								className="tetsing"
								height="calc(100vh - 310px)"
							>
								{info?.aiChatLogsList?.map((ele, index) => (
									<div key={index} className="chat">
										{ele?.chats?.[0]?.originalQuery || 'Not Found'}
									</div>
								))}
							</InfiniteScroll>
						)}
						{info?.aiChatLogsList?.length === 0 && (
							<div className="chat">No chat logs found</div>
						)}
					</div>
					<div className="chatContentContainer">chat body goes here</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AiChatLogs);
