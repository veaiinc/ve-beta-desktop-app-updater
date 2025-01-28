import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/knowledgeBase.scss';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';
import { ReactComponent as Pdf } from '../../../assets/svg/ai_assistant/pdf.svg';
import { ReactComponent as Text } from '../../../assets/svg/ai_assistant/tIcon.svg';
import AddKnowledgeModal from '../../components/modalsV2/settings/ai_setup/AddKnowledgeModal';
import Context from '../../../context/context';
import ToggleSwitch from '../../components/input/slider';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import Skeleton from 'react-loading-skeleton';
import { message } from 'antd';

const iconMapper = {
	pdf: <Pdf style={{ stroke: '#F2F2F3' }} width={12} height={12} />,
	txt: <Text style={{ stroke: '#F2F2F3' }} width={12} height={12} />,
	url: <Link style={{ fill: '#F2F2F3 !important' }} width={12} height={12} />,
};

const AiKnowledgeBase = ({ agent }) => {
	let {
		aiSetup: {
			activeAiAssistantDetails,
			knowledgeBaseFiles,
			getKnowledgeBaseFiles,
			getActiveAiAssistantDetails,
			updateKnowledgeBaseFile,
			assignedWorkflowsToAiAssistant,
			getAssignedWorkflowsToAiAssistant,
			unassignWorkflowToAiAssistant,
			getWorkflows,
			deleteKnowledge,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		toggleStates: {},
		knowledgeModalOpen: false,
		knowledgeBaseFiles: [],
		agentId: agent?._id,
		loading: true,
	});

	useEffect(() => {
		if (info?.agentId) {
			fetchKnowledgeBaseFiles({ page: 1, reset: true });
			getActiveAiAssistantDetails(info?.agentId);
		}
	}, [info?.agentId]);

	useEffect(() => {
		if (knowledgeBaseFiles) {
			setInfo((prev) => ({
				...prev,
				knowledgeBaseFiles: knowledgeBaseFiles?.data,
				loading: false,
			}));
		}
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
			getKnowledgeBaseFiles(info?.agentId, page, 20, reset);
		},
		[info?.agentId],
	);

	const fetchMoreData = () => {
		const nextPageNumber = knowledgeBaseFiles?.currentPage + 1;
		fetchKnowledgeBaseFiles({ page: nextPageNumber });
	};

	return (
		<>
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
						<span>Title</span>
						<span>Last edit</span>
						<span>Active</span>
					</div>
					{info?.loading ? (
						[{}, {}, {}, {}, {}, {}, {}]?.map((item, index) => (
							<div key={index} className="knowledgeBaseItemSkeleton">
								<Skeleton width="100%" height="36px" borderRadius="6px" />
							</div>
						))
					) : (
						<InfiniteScroll
							dataLength={info?.knowledgeBaseFiles?.length || 0}
							next={fetchMoreData}
							hasMore={knowledgeBaseFiles?.hasMore}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								width: '100%',
								overflow: 'auto',
							}}
							height="calc(100vh - 300px)"
						>
							{info?.knowledgeBaseFiles?.map((item) => (
								<div key={item?._id} className="knowledgeBaseItem">
									<span>
										{iconMapper?.[item?.sourceType]}
										{item?.name}
									</span>
									<span style={{ color: '#7C7C84' }}>
										{moment.unix(item?.updatedAt).format('MMM DD, YYYY')}
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
					)}
				</div>
			</div>
			<AddKnowledgeModal
				isOpen={info?.knowledgeModalOpen}
				agentId={info?.agentId}
				toggleModal={() => {
					setInfo((prev) => ({ ...prev, knowledgeModalOpen: false }));
				}}
			/>
		</>
	);
};

export default memo(AiKnowledgeBase);
