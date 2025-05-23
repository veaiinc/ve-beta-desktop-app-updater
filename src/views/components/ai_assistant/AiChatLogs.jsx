import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aichatlogs.scss';
import { ReactComponent as DownArrow } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as Export } from '../../../assets/svg/gallery/download2.svg';
import { ReactComponent as Refresh } from '../../../assets/svg/sidebar/Refresh.svg';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { Tooltip } from 'antd';
import Skeleton from 'react-loading-skeleton';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import moment from 'moment';
import { Markdown } from '../../../helpers/markdownHelper';
import RefershSvg from '../../../assets/svg/sidebar/RefershSvg';
import DownSvg from '../../../assets/svg/activity/DownSvg';

const initialInfo = {
	aiChatLogsList: null,
	chatListLoading: true,
	hasNextPage: false,
	currentPage: 1,
	sourceOptions: ['All', 'Playground', 'Slack', 'Workflows'],
	feedbackOptions: ['All', 'Contains Thumbs up', 'Contains Thumbs down'],
	confidenceScoreOptions: ['All', 'Contains Thumbs up', 'Contains Thumbs down'],
	activeSessionId: null,
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

	const handleRefresh = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			activeSessionId: null,
			aiChatLogsList: null,
			chatListLoading: true,
		}));
		getAiChatLogs(assistant?._id);
	}, [assistant]);

	return (
		<div className="aiChatLogsParentContainer">
			<div className="aiChatLogsContainer">
				<div className="aiChatLogsHeaderContainer">
					<div className="leftActionBtnContainer">
						{/* Date */}
						<div className="chatLogsActionBtn">
							Date <DownSvg />
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
								Source <DownSvg />
							</div>
						</Tooltip>

						{/* Feedback */}
						{/* <Tooltip
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
						</Tooltip> */}

						{/* Confidence Score */}
						{/* <div className="chatLogsActionBtn">
							Confidence Score <DownArrow />
						</div> */}
					</div>

					<div className="rightActionBtnContainer">
						<div className="chatLogsActionBtn" onClick={handleRefresh}>
							Refresh <RefershSvg />
						</div>
						{/* <div className="chatLogsActionBtn">
							Export <Export />
						</div> */}
					</div>
				</div>

				<div className="aiChatLogsBodyContainer">
					<div className="chatListContainer">
						{info?.aiChatLogsList?.length === 0 && (
							<div className="noSelection">No chat logs found</div>
						)}

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
									<div
										key={index}
										className={`chatBlock ${
											ele?.sessionId === info?.activeSessionId ? 'active' : ''
										}`}
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												activeSessionId: ele?.sessionId,
											}))
										}
									>
										<div className="chatHeader">
											<span>hweiuwhd</span>
											<span>
												{moment(ele?.chats?.[0]?.createdAt).format(
													'DD MMM',
												)}
											</span>
										</div>
										<div className="chatBody">
											{ele?.chats?.[0]?.originalQuery || 'Not Found'}
										</div>
									</div>
								))}
							</InfiniteScroll>
						)}
					</div>
					<div className="chatContentContainer">
						{info?.activeSessionId ? (
							<div className="chatMessages">
								{info?.aiChatLogsList
									?.find(
										(session) => session?.sessionId === info?.activeSessionId,
									)
									?.chats?.map((chat, index) => (
										<div key={index} className="chatMessage">
											<div className="query">{chat?.originalQuery}</div>
											<div className="response">
												<span className="agentImage">
													{assistant?.assitant_profile_picture_s3Key ? (
														<img
															src={
																assistant?.assitant_profile_picture_s3Key
															}
															alt="response"
														/>
													) : (
														<AgentIcon width={20} height={20} />
													)}
												</span>
												<span className="responseText">
													<Markdown>{chat?.response}</Markdown>
												</span>
											</div>
										</div>
									))}
							</div>
						) : (
							<div className="noSelection">
								Select a chat to view the conversation
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AiChatLogs);
