import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiInstructions.scss';
import InstructionModal from '../modalsV2/ai_assistant/InstructionModal';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';
import ToggleSwitch from '../input/slider';
import { message } from 'antd';

const AiInstructions = ({ assistant }) => {
	const {
		aiSetup: { aiInstructions, getInstructions, createInstruction, updateInstruction },
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
			}));
		}
	}, [aiInstructions]);

	useEffect(() => {
		if (aiInstructions) {
			setInfo((prev) => ({
				...prev,
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
		setInfo((prev) => ({ ...prev, isInstructionModalOpen: !prev.isInstructionModalOpen }));
	};

	const createNewInstruction = useCallback(() => {
		setInfo((prev) => ({ ...prev, updatingInstruction: true }));
		createInstruction(aiAssistantId, info?.instructionBody);
	}, [info?.instructionBody, aiAssistantId]);

	const updateInstructionBody = useCallback((field, value) => {
		setInfo((prev) => ({
			...prev,
			instructionBody: {
				...prev.instructionBody,
				[field]: value,
			},
		}));
	}, []);

	console.log('info?.instructionData', info?.instructionData);

	return (
		<>
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
					{info.instructionDataLoading
						? [{}, {}, {}, {}, {}, {}, {}]?.map((_, index) => (
								<div key={index} className="instructionItemSkeleton">
									<Skeleton width="100%" height="36px" borderRadius="6px" />
								</div>
						  ))
						: (info?.instructionData || [])?.map((item) => (
								<div key={item?._id} className="instructionItem">
									<span>{item?.title}</span>
									<span style={{ color: '#7C7C84' }}>
										{moment.unix(item?.updatedAt).format('MMM DD, YYYY')}
									</span>
									<span className="aiToggleSwitch">
										<ToggleSwitch
											id={item?._id}
											value={item?.status}
											onChange={() =>
												handleToggleChange(item?._id, item?.status)
											}
										/>
									</span>
								</div>
						  ))}
				</div>
			</div>

			<InstructionModal
				isOpen={info?.isInstructionModalOpen}
				onClose={toggleInstructionModal}
				title={info?.instructionBody?.title}
				instruction={info?.instructionBody?.instruction}
				onTitleChange={(value) => updateInstructionBody('title', value)}
				onInstructionChange={(value) => updateInstructionBody('instruction', value)}
				onActionClick={createNewInstruction}
				isActionbtnLoading={info?.updatingInstruction}
			/>
		</>
	);
};

export default memo(AiInstructions);
