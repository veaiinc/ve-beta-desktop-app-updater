import React, { memo, useState, useCallback, useContext, useEffect, useRef } from 'react';
import '../../../assets/scss/chat/chatStyling.scss';
import { ReactComponent as SearchSvg } from '../../../assets/svg/chat/search.svg';
import { ReactComponent as FilterSvg } from '../../../assets/svg/chat/filter.svg';
import { ReactComponent as StarSvg } from '../../../assets/svg/chat/star.svg';
import { ReactComponent as SubmitSvg } from '../../../assets/svg/chat/submitBtn.svg';
import { ReactComponent as NoSelectedChannel } from '../../../assets/svg/chat/noSelectedChannelState.svg';

import ChannelCard from './ChannelCard';
import MessageCard from './MessageCard';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import DropDown from '../../components/dropDown/DropDown';
import { ReactComponent as Instagram } from '../../../assets/svg/chat/instagram.svg';
import EmptyState, { ExpiredState } from './EmptyState';

const ChatScreen = (props) => {
	let {
		chatInfo: {
			usersList,
			getAllUsersFromMeta,
			getAllUsersConversation,
			messages,
			moreUsersList,
			moreMessages,
			markUnreadMessages,
			getPageInfo,
			pageInfoData,
			getChatFiltersCount,
			chatFiltersCount,
		},
	} = useContext(Context);

	const workspaceId = localStorage.getItem('workspaceId');

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeFilter: 'instagram',
		seletedChannel: null,
		selectedChannelIndex: null,
		messageInputValue: '',
		workspaceId: workspaceId,
		channelListCurrentPage: 1,
		channelListHasNextPage: false,
		channelList: null,
		channelListLoader: true,
		messageListLoader: false,
		messagesList: null,
		messageListCurrentPage: 1,
		messageListHasNextPage: false,
		pageId: pageInfoData?.pageId,
		channelMapper: {},
		pageInfo: pageInfoData || {},
		pageInfo: null,
		allPageInfoData: null,
		restrictedView: false,
		filterChanged: false,
		channelSearch: '',
		channelSearchChanged: false,
		timeout: null,
		responseWindowExpired: false,
	});
	const socketRef = useRef(null);

	//fetching pageinfo data
	useEffect(() => {
		const payload = {
			filters: {
				limit: 100,
				page: 1,
			},
		};

		getPageInfo(payload);
		return () => {
			socketRef?.current?.close();
		};
	}, []);

	useEffect(() => {
		if (pageInfoData) {
			const { data } = pageInfoData;
			if (data?.length) {
				setInfo((prev) => ({
					...prev,
					allPageInfoData: data,
					pageInfo: data?.[0],
					pageId: data?.[0]?.pageId,
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					restrictedView: true,
				}));
			}
		}
	}, [pageInfoData]);

	//websocket connection after fetching pageInfo data
	useEffect(() => {
		if (info?.pageInfo) {
			createWebSocketConnection();
		}
	}, [info?.pageInfo]);

	useEffect(() => {
		if (info?.pageInfo) {
			socketRef.current.onmessage = (event) => {
				if (event.data === 'Message sent') {
					return;
				}

				const message = JSON.parse(event.data);

				if (message?.senderId === info?.seletedChannel?.userId) {
					let updatedMessageList = info?.messagesList?.length
						? [...info?.messagesList]
						: [];
					updatedMessageList?.unshift({ ...message, createdAt: message?.timestamp });
					setInfo((prev) => ({ ...prev, messagesList: updatedMessageList }));
				} else {
					let channelMapper = { ...info?.channelMapper };
					if (channelMapper?.[message?.senderId]) {
						let channelList = [...info?.channelList];
						let targetChannelIndex = channelMapper?.[message?.senderId];
						let targetChannelData = channelList?.[targetChannelIndex];
						targetChannelData.unreadCount = (targetChannelData.unreadCount || 0) + 1;
						channelList?.splice(targetChannelIndex, 1);
						channelList.unshift(targetChannelData);
						setInfo((prev) => ({ ...prev, channelList }));
					} else {
						//call the get channel list api
						getAllChannelsList(1, false);
					}
				}
			};
		}
	}, [info?.seletedChannel, info?.messagesList, info?.channelMapper, socketRef, info?.pageInfo]);

	//useEffects

	useEffect(() => {
		if (usersList) {
			const { currentPage, hasNextPage, data } = usersList;

			setInfo((prev) => ({
				...prev,
				channelListHasNextPage: hasNextPage,
				channelListCurrentPage: currentPage,
				channelList: data,
				channelListLoader: false,
				restrictedView: data?.length ? false : 'emptyChannelList',
			}));
			let obj = {};
			for (let i = 0; i < data?.length; i++) {
				obj[data?.[i]?.userId] = i;
			}
			setInfo((prev) => ({ ...prev, channelMapper: obj }));
		}
	}, [usersList]);

	useEffect(() => {
		if (moreUsersList) {
			const { currentPage, hasNextPage, data } = moreUsersList;
			let lastIndexElement = info?.channelList?.length - 1;
			setInfo((prev) => ({
				...prev,
				channelListHasNextPage: hasNextPage,
				channelListCurrentPage: currentPage,
				channelList: prev?.channelList?.concat(data),
				channelListLoader: false,
			}));

			let obj = {};
			for (let i = 0; i < data?.length; i++) {
				obj[data?.[i]?.userId] = lastIndexElement + 1;
				lastIndexElement++;
			}
			setInfo((prev) => ({ ...prev, channelMapper: { ...prev?.channelMapper, ...obj } }));
		}
	}, [moreUsersList]);

	useEffect(() => {
		if (messages) {
			const { currentPage, data, hasNextPage } = messages;

			if (data?.length) {
				const lastMessageObject = data?.[0];
				const givenMoment = moment.unix(lastMessageObject?.createdAt);
				const currentMoment = moment();
				const differenceInHours = currentMoment.diff(givenMoment, 'hours');
				if (differenceInHours > 24) {
					return setInfo((prev) => ({
						...prev,
						messageListLoader: false,
						responseWindowExpired: true,
					}));
				}
			}
			setInfo((prev) => ({
				...prev,
				messageListHasNextPage: hasNextPage,
				messageListCurrentPage: currentPage,
				messagesList: data,
				messageListLoader: false,
				responseWindowExpired: false,
			}));
		}
	}, [messages]);

	useEffect(() => {
		if (moreMessages) {
			const { currentPage, data, hasNextPage } = moreMessages;
			setInfo((prev) => ({
				...prev,
				messageListHasNextPage: hasNextPage,
				messageListCurrentPage: currentPage,
				messagesList: prev?.messagesList.concat(data),
				messageListLoader: false,
			}));
		}
	}, [moreMessages]);

	useEffect(() => {
		if (info?.filterChanged) {
			getAllChannelsList(1, false);
			setInfo((prev) => ({
				...prev,
				channelListLoader: true,
				seletedChannel: null,
				selectedChannelIndex: null,
			}));
		}
	}, [info?.activeFilter, info?.filterChanged]);

	useEffect(() => {
		if (info?.channelSearchChanged) {
			handleDebounceSearch(info?.channelSearch);
		}
	}, [info?.channelSearch, info?.channelSearchChanged]);

	//function definations
	const createWebSocketConnection = useCallback(() => {
		getAllChannelsList(1, false);
		getFilterCount();
		const usertoken = localStorage.getItem('usertoken');

		const url = `wss://ywpufbslue.execute-api.us-east-1.amazonaws.com/production/?workspaceId=${workspaceId}&pageId=${info?.pageInfo?.pageId}&token=${usertoken}`;
		if (socketRef.current) {
			socketRef.current.close();
		}
		socketRef.current = new WebSocket(url);
		socketRef.current.onopen = () => {
			console.log('Connected to WebSocket server');
		};

		socketRef.current.onclose = () => {
			console.log('Disconnected from WebSocket server');
		};
	}, [info?.pageInfo]);

	const getAllChannelsList = useCallback(
		async (page, fetchMore = false, search = null) => {
			if (!info?.pageInfo) {
				return;
			}
			const payload = {
				filters: {
					limit: 10,
					page: page,
					pageId: info?.pageInfo?.pageId,
					sortBy: 'lastMessageAt',
					sortType: -1,
					platform: info?.activeFilter === 'facebook' ? 'page' : info?.activeFilter,
					search: search,
				},
			};
			getAllUsersFromMeta(info?.workspaceId, payload, fetchMore);
		},
		[info?.workspaceId, info?.pageInfo, info?.activeFilter],
	);

	const getAllChannelConversation = useCallback(
		async (page, item, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 10,
					page: page,
					pageId: info?.pageInfo?.pageId,
					userId: item?.userId,
					sortBy: 'createdAt',
					sortType: -1,
					platform: info?.activeFilter === 'facebook' ? 'page' : info?.activeFilter,
				},
			};
			getAllUsersConversation(info?.workspaceId, payload, fetchMore);
		},
		[info?.workspaceId, info?.pageInfo, info?.activeFilter],
	);

	const handleKeyDown = useCallback(
		async (event, type) => {
			if (info?.responseWindowExpired) {
				return;
			}

			if (event?.key === 'Enter' || type === 'click') {
				if (!info?.messageInputValue) {
					return;
				}

				const data = {
					action: 'sendMessage',
					data: {
						senderId: info?.pageInfo?.userId,
						recipientId: info?.seletedChannel?.userId,
						message: info?.messageInputValue,
						pageAccessToken: info?.pageInfo?.accessToken,
					},
				};
				if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
					socketRef.current.send(JSON.stringify(data));

					const newMessage = {
						pageId: info?.pageInfo?.pageId,
						senderId: info?.pageInfo?.userId,
						messageText: info?.messageInputValue,
						readAt: moment().unix(),
						createdAt: moment().unix(),
						userType: 'page',
						__typename: 'Conversation',
					};
					let updatedMessageList = info?.messagesList?.length
						? [...info?.messagesList]
						: [];
					updatedMessageList?.unshift(newMessage);

					setInfo((prev) => ({
						...prev,
						messageInputValue: '',
						messagesList: updatedMessageList,
					}));
				}
			}
		},
		[
			info?.messageInputValue,
			info?.seletedChannel,
			info?.messagesList,
			info?.pageInfo,
			info?.responseWindowExpired,
		],
	);

	const onFilterClick = useCallback(
		async (item) => {
			if (info?.activeFilter === item) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				activeFilter: item,
				filterChanged: true,
				channelSearch: '',
				channelSearchChanged: false,
			}));
		},
		[info?.activeFilter],
	);
	const onChannelPress = useCallback(
		async (item, index) => {
			if (info?.seletedChannel?._id === item?._id) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				seletedChannel: item,
				selectedChannelIndex: index,
				messageListLoader: true,
				messagesList: null,
				messageListCurrentPage: 1,
				messageListHasNextPage: false,
			}));
			getAllChannelConversation(1, item, false);
			const payload = {
				pageId: info?.pageInfo?.pageId,
				userId: item?.userId,
			};

			const response = await markUnreadMessages(info?.workspaceId, payload);
			if (response?.[0]) {
				let updatedChannelList = [...info?.channelList];
				let targetedChannelListData = updatedChannelList?.[index];
				targetedChannelListData.unreadCount = 0;
				updatedChannelList?.splice(index, 1, targetedChannelListData);
				setInfo((prev) => ({ ...prev, channelList: updatedChannelList }));
			}
		},
		[info?.seletedChannel, info?.workspaceId, info?.channelList, info?.pageInfo],
	);

	const fetchMoreChannels = useCallback(async () => {
		getAllChannelsList(info?.channelListCurrentPage + 1, true);
	}, [info?.channelListCurrentPage, info?.pageInfo]);

	const fetchMoreChannelsMessages = useCallback(async () => {
		getAllChannelConversation(
			info?.messageListCurrentPage + 1,
			{ ...info?.seletedChannel },
			true,
		);
	}, [info?.messageListCurrentPage, info?.seletedChannel]);

	const onPageChange = useCallback(
		(item) => {
			if (info?.pageInfo?.pageId === item.pageId) {
				return;
			}
			setInfo((prev) => ({ ...prev, pageInfo: item }));
		},
		[info?.pageInfo],
	);

	const handleDebounceSearch = useCallback(
		(search) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				getAllChannelsList(1, false, search);
				setInfo((prev) => ({
					...prev,
					channelListLoader: true,

					timeout: null,
				}));
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);

	const getFilterCount = useCallback(async () => {
		const payload = {
			pageId: info?.pageInfo?.pageId,
		};
		getChatFiltersCount(info?.workspaceId, payload);
	}, [info?.workspaceId, info?.pageInfo]);

	return (
		<div className="parentContainer">
			<div className="childContainer">
				<div className="topbar">
					<DropDown
						selectedValue={info?.pageInfo?.pageName}
						options={[...(info?.allPageInfoData || [])]}
						selectedPageId={info?.pageInfo?.pageId}
						onChange={onPageChange}
						iconComponent={<Instagram />}
						valueSelector="pageName"
						uniqueIdKey={'pageId'}
						containerStyle={{ border: '1px solid #2F2F2F' }}
					/>

					<div className="filterContainer">
						<div
							onClick={() => onFilterClick('instagram')}
							className={`filterButton ${
								info?.activeFilter === 'instagram' ? 'active' : ''
							}`}
						>
							Instagram <span>{chatFiltersCount?.['instagram']}</span>
						</div>
						<div
							onClick={() => onFilterClick('facebook')}
							className={`filterButton ${
								info?.activeFilter === 'facebook' ? 'active' : ''
							}`}
						>
							FaceBook <span>{chatFiltersCount?.['page']}</span>
						</div>
						{/* <div
							onClick={() => onFilterClick('email')}
							className={`filterButton ${
								info?.activeFilter === 'email' ? 'active' : ''
							}`}
						>
							Email <span>1000</span>
						</div> */}
					</div>
				</div>
				<div className="chatContainer">
					{info?.restrictedView ? (
						<>
							<EmptyState
								type={info?.restrictedView}
								input={info?.channelSearch}
								onChangeFunc={(value) =>
									setInfo((prev) => ({
										...prev,
										channelSearch: value,
										channelSearchChanged: true,
									}))
								}
							/>
						</>
					) : (
						<>
							<div className="channelsList">
								<div className="searchContainer">
									<SearchSvg />
									<input
										type="text"
										placeholder="Search"
										value={info?.channelSearch}
										onChange={(e) =>
											setInfo((prev) => ({
												...prev,
												channelSearch: e.target.value,
												channelSearchChanged: true,
											}))
										}
										autoFocus={true}
									/>
								</div>
								<div
									style={{ overflowY: 'auto', width: '100%' }}
									id="scrollableDiv"
								>
									{info?.channelListLoader ? (
										<div className="channelListLoader">
											<Spinner />
											<span>Fetching Channels...</span>
										</div>
									) : (
										<div style={{ width: '100%' }}>
											<InfiniteScroll
												dataLength={info?.channelList?.length}
												next={fetchMoreChannels}
												style={{
													display: 'flex',
													flexDirection: 'column',
													gap: '8px',
												}}
												hasMore={info?.channelListHasNextPage}
												loader={
													<div
														style={{
															display: 'flex',
															padding: '12px 16px',
															gap: '12px',
															alignItems: 'center',
															color: '#fff',
														}}
													>
														<Spinner
															color={'#fff'}
															width={'12px'}
															height={'12px'}
														/>
														<span>Loading...</span>
													</div>
												}
												scrollableTarget="scrollableDiv"
											>
												{info?.channelList?.map((ele, index) => (
													<ChannelCard
														active={
															info?.seletedChannel?._id === ele?._id
																? true
																: false
														}
														onChannelPress={onChannelPress}
														item={ele}
														index={index}
														key={index}
														activeFilter={info?.activeFilter}
													/>
												))}
											</InfiniteScroll>
										</div>
									)}
								</div>
							</div>
							<div className="divider"></div>
							<div className="selectedChannel">
								{!info?.seletedChannel ? (
									<div className="noChannelSelectedEmptyContainer">
										<NoSelectedChannel />
										<div className="labelContainer">
											<span className="label">Start a Conversation</span>
											<span className="subLabel">
												Your inbox is empty, but don’t worry! Your messages
												would show up here soon
											</span>
										</div>

										{/* Please Select a channell */}
									</div>
								) : (
									<>
										<div className="header">
											<div
												className="imageContainer"
												style={{
													backgroundImage: `url(${info?.seletedChannel?.displayPicture})`,
												}}
											></div>
											<div className="heading">
												<span className="channelName">
													{info?.seletedChannel?.userName}
												</span>
												<span className="channelSubMessage">
													What are your charges??
												</span>
											</div>
										</div>
										<div className="messageList" id="scrollablereverese">
											{info?.messageListLoader ? (
												<div className="channelListLoader">
													<Spinner />
													<span>Fetching Messages...</span>
												</div>
											) : info?.responseWindowExpired ? (
												<ExpiredState />
											) : (
												<InfiniteScroll
													dataLength={info?.messagesList?.length}
													next={fetchMoreChannelsMessages}
													hasMore={info?.messageListHasNextPage}
													loader={
														<div
															style={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																color: '#fff',
																gap: '12px',
															}}
														>
															<Spinner
																width={'12px'}
																height={'12px'}
															/>
															<span>Fetching More Messages...</span>
														</div>
													}
													style={{
														display: 'flex',
														flex: 1,
														flexDirection: 'column-reverse',
														padding: '24px 0px',
														gap: '20px',
														overflowY: 'auto',
													}}
													inverse={true}
													scrollableTarget={'scrollablereverese'}
												>
													{info?.messagesList?.map((item, index) => (
														<MessageCard
															key={index}
															messageItem={item}
															activeChannel={{
																...info?.seletedChannel,
															}}
															pageInfo={{ ...info?.pageInfo }}
														/>
													))}
												</InfiniteScroll>
											)}
										</div>

										<div className="messageInput">
											<StarSvg />
											<textarea
												className="inputElement"
												value={info?.messageInputValue}
												onChange={(e) =>
													setInfo((prev) => ({
														...prev,
														messageInputValue: e.target.value,
													}))
												}
												onKeyDown={handleKeyDown}
												disabled={info?.responseWindowExpired}
											/>
											<div
												className="submitbtn"
												style={{ cursor: 'pointer' }}
												onClick={() => handleKeyDown(null, 'click')}
											>
												<SubmitSvg />
											</div>
										</div>
									</>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(ChatScreen);
