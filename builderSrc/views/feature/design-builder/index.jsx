import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import withRouter from '../../../hooks/index';
import '../../../assets/scss/design-builder/index.scss';
import { ReactComponent as BackIcon } from '../../../assets/svg/designBuilder/back.svg';
import { ReactComponent as SidebarIcon } from '../../../assets/svg/designBuilder/sidebar.svg';
import { ReactComponent as RightArrowIcon } from '../../../assets/svg/designBuilder/rightArrow.svg';
import { Markdown, TypingEffect } from '../../../helper/markdownHelper';
import OutlineModal from './OutlineModal';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { message, Skeleton } from 'antd';
import WidgetContainer from './WidgetContainer';
import WidgetForFiles from './WidgetForFiles';
import SavePopup from './SavePopup';
import DesignCanvas from './DesignCanvas';
import { useNavigate } from 'react-router-dom';

const DesignBuilder = () => {
	const {
		designBuilder: {
			getAiResponseForDesignBuilderQuery,
			showRightModalContextState,
			updateStateValues,
		},
	} = useContext(Context);

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		chatQuery: '',
		chatMessages: [
			{
				type: 'AI',
				message: 'Hey! Need help? Ask me anything.',
			},
		],
		showRightModal: false,
		chatLoading: false,
		chatSessionId: ObjectID().toString(),
		slugData: null,
		sessionId: null,
		savePopup: false,
		modalData: null,
		executeFetchCall: false,
	});

	const chatMessagesRef = useRef(info.chatMessages);
	const chatContentRef = useRef(null);
	const textAreaRef = useRef(null);

	useEffect(() => {
		chatMessagesRef.current = info.chatMessages;
		smoothScrollToBottom();
	}, [info.chatMessages]);

	const handleSendMessageFunc = useCallback(
		async (e, click = null) => {
			if (e?.key === 'Enter' || click) {
				if (e?.shiftKey) {
					return;
				}

				if (info?.chatLoading) {
					return message.error('Please wait for the previous response to complete.');
				}
				if (!info?.chatQuery?.trim()?.length) {
					return;
				}

				setInfo((prev) => ({ ...prev, chatLoading: true }));

				let chatMessages = [...(chatMessagesRef.current || [])];
				const newChatMessages = [
					{ type: 'user', message: info?.chatQuery || '', contentType: 'messagse' },
					{
						type: 'AI',
						message: 'loading....',
						content: (
							<Skeleton
								active
								avatar
								paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
								// style={{ padding: '12px' }}
							/>
						),
						contentType: 'loading',
					},
				];

				chatMessages = [...chatMessages, ...newChatMessages];

				setInfo((prev) => ({ ...prev, chatMessages: chatMessages, chatQuery: '' }));

				const payload = {
					query: info?.chatQuery || '',
					// updated_outline: null,
					// regenerate_design: false,
					// done: false,
					// slug: null,
				};

				// if (info?.slugData) {
				// 	payload.slug = info?.slugData?.workflow_slug;
				// }
				const response = await getAiResponseForDesignBuilderQuery(
					payload,
					info?.chatSessionId,
				);

				if (response?.[0]) {
					handleResponse(response?.[1]);
				}
			}
		},
		[info],
	);

	const handleRegenerate = useCallback(
		async (payload) => {
			setInfo((prev) => ({ ...prev, chatLoading: true }));
			let chatMessages = [...(chatMessagesRef.current || [])];
			const newChatMessages = [
				{
					type: 'AI',
					message: 'loading....',
					content: (
						<Skeleton
							active
							avatar
							paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
						/>
					),
					contentType: 'loading',
				},
			];

			chatMessages = [...chatMessages, ...newChatMessages];
			setInfo((prev) => ({ ...prev, chatMessages: chatMessages }));

			const updatedPayload = {
				query: '',
				updated_outline: null,
				regenerate_design: payload,
				done: false,
			};

			// if (info?.slugData) {
			// 	updatedPayload.slug = info?.slugData?.workflow_slug;
			// }
			const response = await getAiResponseForDesignBuilderQuery(
				updatedPayload,
				info?.chatSessionId,
			);

			if (response?.[0]) {
				handleResponse(response?.[1]);
			}
		},
		[info, chatMessagesRef],
	);

	const handleDone = useCallback(
		async (payload = {}) => {
			setInfo((prev) => ({ ...prev, chatLoading: true }));
			let chatMessages = [...(chatMessagesRef.current || [])];
			const newChatMessages = [
				{
					type: 'AI',
					message: 'loading....',
					content: (
						<Skeleton
							active
							avatar
							paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
						/>
					),
					contentType: 'loading',
				},
			];

			chatMessages = [...chatMessages, ...newChatMessages];
			setInfo((prev) => ({ ...prev, chatMessages: chatMessages }));
			let updatedPayload = {
				query: null,
				regenerate_design: false,
				done: true,
				...(payload || {}),
			};

			if (info?.slugData) {
				updatedPayload.slug = info?.slugData?.workflow_slug;
			}
			const response = await getAiResponseForDesignBuilderQuery(
				updatedPayload,
				info?.chatSessionId,
			);

			if (response?.[0]) {
				handleResponse(response?.[1]);
			}
		},
		[info, chatMessagesRef],
	);

	const handleResponse = useCallback(
		(data) => {
			let updatedChatMessages = [...(chatMessagesRef.current || [])];
			// let slugData = info?.slugData;
			let obj = {};

			updatedChatMessages = updatedChatMessages?.filter(
				(ele) => ele?.contentType !== 'loading',
			);

			if (data?.status === 'error') {
				updatedChatMessages = [
					...updatedChatMessages,
					{
						type: 'AI',
						message: data?.message || '',
					},
				];
			} else if (data?.answer?.allModulesSaved) {
				updatedChatMessages = [
					...updatedChatMessages,
					{
						type: 'AI',
						message: data?.answer?.[0]?.text_to_display || '',
					},
				];
			} else if (data?.answer?.modules?.length) {
				updatedChatMessages = [
					...updatedChatMessages,
					{
						type: 'AI',
						content: (
							<DesignCanvas
								data={data?.answer}
								handleAddNewPage={handleAddNewPage}
								handleRegenerate={handleRegenerate}
							/>
						),
						contentType: 'message',
					},
				];
				obj = { modalData: data?.answer };
			} else {
				updatedChatMessages = [
					...updatedChatMessages,
					{
						type: 'AI',
						message: data?.answer?.text_to_display || '',
					},
				];
			}

			// if (data?.slug) {
			// 	slugData = { ...slugData, ...data?.slug };
			// }

			setInfo((prev) => ({
				...prev,
				...obj,
				chatMessages: updatedChatMessages,
				// slugData,
				chatLoading: false,
				sessionId: data?.session_id ? data?.session_id : prev?.sessionId,
			}));
		},
		[info, chatMessagesRef, handleDone],
	);

	const toggleRightModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, showRightModal: !prev?.showRightModal }));
		updateStateValues({ showRightModalContextState: !showRightModalContextState });
	}, [info]);

	const handleAddNewPage = useCallback(
		(type, value) => {
			if (textAreaRef?.current) {
				textAreaRef.current.focus();
			}
			let chatQuery = 'Add one more page';
			if (type === 'addNewCard') {
				chatQuery = value;
			}

			updateStateValues({ showRightModalContextState: false });
			setInfo((prev) => ({ ...prev, chatQuery, showRightModal: false }));
		},
		[info],
	);

	const smoothScrollToBottom = useCallback(() => {
		if (chatContentRef?.current) {
			chatContentRef.current.scrollTo({
				top: chatContentRef.current.scrollHeight,
				behavior: 'smooth', // Enables smooth scrolling
			});
		}
	}, [chatContentRef]);

	const onClickBuilthisSite = useCallback(async () => {
		//you need ti add char call with payload done true
		setInfo((prev) => ({ ...prev, savePopup: true }));
		const response = await getAiResponseForDesignBuilderQuery(
			{
				updated_outline: info?.modalData,
				done: true,
			},
			info?.chatSessionId,
		);

		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, savePopup: true, executeFetchCall: true }));
		}
	}, [info]);

	const handleUpdateModuleTitle = async (modules) => {
		const payload = {
			updated_outline: {
				...info?.modalData,
				modules: modules,
			},
		};
		const response = await getAiResponseForDesignBuilderQuery(payload, info?.chatSessionId);
		if (response?.[0] && response?.[1]?.status !== 'error') {
			handleResponse(response?.[1]);
		}
	};

	return (
		<div className="designBuilderParentContainer">
			<div className="designBuilderHeaderContainer">
				<SidebarIcon />
				<div className="designBuilderInnerHeaderContainer">
					<div className="designBackButtonContainer" onClick={() => navigate(-1)}>
						<BackIcon />
						<span>Back to Document</span>
					</div>
					<span onClick={toggleRightModal}>
						<SidebarIcon />
					</span>
				</div>
			</div>
			<div
				className="designBuilderContentContainer"
				ref={chatContentRef}
				style={{ width: info?.showRightModal ? 'calc(100% - 400px)' : '' }}
			>
				<div className="designBuilderChatParentContainer">
					{info?.chatMessages?.map((chat, index) =>
						chat?.content ? (
							chat?.content
						) : (
							<div
								key={index}
								className={`chat-message ${chat?.type?.toLowerCase()}-message`}
							>
								<div className="message-content">
									{chat?.type?.toLowerCase() === 'ai' ? (
										<div className="content">
											<TypingEffect text={chat?.message} />
										</div>
									) : (
										<Markdown>{chat?.message}</Markdown>
									)}
								</div>
							</div>
						),
					)}
				</div>
			</div>
			<div
				className="chatActionContainer"
				style={{ width: info?.showRightModal ? 'calc(100% - 400px)' : '' }}
			>
				<div className="followUpQueryContainer">
					{info?.modalData ? (
						<div className="followUpQueryBtnContainer" onClick={onClickBuilthisSite}>
							Build this site <RightArrowIcon />
						</div>
					) : (
						''
					)}
				</div>
				{!info?.savePopup ? (
					<div className={`chatInputParentContainer`}>
						<textarea
							ref={textAreaRef}
							type="text"
							placeholder="Hey! Need help? Ask me anything."
							value={info?.chatQuery}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, chatQuery: e.target.value }))
							}
							onKeyDown={handleSendMessageFunc}
							className="textArea"
							rows={1}
						/>
					</div>
				) : (
					''
				)}
			</div>
			<OutlineModal
				open={info?.showRightModal}
				onClose={toggleRightModal}
				data={info?.modalData}
				handleAddNewPage={handleAddNewPage}
				handleUpdateModuleTitle={handleUpdateModuleTitle}
			/>
			<SavePopup
				modalIsOpen={info?.savePopup}
				modifiedCloseModal={() =>
					setInfo((prev) => ({ ...prev, savePopup: false, executeFetchCall: false }))
				}
				sessionId={info?.chatSessionId}
				executeFetchCall={info?.executeFetchCall}
			/>
		</div>
	);
};

export default memo(withRouter(DesignBuilder));
