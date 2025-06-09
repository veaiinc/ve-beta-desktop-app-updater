import { memo, useContext, useEffect, useState, useCallback } from 'react';
import s from './knowledgeBaseTab.module.scss';
import Context from '../../../../../../../context/context';
import { ReactComponent as PlusSvg } from '../assets/plus-icon.svg';
import { Switch } from 'antd';
import { message } from '../../../../../globalComponents/CustomToast';
import AddKnowledgeModal from '../../../../../../components/modalsV2/knowledgeAgent/AddKnowledgeModal';
import InfiniteScroll from '../../../../../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp, fileTypeIcons } from '../../../../../../../helpers';
import ToggleSwitch from '../../../../../../components/input/slider';

const page = 1;
const limit = 10;

const KnowledgeBaseTab = ({ agentId }) => {
	const {
		aiSetup: { updateKnowledgeBaseFile },
		knowledgeAgent: { getKnowledgeBaseInfo, knowledgeBaseInfo, activeKnowledgeAssistant },
	} = useContext(Context);

	const [info, setInfo] = useState({
		knowledgeModalOpen: false,
		knowledgeBaseFiles: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
	});

	const fullWorkspaceAccess = activeKnowledgeAssistant?.data?.fullWorkspaceAccess;

	useEffect(() => {
		if ((knowledgeBaseInfo?.data ?? [])?.length === 0) {
			getKnowledgeBaseInfo(agentId, page, limit);
		}
	}, []);

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
		const append = true;
		getKnowledgeBaseInfo(agentId, page, limit, append);
	};

	const handleSearchWebOrFullAccessChange = async (data) => {
		const response = await updateKnowledgeAgent(assistant?._id, data);
		if (!response?.[0]) return;
	};

	const handleToggleChange = useCallback(
		async (knowledgeId, value) => {
			try {
				const knowledgeBaseFilesCopy = [...info?.knowledgeBaseFiles]; // In case of error, revert to the original state
				const updatedKnowledgeFiles = info?.knowledgeBaseFiles?.map((item) =>
					item?._id === knowledgeId ? { ...item, isActive: !item?.isActive } : item,
				);
				setInfo((prev) => ({
					...prev,
					knowledgeBaseFiles: updatedKnowledgeFiles,
				}));
				const response = await updateKnowledgeBaseFile(knowledgeId, {
					isActive: value,
					agent: 'knowledgeAgent',
				});

				if (!response?.[0]) {
					message?.error('Failed to update knowledge base file');
					setInfo((prev) => ({
						...prev,
						knowledgeBaseFiles: knowledgeBaseFilesCopy,
					}));
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
			<div>
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
							value={fullWorkspaceAccess}
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
				assistantId={agentId}
				toggleModal={() => {
					setInfo((prev) => ({ ...prev, knowledgeModalOpen: false }));
				}}
			/>
		</div>
	);
};

export default memo(KnowledgeBaseTab);
