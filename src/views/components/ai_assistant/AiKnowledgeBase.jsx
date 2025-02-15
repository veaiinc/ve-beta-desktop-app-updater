import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/knowledgeBase.scss';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';
import { ReactComponent as Pdf } from '../../../assets/svg/ai_assistant/pdf.svg';
import { ReactComponent as Text } from '../../../assets/svg/ai_assistant/tIcon.svg';
import { ReactComponent as Delete } from '../../../assets/svg/ai_assistant/delete.svg';
import AddKnowledgeModal from '../../components/modalsV2/settings/ai_setup/AddKnowledgeModal';
import Context from '../../../context/context';
import ToggleSwitch from '../../components/input/slider';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import Skeleton from 'react-loading-skeleton';
import { message } from 'antd';
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

const AiKnowledgeBase = ({ assistant }) => {
	let {
		aiSetup: {
			knowledgeBaseFiles,
			getKnowledgeBaseFiles,
			getActiveAiAssistantDetails,
			updateKnowledgeBaseFile,
			deleteKnowledge,
		},
	} = useContext(Context);

	const { aiAssistantId } = useParams();
	const [info, setInfo] = useState({
		toggleStates: {},
		knowledgeModalOpen: false,
		knowledgeBaseFiles: [],
		assistantId: aiAssistantId,
		loading: true,
		knowledgeBaseFilesLoading: true,
		currentPage: 1,
		hasNextPage: true,
	});

	useEffect(() => {
		if (info?.assistantId) {
			fetchKnowledgeBaseFiles({ page: 1, reset: true });
			getActiveAiAssistantDetails(info?.assistantId);
		}
	}, [info?.assistantId]);

	useEffect(() => {
		if (knowledgeBaseFiles) {
			setInfo((prev) => ({
				...prev,
				knowledgeBaseFiles: [...knowledgeBaseFiles?.data] || [],
				hasNextPage: knowledgeBaseFiles?.hasMore,
				currentPage: knowledgeBaseFiles?.currentPage,
				loading: false,
			}));
		}
		setInfo((prev) => ({
			...prev,
			knowledgeBaseFilesLoading: true,
		}));
		const timer = setTimeout(() => {
			setInfo((prev) => ({
				...prev,
				knowledgeBaseFilesLoading: false,
			}));
		}, 300);

		return () => clearTimeout(timer);
	}, [knowledgeBaseFiles]);

	const handleToggleChange = useCallback(
		async (knowledgeId, value) => {
			try {
				const response = await updateKnowledgeBaseFile(knowledgeId, {
					isActive: value,
				});

				if (response?.[0]) {
					message?.success('Knowledge base file updated successfully');
					const updatedKnowledgeBaseFiles = info?.knowledgeBaseFiles?.map((item) =>
						item?._id === knowledgeId ? { ...item, isActive: !item?.isActive } : item,
					);
					setInfo((prev) => ({
						...prev,
						knowledgeBaseFiles: updatedKnowledgeBaseFiles,
					}));
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
		({ page = 1, reset = false }) => {
			setInfo((prev) => ({
				...prev,
				currentPage: page,
			}));
			getKnowledgeBaseFiles(info?.assistantId, page, 20, reset);
		},
		[info?.assistantId],
	);

	const fetchMoreData = () => {
		if (info?.hasNextPage) {
			const nextPageNumber = info?.currentPage + 1;
			fetchKnowledgeBaseFiles({ page: nextPageNumber });
		}
	};

	const deleteKnowledgeFile = (knowledgeId) => {
		deleteKnowledge(knowledgeId);
		setInfo((prev) => ({
			...prev,
			knowledgeBaseFiles: prev?.knowledgeBaseFiles?.filter(
				(item) => item?._id !== knowledgeId,
			),
		}));
	};

	return (
		<div style={{ width: '100%' }}>
			<div className="aiKnowledgeBaseParentContainer">
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
						<span style={{ minWidth: '438px' }}>Title</span>
						<span>Status</span>
						<span>Active</span>
					</div>

					<div
						className="knowledgeBaseListContainerScrollable"
						id="knowledgeBaseListScrollable"
					>
						{info?.loading ? (
							[{}, {}, {}, {}, {}, {}, {}]?.map((item, index) => (
								<div key={index} className="knowledgeBaseItemSkeleton">
									<Skeleton width="100%" height="36px" borderRadius="6px" />
								</div>
							))
						) : info?.knowledgeBaseFiles?.length > 0 ? (
							<InfiniteScroll
								dataLength={info?.knowledgeBaseFiles?.length || 0}
								hasMore={info?.hasNextPage}
								next={fetchMoreData}
								loader={<FetchMoreLoaderComp />}
								style={{
									display: 'flex',
									flexDirection: 'column',
									width: '100%',
								}}
								height="calc(100vh - 330px)"
								scrollableTarget="knowledgeBaseListScrollable"
							>
								{info?.knowledgeBaseFiles?.map((item) => (
									<div key={item?._id} className="knowledgeBaseItem">
										<span>
											{iconMapper?.[item?.sourceType]}
											<p>{item?.name}</p>
											<Delete
												className="deleteKnowledge"
												onClick={() => deleteKnowledgeFile(item?._id)}
											/>
										</span>
										{/* <span style={{ color: '#7C7C84' }}>
										{moment.unix(item?.updatedAt).format('MMM DD, YYYY')}
									</span> */}
										<span className={`${item?.status}`}>
											{item?._id === info?.knowledgeBaseFiles?.[0]?._id &&
											info?.knowledgeBaseFilesLoading ? (
												<Spinner width="12px" height="12px" />
											) : (
												fileStatus?.[item?.status]
											)}
										</span>
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
			</div>
			<AddKnowledgeModal
				isOpen={info?.knowledgeModalOpen}
				assistantId={info?.assistantId}
				toggleModal={() => {
					setInfo((prev) => ({ ...prev, knowledgeModalOpen: false }));
				}}
			/>
		</div>
	);
};

export default memo(AiKnowledgeBase);
