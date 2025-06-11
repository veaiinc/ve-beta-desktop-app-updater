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
		knowledgeAgent: {
			getKnowledgeBaseInfo,
			knowledgeBaseInfo,
			activeKnowledgeAssistant,
			updateKnowledgeAgent,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		knowledgeModalOpen: false,
		isActive: null,
	});

	const fullWorkspaceAccess = activeKnowledgeAssistant?.data?.fullWorkspaceAccess;
	const knowledgeBaseFiles = knowledgeBaseInfo?.data ?? [];
	const dataLength = knowledgeBaseFiles.length;
	const knowledgeBaseFilesActiveStatus =
		activeKnowledgeAssistant?.data?.knowledgeBase_ids?.reduce((acc, item) => {
			acc[item._id] = item.isActive;
			return acc;
		}, {});
	const currentPage = knowledgeBaseInfo?.currentPage ?? 1;
	const hasNextPage = knowledgeBaseInfo?.hasNextPage ?? false;

	useEffect(() => {
		if ((knowledgeBaseInfo?.data ?? [])?.length === 0) {
			getKnowledgeBaseInfo(agentId, page, limit);
		}
	}, []);

	const fetchMoreKnowledgeBaseFiles = () => {
		const page = currentPage + 1;
		const append = true;
		getKnowledgeBaseInfo(agentId, page, limit, append);
	};

	const handleSearchWebOrFullAccessChange = async (data) => {
		const response = await updateKnowledgeAgent(agentId, data);
		if (!response?.[0]) message.error('An unexpected error occured!');
	};

	const handleToggleChange = useCallback(
		async (knowledgeId, value) => {
			try {
				setInfo((prevInfo) => ({
					...prevInfo,
					isActive: {
						...(prevInfo.isActive || {}),
						[knowledgeId]: value,
					},
				}));
				const response = await updateKnowledgeBaseFile(knowledgeId, {
					isActive: value,
					agent: 'knowledgeAgent',
				});

				if (!response?.[0]) {
					message?.error('Failed to update knowledge base file');
				}
			} catch (error) {
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
			<table className={s?.assistantsListContainer} role="table">
				<thead role="rowgroup">
					<tr className={s.listHeader} role="row">
						<th className={s?.title}>Knowledge File</th>
						<th className={s?.lastEdit}>Last Updated</th>
						<th className={s?.active}>Active</th>
					</tr>
				</thead>
				<tbody className={s?.assistantsList} role="rowgroup">
					<InfiniteScroll
						dataLength={dataLength}
						next={fetchMoreKnowledgeBaseFiles}
						hasMore={hasNextPage}
						loader={<FetchMoreLoaderComp />}
						height={'100%'}
						style={{ width: '100%' }}
					>
						{knowledgeBaseFiles?.map((file) => {
							const { _id, name, sourceType, updatedAt } = file;

							const formattedUpdatedAt = `${new Date(updatedAt * 1000)
								.toLocaleDateString('en-US', {
									month: 'short',
									day: '2-digit',
									year: 'numeric',
								})
								.replace(',', '')
								.replace(/^(\w+) (\d+) (\d+)$/, '$1, $2 $3')}`;

							const isActive =
								info.isActive?.[_id] ?? knowledgeBaseFilesActiveStatus?.[_id];

							return (
								<tr className={s?.assistantItem} key={_id} role="row">
									<td className={s?.assistantItemTitle} role="cell">
										<div className={s?.fileIcon}>
											{fileTypeIcons[sourceType] || ''}
										</div>
										<div className={s?.fileName}>{name || ''}</div>
									</td>
									<td className={s?.assistantItemLastEdit} role="cell">
										{formattedUpdatedAt || ''}
									</td>
									<td className={s?.assistantItemActive} role="cell">
										<Switch
											checked={isActive || false}
											onChange={(checked) => handleToggleChange(_id, checked)}
											size="small"
											style={{
												background: isActive
													? 'var(--primary-font)'
													: 'var(--secondary-font)',
											}}
											className={s?.agentSwitch}
										/>
									</td>
								</tr>
							);
						})}
					</InfiniteScroll>
				</tbody>
			</table>
			<div className={s.knowledgeSettingsContainer}>
				<div className={s.knowledgeToggleContainer}>
					<div className={s.knowledgeToggleTextWrapper}>
						<h2>Add all workspace content</h2>
						<p>
							Let the agent use all shared integrations, files, and other assets in
							this workspace.
						</p>
					</div>
					<span className={s.toggleSwitchContainer}>
						<ToggleSwitch
							value={fullWorkspaceAccess}
							onChange={(value) =>
								handleSearchWebOrFullAccessChange({ fullWorkspaceAccess: value })
							}
						/>
					</span>
				</div>

				<div className={s.knowledgeToggleContainer}>
					<div className={s.knowledgeToggleTextWrapper}>
						<h2>Search the web for information</h2>
						<p>
							Let the agent search and reference information found on websites in
							answers.
						</p>
					</div>
					<span className={s.toggleSwitchContainer}>
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
