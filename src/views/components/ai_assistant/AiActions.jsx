import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiInstructions.scss';
import ToggleSwitch from '../input/slider';
import ActionsModal from '../modalsV2/ai_assistant/ActionsModal';
const AiActions = () => {
	const [info, setInfo] = useState({
		instruction_toggle_1: false,
		instruction_toggle_2: false,
		actionModal: false,
	});

	const handleToggleChange = (toggleId) => {
		setInfo((prevStates) => ({
			...prevStates,
			[toggleId]: !prevStates[toggleId],
		}));
	};

	const handleAddAction = () => {
		setInfo((prevStates) => ({
			...prevStates,
			actionModal: !prevStates.actionModal,
		}));
	};

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

					<div className="addInstruction" onClick={handleAddAction}>
						Add action
					</div>
				</div>

				<div className="instructionsListContainer">
					<div className="header">
						<span>Title</span>
						<span>Last edit</span>
						<span>Active</span>
					</div>
					<div className="instructionItem">
						<span>Speak about customer</span>
						<span style={{ color: '#7C7C84' }}>Jul, 26 2024</span>
						<span className="aiToggleSwitch">
							<ToggleSwitch
								id="instruction_toggle_1"
								value={info.instruction_toggle_1}
								onChange={() => handleToggleChange('instruction_toggle_1')}
							/>
						</span>
					</div>
					<div className="instructionItem">
						<span>Speak about customer</span>
						<span style={{ color: '#7C7C84' }}>Jul, 26 2024</span>
						<span className="aiToggleSwitch">
							<ToggleSwitch
								id="instruction_toggle_2"
								value={info.instruction_toggle_2}
								onChange={() => handleToggleChange('instruction_toggle_2')}
							/>
						</span>
					</div>
				</div>
			</div>

			<ActionsModal
				isOpen={info?.actionModal}
				// isOpen={true}
				onClose={handleAddAction}
			/>
		</div>
	);
};

export default memo(AiActions);
