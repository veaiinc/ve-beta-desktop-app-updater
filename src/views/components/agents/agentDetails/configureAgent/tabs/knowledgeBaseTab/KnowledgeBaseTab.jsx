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
import { ReactComponent as Delete } from '../assets/delete.svg';
const page = 1;
const limit = 10;

const KnowledgeBaseTab = ({ agentId, myAccess }) => {
	const {
		aiSetup: { updateKnowledgeBaseFile },
		knowledgeAgent: {
			getKnowledgeBaseInfo,
			knowledgeBaseInfo,
			activeKnowledgeAssistant,
			updateKnowledgeAgent,
			knowledgeBaseFilesActiveStatus,
			getKnowledgeBaseFilesActiveStatus,
			updateContextValues,
			deleteKnowledgeBaseFile,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		knowledgeModalOpen: false,
		isActive: null,
		loading: false,
	});

	const fullWorkspaceAccess = activeKnowledgeAssistant?.data?.fullWorkspaceAccess;
	const knowledgeBaseFiles = knowledgeBaseInfo?.data ?? [];
	const dataLength = knowledgeBaseFiles.length;
	const activeStatus = knowledgeBaseFilesActiveStatus?.data.reduce((acc, item) => {
		acc[item._id] = item.isActive;
		return acc;
	}, {});
	const currentPage = knowledgeBaseInfo?.currentPage ?? 1;
	const hasNextPage = knowledgeBaseInfo?.hasNextPage ?? false;

	useEffect(() => {
		if (knowledgeBaseInfo === null) {
			getKnowledgeBaseInfo(agentId, page, limit);
			getKnowledgeBaseFilesActiveStatus({ agentId, page, limit });
		}
		return () => {
			updateContextValues({
				knowledgeBaseInfo: null,
				knowledgeBaseFilesActiveStatus: null,
			});
		};
	}, [agentId]);

	const fetchMoreKnowledgeBaseFiles = () => {
		const page = currentPage + 1;
		const append = true;
		getKnowledgeBaseInfo(agentId, page, limit, append);
		getKnowledgeBaseFilesActiveStatus({ agentId, page, limit, append });
	};

	const handleSearchWebOrFullAccessChange = async (data) => {
		const response = await updateKnowledgeAgent(agentId, data);
		if (!response?.[0]) message.error('An unexpected error occured!');
	};

	const handleToggleChange = useCallback(
		async (knowledgeId, value) => {
			try {
				const updatedActiveStatus = {
					...activeStatus,
					[knowledgeId]: value,
				};

				const updatedActiveStatusData =
					knowledgeBaseFilesActiveStatus?.data?.map((item) => {
						if (item._id === knowledgeId) {
							return { ...item, isActive: value };
						}
						return item;
					}) || [];

				updateContextValues({
					knowledgeBaseFilesActiveStatus: {
						...knowledgeBaseFilesActiveStatus,
						data: updatedActiveStatusData,
					},
				});

				const response = await updateKnowledgeBaseFile(knowledgeId, {
					isActive: value,
					agent: 'knowledgeAgent',
				});

				if (!response?.[0]) {
					const revertedActiveStatusData =
						knowledgeBaseFilesActiveStatus?.data?.map((item) => {
							if (item._id === knowledgeId) {
								return { ...item, isActive: activeStatus[knowledgeId] };
							}
							return item;
						}) || [];

					updateContextValues({
						knowledgeBaseFilesActiveStatus: {
							...knowledgeBaseFilesActiveStatus,
							data: revertedActiveStatusData,
						},
					});
					message?.error('Failed to update knowledge base file try again');
				}
			} catch (error) {
				const revertedActiveStatusData =
					knowledgeBaseFilesActiveStatus?.data?.map((item) => {
						if (item._id === knowledgeId) {
							return { ...item, isActive: activeStatus[knowledgeId] };
						}
						return item;
					}) || [];

				updateContextValues({
					knowledgeBaseFilesActiveStatus: {
						...knowledgeBaseFilesActiveStatus,
						data: revertedActiveStatusData,
					},
				});
				message?.error('Failed to update knowledge base file');
			}
		},
		[activeStatus, knowledgeBaseFilesActiveStatus, updateContextValues],
	);

	const handleDeleteKnowledgeBaseFile = async (knowledgeId) => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));

		try {
			const [success, data] = await deleteKnowledgeBaseFile(knowledgeId);
			if (success) {
				message?.success('Knowledge base file deleted successfully!');
			} else {
				message?.error('Failed to delete knowledge base file');
			}
		} catch (error) {
			message?.error('Failed to delete knowledge base file');
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	};

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
					disabled={myAccess === 'view'}
				>
					<div className={s?.iconContainer}>
						<PlusSvg />
					</div>
					Knowledge
				</button>
			</div>
			{dataLength > 0 ? (
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
							height={'324px'}
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

								const isActive = activeStatus?.[_id];

								return (
									<tr className={s?.assistantItem} key={_id} role="row">
										<td className={s?.assistantItemTitle} role="cell">
											<div className={s?.fileIcon}>
												{fileTypeIcons[sourceType] || ''}
											</div>
											<div className={s?.fileName}>{name || ''}</div>
											<Delete
												className={s.deleteKnowledge}
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteKnowledgeBaseFile(_id);
												}}
											/>
										</td>
										<td className={s?.assistantItemLastEdit} role="cell">
											{formattedUpdatedAt || ''}
										</td>
										<td className={s?.assistantItemActive} role="cell">
											<Switch
												checked={isActive || false}
												disabled={myAccess === 'view'}
												onChange={(checked) =>
													handleToggleChange(_id, checked)
												}
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
			) : (
				<div className={s.emptyState}>
					<p className={s.emptyStateTitle}>No knowledge base files found</p>
					<p className={s.emptyStateDescription}>
						Add a knowledge base file to get started.
					</p>
				</div>
			)}
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
							editable={myAccess !== 'view'}
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
							editable={myAccess !== 'view'}
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
