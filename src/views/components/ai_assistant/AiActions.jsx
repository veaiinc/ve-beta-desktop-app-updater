import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiInstructions.scss';
import ToggleSwitch from '../input/slider';
import ActionsModal from '../modalsV2/ai_assistant/ActionsModal';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import Context from '../../../context/context';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';

const AiActions = ({ assistant }) => {
	const { aiAssistantId } = useParams();

	const {
		aiSetup: { getActions, updateAiAction, deleteAiAction, aiActions },
	} = useContext(Context);

	const [info, setInfo] = useState({
		actionModalOpen: false,
		assistantId: assistant?._id || aiAssistantId,
		aiActionList: [],
		actionsLoading: true,
		selectedAction: null,
	});

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
			aiActionList: prev.aiActionList.map((action) =>
				action._id === updatedAction._id ? updatedAction : action,
			),
			selectedAction: null,
		}));
	}, []);

	useEffect(() => {
		if (info?.assistantId) {
			getActions(info?.assistantId);
		}
	}, [info?.assistantId]);

	useEffect(() => {
		if (aiActions) {
			setInfo((prev) => ({
				...prev,
				aiActionList: aiActions,
				actionsLoading: false,
			}));
		}
	}, [aiActions]);

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

	const handleToggleChange = useCallback(
		async (actionId, currentStatus) => {
			try {
				const updatedActions = info?.aiActionList?.map((action) =>
					action?._id === actionId ? { ...action, status: !currentStatus } : action,
				);

				setInfo((prev) => ({
					...prev,
					aiActionList: updatedActions,
				}));

				const response = await updateAiAction(info?.assistantId, actionId, {
					status: !currentStatus,
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
				message.error('Failed to update action status');
			}
		},
		[info?.aiActionList, info?.assistantId],
	);

	return (
		<div style={{ width: '100%' }}>
			<div className="aiInstructionsParentContainer">
				<div className="instructionsHeaderContainer">
					<div className="instructionsHeader">
						<span className="lineone">Action</span>
						<span className="linetwo">
							Automates tasks like triggering APIs or connecting with external
							systems.
						</span>
					</div>

					<div
						className="addInstruction"
						onClick={() =>
							setInfo((prevStates) => ({
								...prevStates,
								actionModalOpen: true,
							}))
						}
					>
						Add action
					</div>
				</div>

				<div className="instructionsListContainer">
					<div className="header">
						<span>Title</span>
						<span>Last edit</span>
						<span>Active</span>
					</div>
					{info?.actionsLoading ? (
						[{}, {}, {}, {}, {}, {}, {}]?.map((_, index) => (
							<div key={index} className="instructionItemSkeleton">
								<Skeleton width="100%" height="36px" borderRadius="6px" />
							</div>
						))
					) : info?.aiActionList?.length > 0 ? (
						info?.aiActionList?.map((item) => (
							<div
								key={item?._id}
								className="instructionItem"
								onClick={() => handleActionClick(item)}
								style={{ cursor: 'pointer' }}
							>
								<span>{item?.name}</span>
								<span style={{ color: '#7C7C84' }}>
									{moment.unix(item?.createdAt).format('MMM DD, YYYY')}
								</span>
								<span className="aiToggleSwitch">
									<ToggleSwitch
										id={item?._id}
										value={item?.status}
										onChange={() => handleToggleChange(item?._id, item?.status)}
									/>
								</span>
							</div>
						))
					) : (
						<div className="emptyState">
							<p>No actions added</p>
							<p>Add actions to automate tasks</p>
						</div>
					)}
				</div>
			</div>

			<ActionsModal
				isOpen={info?.actionModalOpen}
				onClose={closeActionModal}
				assistantId={info?.assistantId}
				aiActionList={info?.aiActionList}
				onActionAdded={handleActionAdded}
				onActionUpdated={handleActionUpdated}
				selectedAction={info?.selectedAction}
			/>
		</div>
	);
};

export default memo(AiActions);
