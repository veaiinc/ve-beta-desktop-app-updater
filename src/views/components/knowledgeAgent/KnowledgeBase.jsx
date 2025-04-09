import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/knowledgeAgent/knowledgeBase.scss';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';
import { ReactComponent as Pdf } from '../../../assets/svg/ai_assistant/pdf.svg';
import { ReactComponent as Text } from '../../../assets/svg/ai_assistant/tIcon.svg';
import { ReactComponent as Delete } from '../../../assets/svg/ai_assistant/delete.svg';
import AddKnowledgeModal from '../../components/modalsV2/knowledgeAgent/AddKnowledgeModal';
import Context from '../../../context/context';
import ToggleSwitch from '../../components/input/slider';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import Skeleton from 'react-loading-skeleton';
import { message } from '../globalComponents/CustomToast';
import { useParams } from 'react-router-dom';
import Spinner from '../loaders/Spinner';

const iconMapper = {
	pdf: <Pdf style={{ stroke: '#F2F2F3' }} width={12} height={12} />,
	txt: <Text style={{ stroke: '#F2F2F3' }} width={12} height={12} />,
	url: <Link style={{ fill: '#F2F2F3 !important' }} width={12} height={12} />,
};

const fileStatus = {
	notStarted: 'Not Started',
	processing: 'Training...',
	ready: 'Ready',
	error: 'Error',
};

const infinityScrollContainerStyle = {
	minHeight: 'auto',
	maxHeight: 'calc(100vh - 330px)',
	overflowY: 'auto',
};

const infinityScrollComponentStyle = {
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
};

