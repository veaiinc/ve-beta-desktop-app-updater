import { memo, useCallback, useContext, useEffect, useState } from 'react';
import s from './toolsTab.module.scss';
import Context from '../../../../../../../context/context';
import { getFaviconUrl } from '../../../../../../../helpers';

// components
import ActionsModal from '../../../../../modalsV2/ai_assistant/ActionsModal';
import EditAgentTool from '../../../../modals/editAgentTool/EditAgentTool';
import ToggleSwitch from '../../../../../../components/input/slider';
import AddToolModal from '../../../../../modalsV2/ai_assistant/AddToolModal';

// svgs
import { ReactComponent as SearchSvg } from '../assets/search-icon.svg';
import { ReactComponent as DeleteSvg } from '../assets/delete-icon.svg';
import { ReactComponent as EditSvg } from '../assets/edit-icon.svg';
import { ReactComponent as PlusSvg } from '../assets/plus-icon.svg';
import { ReactComponent as GmailIcon } from '../assets/gmail-icon.svg';
import { ReactComponent as Delete } from '../assets/delete.svg';
import moment from 'moment';
import { message } from '../../../../../globalComponents/CustomToast';

const ToolsTab = ({ agentId }) => {
	const {
		aiSetup: { updateAiAction },
		knowledgeAgent: { getActionsForKnowledgeAgent, deleteActionOfKnowledgeAgent, actionsInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		actionModalOpen: false,
		aiActionList: [],
		actionsLoading: true,
		selectedAction: null,
		editAgentToolOpen: false,
		addToolModalOpen: false,
	});

	const getToolFaviconUrl = useCallback((typeDependencies) => {
		try {
			if (typeDependencies?.description) {
				// Extract URL from description using regex
				const urlMatch = typeDependencies.description.match(
					/\[.*?\]\((https?:\/\/[^)]+)\)/,
				);
				if (urlMatch && urlMatch[1]) {
					const url = urlMatch[1];
					return getFaviconUrl(url);
				}
			}
			return null;
		} catch (error) {
			console.error('Error extracting tool favicon:', error);
			return null;
		}
	}, []);

	// Helper function to extract description text before square bracket
	const getCleanDescription = useCallback((description) => {
		if (!description) return '';
		const bracketIndex = description.indexOf('[');
		return bracketIndex > 0 ? description.substring(0, bracketIndex).trim() : description;
	}, []);

	useEffect(() => {
		if (agentId) {
			getActionsForKnowledgeAgent(agentId);
		}
	}, [agentId]);

	useEffect(() => {
		if (actionsInfo) {
			setInfo((prev) => ({
				...prev,
				aiActionList: actionsInfo?.data,
				actionsLoading: false,
			}));
		}
	}, [actionsInfo]);

	const handleActionAdded = useCallback((newAction) => {
		setInfo((prev) => ({
			...prev,
			aiActionList: [...(prev?.aiActionList || []), newAction],
			selectedAction: null,
		}));
	}, []);

	const handleActionUpdated = useCallback((updatedAction) => {
		setInfo((prev) => ({
			...prev,
			aiActionList: prev?.aiActionList?.map((action) =>
				action?._id === updatedAction?._id ? updatedAction : action,
			),
			selectedAction: null,
		}));
	}, []);

	const closeActionModal = useCallback(() => {
		setInfo((prevStates) => ({
			...prevStates,
			actionModalOpen: false,
			selectedAction: null,
		}));
	}, []);

	const handleActionClick = useCallback((action) => {
		setInfo((prevStates) => ({
			...prevStates,
			actionModalOpen: true,
			selectedAction: action,
		}));
	}, []);

	const handleDeleteAction = useCallback(
		async (actionId) => {
			const response = await deleteActionOfKnowledgeAgent(agentId, actionId);
			if (response) {
				message.success('Action deleted successfully');
				setInfo((prev) => ({
					...prev,
					aiActionList: prev?.aiActionList?.filter((action) => action?._id !== actionId),
				}));
			} else {
				message.error('Failed to delete action');
			}
		},
		[info?.assistantId],
	);

	const handleToggleChange = useCallback(
		async (actionId, currentStatus, actionType) => {
			try {
				const updatedActions = info?.aiActionList?.map((action) =>
					action?._id === actionId ? { ...action, status: !currentStatus } : action,
				);

				setInfo((prev) => ({
					...prev,
					aiActionList: updatedActions,
				}));

				const response = await updateAiAction(agentId, actionId, {
					status: !currentStatus,
					type: actionType,
				});

				if (response) {
					message.success('Action status updated successfully');
				} else {
					// Revert the state if API call fails
					setInfo((prev) => ({
						...prev,
						aiActionList: info?.aiActionList,
					}));
					message.error('Failed to update action status');
				}
			} catch (error) {
				// Revert the state if API call fails
				setInfo((prev) => ({
					...prev,
					aiActionList: info?.aiActionList,
				}));
				console.log(error);
				message.error('Failed to update action status', error);
			}
		},
		[info?.aiActionList, info?.assistantId],
	);

	const refreshToolList = useCallback(() => {
		if (agentId) {
			getActionsForKnowledgeAgent(agentId);
		}
	}, [agentId]);

	console.log('info?.aiActionList', info?.aiActionList);
	return (
		<div className={s?.actionsTabContainer}>
			<div className={s?.actionsHeader}>
				<div className={s?.searchInputContainer}>
					<div className={s?.searchIcon}>
						<SearchSvg />
					</div>
					<input type="text" placeholder="Browse tools" className={s?.searchInput} />
				</div>
				<div
					className={s?.addActionButton}
					onClick={() =>
						setInfo((prevStates) => ({
							...prevStates,
							addToolModalOpen: true,
						}))
					}
				>
					<PlusSvg />
					<span>Add tool</span>
				</div>
			</div>
			<span className={s.description}>
				Give your agent abilities like reading emails or syncing notes.
			</span>

			{info?.aiActionList?.length > 0 ? (
				<div className={s?.actionsContainer}>
					{info?.aiActionList?.map((item) => (
						<div
							key={item?._id}
							className={s.instructionItem}
							onClick={() => handleActionClick(item)}
							style={{ cursor: 'pointer' }}
						>
							<span className={s.actionNameContainer}>
								<div className={s.toolIconContainer}>
									{getToolFaviconUrl(item?.typeDependencies) && (
										<img
											src={getToolFaviconUrl(item?.typeDependencies)}
											alt="Tool icon"
											className={s.toolFavicon}
										/>
									)}
								</div>
								<div className={s.actionNameContainer}>
									<p className={s.actionName}>{item?.typeDependencies?.name}</p>
									<span className={s.actionDescription}>
										{getCleanDescription(item?.typeDependencies?.description)}
									</span>
								</div>
								<Delete
									className={s.deleteKnowledge}
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteAction(item?._id);
									}}
								/>
							</span>
							<span className={s.actionDate}>
								{moment.unix(item?.createdAt).format('MMM DD, YYYY')}
							</span>
							<span
								className={s.aiToggleSwitch}
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<ToggleSwitch
									id={item?._id}
									value={item?.status}
									onChange={() =>
										handleToggleChange(item?._id, item?.status, item?.type)
									}
								/>
							</span>
						</div>
					))}
				</div>
			) : (
				<div className={s?.emptyState}>
					<p className={s?.emptyStateTitle}>No tools found</p>
					<p className={s?.emptyStateDescription}>Add a tool to get started.</p>
				</div>
			)}

			<ActionsModal
				isOpen={info?.actionModalOpen}
				onClose={closeActionModal}
				assistantId={agentId}
				aiActionList={info?.aiActionList}
				onActionAdded={handleActionAdded}
				onActionUpdated={handleActionUpdated}
				selectedAction={info?.selectedAction}
			/>
			<EditAgentTool
				isOpen={info?.editAgentToolOpen}
				onClose={() => setInfo((prev) => ({ ...prev, editAgentToolOpen: false }))}
			/>
			<AddToolModal
				isOpen={info?.addToolModalOpen}
				onClose={() => setInfo((prev) => ({ ...prev, addToolModalOpen: false }))}
				onToolAdded={refreshToolList}
			/>
		</div>
	);
};

export default memo(ToolsTab);
