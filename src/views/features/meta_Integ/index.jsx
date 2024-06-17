import React, { memo, useState, useCallback, useContext, useEffect, useRef } from 'react';
import '../../../assets/scss/chat/chatStyling.scss';
import { ReactComponent as SearchSvg } from '../../../assets/svg/chat/search.svg';
import { ReactComponent as FilterSvg } from '../../../assets/svg/chat/filter.svg';
import { ReactComponent as StarSvg } from '../../../assets/svg/chat/star.svg';
import { ReactComponent as SubmitSvg } from '../../../assets/svg/chat/submitBtn.svg';
import ChannelCard from './ChannelCard';
import MessageCard from './MessageCard';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
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
		},
	} = useContext(Context);
	const location = useLocation();
	const { pageInfoData } = location.state || {};
	const { workspaceId } = useParams();

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeFilter: 'inbox',
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
	});
	const socketRef = useRef(null);
	//websocket connection

	useEffect(() => {
		getAllChannelsList(1, false);
		const usertoken = localStorage.getItem('usertoken');
		const url = `wss://yoxagmjgr1.execute-api.ap-south-1.amazonaws.com/production/?workspaceId=${workspaceId}&pageId=${info?.pageId}&token=${usertoken}`;
		socketRef.current = new WebSocket(url);
		socketRef.current.onopen = () => {
			console.log('Connected to WebSocket server');
		};

		socketRef.current.onclose = () => {
			console.log('Disconnected from WebSocket server');
		};

		return () => {
			socketRef.current.close();
		};
	}, []);

	useEffect(() => {
		socketRef.current.onmessage = (event) => {
			if (event.data === 'Message sent') {
				return;
			}
			const message = JSON.parse(event.data);
			if (message?.senderId === info?.seletedChannel?.userId) {
				let updatedMessageList = info?.messagesList?.length ? [...info?.messagesList] : [];
				updatedMessageList?.unshift(message);
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
	}, [info?.seletedChannel, info?.messagesList, info?.channelMapper, socketRef]);

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
			setInfo((prev) => ({
				...prev,
				messageListHasNextPage: hasNextPage,
				messageListCurrentPage: currentPage,
				messagesList: data,
				messageListLoader: false,
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

	//function definations

	const getAllChannelsList = useCallback(
		async (page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 10,
					page: page,
					pageId: info?.pageId,
					sortBy: 'lastMessageAt',
					sortType: -1,
				},
			};
			getAllUsersFromMeta(info?.workspaceId, payload, fetchMore);
		},
		[info?.workspaceId, info?.pageId],
	);

	const getAllChannelConversation = useCallback(
		async (page, item, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 10,
					page: page,
					pageId: info?.pageId,
					userId: item?.userId,
					sortBy: 'createdAt',
					sortType: -1,
				},
			};
			getAllUsersConversation(info?.workspaceId, payload, fetchMore);
		},
		[info?.workspaceId, info?.pageId],
	);

	const handleKeyDown = useCallback(
		async (event, type) => {
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
						pageId: info?.pageId,
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
			info?.pageId,
			info?.pageInfo,
		],
	);

	const onFilterClick = useCallback(
		async (item) => {
			if (info?.activeFilter === item) {
				return;
			}
			setInfo((prev) => ({ ...prev, activeFilter: item }));
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
				pageId: info?.pageId,
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
		[info?.seletedChannel, info?.workspaceId, info?.channelList],
	);

	const fetchMoreChannels = useCallback(async () => {
		getAllChannelsList(info?.channelListCurrentPage + 1, true);
	}, [info?.channelListCurrentPage]);

	const fetchMoreChannelsMessages = useCallback(async () => {
		getAllChannelConversation(
			info?.messageListCurrentPage + 1,
			{ ...info?.seletedChannel },
			true,
		);
	}, [info?.messageListCurrentPage, info?.seletedChannel]);

	return (
		<div className="parentContainer">
			<div className="childContainer">
				<div className="topbar">
					<div className="filterContainer">
						<div
							onClick={() => onFilterClick('inbox')}
							className={`filterButton ${
								info?.activeFilter === 'inbox' ? 'active' : ''
							}`}
						>
							Inbox
							<span>1000</span>
						</div>
						<div
							onClick={() => onFilterClick('watsapp')}
							className={`filterButton ${
								info?.activeFilter === 'watsapp' ? 'active' : ''
							}`}
						>
							WhatsApp <span>1000</span>
						</div>
						<div
							onClick={() => onFilterClick('instagram')}
							className={`filterButton ${
								info?.activeFilter === 'instagram' ? 'active' : ''
							}`}
						>
							Instagram <span>1000</span>
						</div>
						<div
							onClick={() => onFilterClick('facebook')}
							className={`filterButton ${
								info?.activeFilter === 'facebook' ? 'active' : ''
							}`}
						>
							FaceBook <span>1000</span>
						</div>
						<div
							onClick={() => onFilterClick('email')}
							className={`filterButton ${
								info?.activeFilter === 'email' ? 'active' : ''
							}`}
						>
							Email <span>1000</span>
						</div>
					</div>
					<div className="searchContainer">
						<SearchSvg />
						<input type="text" placeholder="Search" />
						<FilterSvg />
					</div>
				</div>
				<div className="chatContainer">
					<div className="channelsList" id="scrollableDiv">
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
									style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
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
										/>
									))}
								</InfiniteScroll>
							</div>
						)}
					</div>
					<div className="selectedChannel">
						{!info?.seletedChannel ? (
							<div className="noChannelSelectedEmptyContainer">
								Please Select a channell
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
													<Spinner width={'12px'} height={'12px'} />
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
													activeChannel={{ ...info?.seletedChannel }}
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
				</div>
			</div>
		</div>
	);
};

export default memo(ChatScreen);