const AiKnowledgeBase = ({ assistant }) => {
	let {
		aiSetup: { updateKnowledgeBaseFile, deleteKnowledge },
		knowledgeAgent: { getKnowledgeBaseInfo, knowledgeBaseInfo, updateKnowledgeAgent },
	} = useContext(Context);

	const { aiAssistantId } = useParams();
	const [info, setInfo] = useState({
		toggleStates: {},
		knowledgeModalOpen: false,
		knowledgeBaseFiles: [],
		assistantId: aiAssistantId,
		loading: true,
		urlStatusLoading: true,
		currentPage: 1,
		hasNextPage: true,
		websearch: false,
		fullWorkspaceAccess: false,
	});

	useEffect(() => {
		if (knowledgeBaseInfo) {
			const { data = [], currentPage, hasNextPage } = knowledgeBaseInfo || [];
			updateInfo({
				knowledgeBaseFiles:
					currentPage === 1 ? data : [...info?.knowledgeBaseFiles, ...data],
				hasNextPage: hasNextPage,
				currentPage: currentPage,
				loading: false,
			});
		}
	}, [knowledgeBaseInfo]);

	useEffect(() => {
		if (assistant?._id) {
			updateInfo({
				websearch: assistant?.websearch,
				fullWorkspaceAccess: assistant?.fullWorkspaceAccess,
			});
			getKnowledgeBaseInfo(assistant?._id);
		}
	}, [assistant?._id]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({
			...prev,
			...data,
		}));
	}, []);

	const handleToggleChange = useCallback(
		async (knowledgeId, value) => {
			try {
				const response = await updateKnowledgeBaseFile(knowledgeId, {
					isActive: value,
				});

				if (response?.[0]) {
					message?.success('Knowledge base file updated successfully');
					const updatedKnowledgeFiles = info?.knowledgeBaseFiles?.map((item) =>
						item?._id === knowledgeId ? { ...item, isActive: !item?.isActive } : item,
					);
					updateInfo({
						knowledgeBaseFiles: updatedKnowledgeFiles,
					});
				} else {
					message?.error('Failed to update knowledge base file');
				}
			} catch (error) {
				message?.error('Failed to update knowledge base file');
			}
		},
		[info?.knowledgeBaseFiles],
	);

	const fetchKnowledgeBaseFiles = useCallback(
		(page = 1) => {
			getKnowledgeBaseInfo(assistant?._id, page, 20);
		},
		[assistant?._id],
	);

	const fetchMoreKnowledgeBaseFiles = useCallback(() => {
		if (info?.hasNextPage) {
			fetchKnowledgeBaseFiles(info?.currentPage + 1, true);
		}
	}, [info?.hasNextPage, info?.currentPage, info?.assistantId]);

	const deleteKnowledgeFile = (knowledgeId) => {
		deleteKnowledge(knowledgeId);
		setInfo((prev) => ({
			...prev,
			knowledgeBaseFiles: prev?.knowledgeBaseFiles?.filter(
				(item) => item?._id !== knowledgeId,
			),
		}));
	};

	const handleSearchWebOrFullAccessChange = async (data) => {
		updateInfo(data);
		const response = await updateKnowledgeAgent(assistant?._id, data);
		if (!response?.[0]) {
			const key = data?.fullWorkspaceAccess ? 'fullWorkspaceAccess' : 'websearch';
			updateInfo({ [key]: !data[key] });
		}
	};

	return (
		<div style={{ width: '100%' }}>
			<div className="agentKnowledgeBaseParentContainer">
				<div className="knowledgeBaseHeaderContainer">
					<div className="knowledgeBaseHeader">
						<span className="lineone">Knowledge Base</span>
						<span className="linetwo">
							Make files available to this AI assistant so it can use them as a source
							of knowledge for chats.
						</span>
					</div>

					<div
						className="addKnowledge"
						onClick={() => setInfo((prev) => ({ ...prev, knowledgeModalOpen: true }))}
					>
						Add a Knowledge
					</div>
				</div>

				<div className="knowledgeBaseListContainer">
					<div className="header">
						<span>Title</span>
						<span>Status</span>
						<span>Active</span>
					</div>

					<div
						className="knowledgeBaseListContainerScrollable"
						id="knowledgeBaseListScrollable"
						style={infinityScrollContainerStyle}
					>
						{info?.loading ? (
							[...Array(7)].map((_, index) => (
								<div key={index} className="knowledgeBaseItemSkeleton">
									<Skeleton width="100%" height="36px" borderRadius="6px" />
								</div>
							))
						) : info?.knowledgeBaseFiles?.length > 0 ? (
							<InfiniteScroll
								dataLength={info?.knowledgeBaseFiles?.length || 0}
								hasMore={info?.hasNextPage}
								next={fetchMoreKnowledgeBaseFiles}
								loader={<FetchMoreLoaderComp />}
								style={infinityScrollComponentStyle}
								scrollableTarget="knowledgeBaseListScrollable"
								scrollThreshold="90%"
							>
								{info?.knowledgeBaseFiles?.map((item) => (
									<div key={item._id} className="knowledgeBaseItem">
										<span>
											{iconMapper?.[item?.sourceType]}
											<p>{item?.name}</p>
											<Delete
												className="deleteKnowledge"
												onClick={() => deleteKnowledgeFile(item?._id)}
											/>
										</span>
										<div className={`${item?.status}`}>
											{item?.status === 'processing' ? (
												<Spinner width="12px" height="12px" />
											) : (
												fileStatus?.[item?.status]
											)}
										</div>
										<span className="aiToggleSwitch">
											<ToggleSwitch
												id={item?.id}
												value={item?.isActive}
												onChange={() =>
													handleToggleChange(item._id, !item?.isActive)
												}
											/>
										</span>
									</div>
								))}
							</InfiniteScroll>
						) : (
							<div className="emptyState">
								<p>No knowledge base files added</p>
								<p>Add files to enhance your AI assistant's knowledge</p>
							</div>
						)}
					</div>
				</div>
				<div className="knowledgeToggleContainer">
					<div className="knowledgeToggleTextWrapper">
						<h2>Add all workspace content</h2>
						<p>
							Let the agent use all shared integrations, files, and other assets in
							this workspace.
						</p>
					</div>
					<span className="toggleSwitchContainer">
						<ToggleSwitch
							value={info?.fullWorkspaceAccess}
							onChange={(value) =>
								handleSearchWebOrFullAccessChange({ fullWorkspaceAccess: value })
							}
						/>
					</span>
				</div>
				<div className="knowledgeToggleContainer">
					<div className="knowledgeToggleTextWrapper">
						<h2>Search the web for information</h2>
						<p>
							Let the agent search and reference information found on websites in
							answers.
						</p>
					</div>
					<span className="toggleSwitchContainer">
						<ToggleSwitch
							value={info?.websearch}
							onChange={(value) =>
								handleSearchWebOrFullAccessChange({ websearch: value })
							}
						/>
					</span>
				</div>
			</div>

			<AddKnowledgeModal
				isOpen={info?.knowledgeModalOpen}
				assistantId={assistant?._id}
				toggleModal={() => {
					setInfo((prev) => ({ ...prev, knowledgeModalOpen: false }));
				}}
			/>
		</div>
	);
};

export default memo(AiKnowledgeBase);
