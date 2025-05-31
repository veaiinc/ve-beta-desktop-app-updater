import { memo, useContext, useEffect, useState, useCallback } from 'react';
import s from './knowledgeBaseTab.module.scss';
import Context from '../../../../../../context/context';
import { ReactComponent as PlusSvg } from '../../../../../../assets/svg/ai_assistant/plus.svg';
import InfiniteScroll from '../../../../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import { message, Switch } from 'antd';
import AddKnowledgeModal from '../../../../modalsV2/knowledgeAgent/AddKnowledgeModal';
import { fileTypeIcons } from '../../../../../../helpers';
const KnowledgeBaseTab = ({ agentId }) => {
	const {
		aiSetup: { updateKnowledgeBaseFile },
		knowledgeAgent: { getKnowledgeBaseInfo, knowledgeBaseInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		knowledgeModalOpen: false,
		knowledgeBaseFiles: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
	});

	useEffect(() => {
		if (agentId) {
			const page = 1,
				limit = 10;
			getKnowledgeBaseInfo(agentId, page, limit);
		}
	}, [agentId]);

	useEffect(() => {
		if (knowledgeBaseInfo) {
			const { data = [], currentPage, hasNextPage } = knowledgeBaseInfo || {};
			setInfo((prev) => ({
				...prev,
				knowledgeBaseFiles:
					currentPage === 1 ? data : [...prev?.knowledgeBaseFiles, ...data],
				hasNextPage: hasNextPage,
				currentPage: currentPage,
				loading: false,
			}));
		}
	}, [knowledgeBaseInfo]);

	const fetchMoreKnowledgeBaseFiles = () => {
		const page = info?.currentPage + 1;
		const limit = 10;
		getKnowledgeBaseInfo(agentId, page, limit);
	};

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
					setInfo((prev) => ({
						...prev,
						knowledgeBaseFiles: updatedKnowledgeFiles,
					}));
				} else {
					message?.error('Failed to update knowledge base file');
				}
			} catch (error) {
				console.log(error);
				message?.error('Failed to update knowledge base file');
			}
		},
		[info?.knowledgeBaseFiles],
	);

	return (
		<div className={s?.knowledgeBaseContainer}>
			<div className={s?.knowledgeBaseHeader}>
				<div className={s?.headerContent}>
					<div className={s?.title}>Knowledge Base</div>
					<div className={s?.description}>
						Make files available to this AI assistant so it can use them as a source of
						knowledge for chats.
					</div>
				</div>
				<button
					onClick={() => {
						setInfo((prev) => ({ ...prev, knowledgeModalOpen: true }));
					}}
					className={s?.addKnowledgeBaseButton}
				>
					<div className={s?.iconContainer}>
						<PlusSvg />
					</div>
					Knowledge
				</button>
			</div>
			<div className={s?.assistantsListContainer}>
				<div className={s?.listHeader}>
					<div className={s?.title}>Title</div>
					<div className={s?.lastEdit}>Last edit</div>
					<div className={s?.active}>Active</div>
				</div>
				<div className={s?.assistantsList}>
					<InfiniteScroll
						dataLength={info?.knowledgeBaseFiles?.length || 0}
						next={fetchMoreKnowledgeBaseFiles}
						hasMore={info?.hasNextPage || false}
						loader={<FetchMoreLoaderComp />}
						height={'100%'}
						style={{
							width: '100%',
						}}
					>
						{info?.knowledgeBaseFiles?.map((file) => {
							const { _id, isActive, name, sourceType, updatedAt } = file;
							const formattedUpdatedAt = `${new Date(updatedAt * 1000)
								?.toLocaleDateString('en-US', {
									month: 'short',
									day: '2-digit',
									year: 'numeric',
								})
								?.replace(',', '')
								?.replace(/^(\w+) (\d+) (\d+)$/, '$1, $2 $3')}`;

							return (
								<div className={s?.assistantItem} key={_id}>
									<div className={s?.assistantItemTitle}>
										<div className={s?.fileIcon}>
											{fileTypeIcons[sourceType] || ''}
										</div>
										<div className={s?.fileName}>{name || ''}</div>
									</div>
									<div className={s?.assistantItemLastEdit}>
										{formattedUpdatedAt || ''}
									</div>
									<div className={s?.assistantItemActive}>
										<Switch
											checked={isActive || false}
											onChange={(checked) => {
												handleToggleChange(_id, checked);
											}}
											size="small"
											style={{
												background: `${
													isActive
														? 'var(--primary-font)'
														: 'var(--secondary-font)'
												}`,
											}}
											className={s?.agentSwitch}
										/>
									</div>
								</div>
							);
						})}
					</InfiniteScroll>
				</div>
			</div>
			<AddKnowledgeModal
				isOpen={info?.knowledgeModalOpen}
				assistantId={agentId}
				toggleModal={() => {
					setInfo((prev) => ({ ...prev, knowledgeModalOpen: false }));
				}}
			/>
		</div>
	);
};

export default memo(KnowledgeBaseTab);
