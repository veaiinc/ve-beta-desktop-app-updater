import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiInstructions.scss';
import InstructionModal from '../modalsV2/ai_assistant/InstructionModal';
import { ReactComponent as Edit } from '../../../assets/svg/ai_agents/edit.svg';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';
import ToggleSwitch from '../input/slider';
import { message } from '../globalComponents/CustomToast';

const AiInstructions = ({ assistant }) => {
	const {
		aiSetup: {
			aiInstructions,
			getInstructions,
			createInstruction,
			updateInstruction,
			deleteInstruction,
		},
	} = useContext(Context);

	const { aiAssistantId } = useParams();

	const [info, setInfo] = useState({
		isInstructionModalOpen: false,
		instructionData: [],
		instructionBody: {
			title: '',
			instruction: '',
		},
		updatingInstruction: false,
		instructionDataLoading: true,
		instructionEditing: false,
		currentInstructionId: null,
		deletingInstruction: false,
	});

	useEffect(() => {
		getInstructions(aiAssistantId);
	}, [aiAssistantId]);

	useEffect(() => {
		if (aiInstructions) {
			setInfo((prev) => ({
				...prev,
				instructionData: aiInstructions || [],
				instructionDataLoading: false,
				instructionBody: {
					title: '',
					instruction: '',
				},
				updatingInstruction: false,
				isInstructionModalOpen: false,
			}));
		}
	}, [aiInstructions]);

	const handleToggleChange = useCallback(
		async (instructionId, currentStatus) => {
			try {
				const updatedInstructions = (info?.instructionData || [])?.map((instruction) =>
					instruction?._id === instructionId
						? { ...instruction, status: !currentStatus }
						: instruction,
				);

				setInfo((prev) => ({
					...prev,
					instructionData: updatedInstructions,
				}));

				const response = await updateInstruction(aiAssistantId, instructionId, {
					status: !currentStatus,
				});

				if (response) {
					message.success('Instruction status updated successfully');
				} else {
					// Revert the state if API call fails
					setInfo((prev) => ({
						...prev,
						instructionData: info?.instructionData,
					}));
					message.error('Failed to update instruction status');
				}
			} catch (error) {
				// Revert the state if API call fails
				setInfo((prev) => ({
					...prev,
					instructionData: info?.instructionData,
				}));
				message.error('Failed to update instruction status');
			}
		},
		[info?.instructionData, aiAssistantId],
	);

	const toggleInstructionModal = () => {
		setInfo((prev) => ({
			...prev,
			isInstructionModalOpen: !prev.isInstructionModalOpen,
			instructionBody: {
				title: '',
				instruction: '',
			},
			instructionEditing: false,
			deletingInstruction: false,
			currentInstructionId: null,
		}));
	};

	const handleInstructionAction = useCallback(async () => {
		setInfo((prev) => ({ ...prev, updatingInstruction: true }));
		try {
			if (info?.instructionEditing) {
				// Update existing instruction
				const response = await updateInstruction(
					aiAssistantId,
					info?.currentInstructionId,
					info?.instructionBody,
				);
				if (response) {
					message.success('Instruction updated successfully');

					// Update the local instructionData array with the updated instruction
					const updatedInstructions = info?.instructionData?.map((instruction) =>
						instruction?._id === info?.currentInstructionId
							? {
									...instruction,
									title: info?.instructionBody?.title,
									instruction: info?.instructionBody?.instruction,
							  }
							: instruction,
					);

					setInfo((prev) => ({
						...prev,
						updatingInstruction: false,
						isInstructionModalOpen: false,
						instructionEditing: false,
						deletingInstruction: false,
						currentInstructionId: null,
						instructionBody: {
							title: '',
							instruction: '',
						},
						instructionData: updatedInstructions,
					}));
				} else {
					message.error('Failed to update instruction');
					setInfo((prev) => ({ ...prev, updatingInstruction: false }));
				}
			} else {
				// Create new instruction
				if (info?.instructionData?.length < 20) {
					const response = await createInstruction(aiAssistantId, info?.instructionBody);
					if (response) {
						message.success('Instruction created successfully');
						setInfo((prev) => ({
							...prev,
							updatingInstruction: false,
							isInstructionModalOpen: false,
							instructionBody: {
								title: '',
								instruction: '',
							},
						}));
					} else {
						message.error('Failed to create instruction');
						setInfo((prev) => ({ ...prev, updatingInstruction: false }));
					}
				} else {
					setInfo((prev) => ({
						...prev,
						updatingInstruction: false,
						isInstructionModalOpen: false,
					}));
					message.error('You have reached the maximum limit of 20 instructions');
				}
			}
		} catch (error) {
			console.error('Error in handleInstructionAction:', error);
			message.error('An error occurred while processing your request');
			setInfo((prev) => ({ ...prev, updatingInstruction: false }));
		}
	}, [
		info?.instructionBody,
		info?.instructionEditing,
		info?.currentInstructionId,
		aiAssistantId,
		info?.instructionData,
		info?.instructionData?.length,
	]);

	const updateInstructionBody = useCallback((field, value) => {
		setInfo((prev) => ({
			...prev,
			instructionBody: {
				...prev.instructionBody,
				[field]: value,
			},
		}));
	}, []);

	const handleEditInstruction = useCallback(
		(instructionId) => {
			setInfo((prev) => ({
				...prev,
				isInstructionModalOpen: true,
				instructionEditing: true,
				deletingInstruction: true,
				currentInstructionId: instructionId,
				instructionBody: {
					title: prev.instructionData?.find((item) => item?._id === instructionId)?.title,
					instruction: prev.instructionData?.find((item) => item?._id === instructionId)
						?.instruction,
				},
			}));
		},
		[info?.instructionData],
	);

	const handleDeleteInstruction = useCallback(() => {
		const response = deleteInstruction(aiAssistantId, info?.currentInstructionId);
		if (response) {
			message.success('Instruction deleted successfully');
		} else {
			message.error('Failed to delete instruction');
		}
		setInfo((prev) => ({ ...prev, deletingInstruction: false }));
	}, [aiAssistantId, info?.currentInstructionId]);

	return (
		<div style={{ width: '100%' }}>
			<div className="aiInstructionsParentContainer">
				<div className="instructionsHeaderContainer">
					<div className="instructionsHeader">
						<span className="lineone">Instructions</span>
						<span className="linetwo">
							Provide instructions to your AI assistant. This will help it understand
							your requirements and respond accordingly.
						</span>
					</div>

					<div className="addInstruction" onClick={toggleInstructionModal}>
						Add a Instruction
					</div>
				</div>

				<div className="instructionsListContainer">
					<div className="header">
						<span>Title</span>
						<span>Last edit</span>
						<span>Active</span>
					</div>
					{info.instructionDataLoading ? (
						[{}, {}, {}, {}, {}, {}, {}]?.map((_, index) => (
							<div key={index} className="instructionItemSkeleton">
								<Skeleton width="100%" height="36px" borderRadius="6px" />
							</div>
						))
					) : info?.instructionData?.length > 0 ? (
						info?.instructionData?.map((item) => (
							<div key={item?._id} className="instructionItem">
								<span>
									{item?.title}{' '}
									<Edit onClick={() => handleEditInstruction(item?._id)} />
								</span>
								<span style={{ color: '#7C7C84' }}>
									{moment.unix(item?.updatedAt).format('MMM DD, YYYY')}
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
							<p>No instructions added</p>
							<p>Add instructions to guide your AI assistant</p>
						</div>
					)}
				</div>
			</div>

			<InstructionModal
				isOpen={info?.isInstructionModalOpen}
				onClose={toggleInstructionModal}
				title={info?.instructionBody?.title}
				instruction={info?.instructionBody?.instruction}
				onTitleChange={(value) => updateInstructionBody('title', value)}
				onInstructionChange={(value) => updateInstructionBody('instruction', value)}
				onActionClick={handleInstructionAction}
				isActionbtnLoading={info?.updatingInstruction}
				instructionEditing={info?.instructionEditing}
				showDelete={info?.deletingInstruction}
				onDeleteClick={handleDeleteInstruction}
			/>
		</div>
	);
};

export default memo(AiInstructions);
