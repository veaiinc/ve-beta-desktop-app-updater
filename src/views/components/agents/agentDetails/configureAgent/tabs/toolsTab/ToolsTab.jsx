import { memo, useCallback, useContext, useEffect, useState } from 'react';
import s from './toolsTab.module.scss';
import Context from '../../../../../../../context/context';
import { getFaviconUrl } from '../../../../../../../helpers';

// components
import ActionsModal from '../../../../../modalsV2/ai_assistant/ActionsModal';

// svgs
import { ReactComponent as SearchSvg } from '../assets/search-icon.svg';
import { ReactComponent as DeleteSvg } from '../assets/delete-icon.svg';
import { ReactComponent as EditSvg } from '../assets/edit-icon.svg';
import { ReactComponent as PlusSvg } from '../assets/plus-icon.svg';
import { ReactComponent as GmailIcon } from '../assets/gmail-icon.svg';

const ToolsTab = ({ agentId }) => {
	const {
		knowledgeAgent: { getActionsForKnowledgeAgent, actionsInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		actionModalOpen: false,
		aiActionList: [],
		actionsLoading: true,
		selectedAction: null,
	});

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
							actionModalOpen: true,
						}))
					}
				>
					<PlusSvg />
					<span>Add tool</span>
				</div>
			</div>

			<div className={s?.actionsContainer}>
				<div className={s.gmailTool}>
					<div className={s.gmailIcon}>
						<GmailIcon />
					</div>
					<div className="titleSubtile">
						<h1 className="title"></h1>
					</div>
				</div>
				{/* {info?.aiActionList?.map((action) => {
					const {
						status,
						_id,
						typeDependencies: { name, description, url },
					} = action;
					const iconUrl = getFaviconUrl(url) || null;

					return (
						<div className={s?.actionItem} key={_id}>
							<div className={s?.leftContainer}>
								<div className={s?.actionIcon}>
									{iconUrl ? (
										<img width={16} height={16} src={iconUrl} alt="icon" />
									) : null}
								</div>
								<div className={s?.titleContainer}>
									<p className={s?.title}>{name || ''}</p>
									<p className={s?.description}>{description || ''}</p>
								</div>
							</div>
							<div className={s?.rightContainer}>
								<div className={s?.connectAction}>
									<div className={s?.connectActionIcon}>
										<PlusSvg />
									</div>
									<p className={s?.connectActionText}>Add</p>
								</div>
								<div
									className={s?.editSvgContainer}
									onClick={() => handleActionClick(action)}
								>
									<EditSvg />
								</div>
								<div className={s?.deleteSvgContainer}>
									<DeleteSvg />
								</div>

								<div className={s?.statusContainer}>
									<div className={s?.indicator}></div>
									<p className={s?.status}>Connected</p>
								</div>
							</div>
						</div>
					);
				})} */}
			</div>
			<ActionsModal
				isOpen={info?.actionModalOpen}
				onClose={closeActionModal}
				assistantId={agentId}
				aiActionList={info?.aiActionList}
				onActionAdded={handleActionAdded}
				onActionUpdated={handleActionUpdated}
				selectedAction={info?.selectedAction}
			/>
		</div>
	);
};

export default memo(ToolsTab);
