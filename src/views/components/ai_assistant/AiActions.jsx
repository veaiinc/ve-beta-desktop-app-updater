import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiInstructions.scss';

const AiActions = () => {
	const [toggleStates, setToggleStates] = useState({
		instruction_toggle_1: false,
		instruction_toggle_2: false,
	});

	const handleToggleChange = (toggleId) => {
		setToggleStates((prevStates) => ({
			...prevStates,
			[toggleId]: !prevStates[toggleId],
		}));
	};

	return (
		<div className="aiInstructionsParentContainer">
			<div className="instructionsHeaderContainer">
				<div className="instructionsHeader">
					<span className="lineone">Action</span>
					<span className="linetwo">
						Automates tasks like triggering APIs or connecting with external systems.
					</span>
				</div>

				<div className="addInstruction">Add action</div>
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

					<span className="toggleSwitch">
						<input
							type="checkbox"
							id="instruction_toggle_1"
							className="toggle"
							checked={toggleStates.instruction_toggle_1}
							onChange={() => handleToggleChange('instruction_toggle_1')}
						/>
						<label htmlFor="instruction_toggle_1"></label>
					</span>
				</div>
				<div className="instructionItem">
					<span>Speak about customer</span>
					<span style={{ color: '#7C7C84' }}>Jul, 26 2024</span>

					<span className="toggleSwitch">
						<input
							type="checkbox"
							id="instruction_toggle_2"
							className="toggle"
							checked={toggleStates.instruction_toggle_2}
							onChange={() => handleToggleChange('instruction_toggle_2')}
						/>
						<label htmlFor="instruction_toggle_2"></label>
					</span>
				</div>
			</div>
		</div>
	);
};

export default memo(AiActions);
