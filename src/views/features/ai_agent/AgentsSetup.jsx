import React, { memo, useMemo, useState } from 'react';
import '../../../assets/scss/ai_agents/agentsSetup.scss';
import { Tooltip } from 'antd';
import ToolTipContainer from '../../components/popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/workflow/questionMark.svg';
import ToggleSlider from '../../components/input/slider';
import BottomToolbar from '../../components/ai_agents/BottomToolbar';
const AgentsSetup = () => {
	const [arrow, setArrow] = useState('Show');
	const mergedArrow = useMemo(() => {
		if (arrow === 'Hide') {
			return false;
		}
		if (arrow === 'Show') {
			return true;
		}
		return {
			pointAtCenter: true,
		};
	}, [arrow]);
	return (
		<div className="agentsSetupParentContainer">
			<div className="agentsSetupHeaderContainer">
				<span className="agentsSetupHeaderText">AI Setup for Da Vinci</span>
				<Tooltip
					placement="right"
					title={<ToolTipContainer title={'Da Vinci'} content={'Da Vinci for you'} />}
					arrow={mergedArrow}
					color={'#202020'}
				>
					<QuestionMark />
				</Tooltip>
			</div>

			{/* //Instruction */}

			<div className="aiSetupInstructionsContainer">
				<div className="aiSetupInstructionsHeader">
					<div className="aiSetupInstructionsHeaderText">
						Instructions
						<Tooltip
							placement="bottomLeft"
							title={
								<ToolTipContainer
									title={'Events'}
									content={
										'This table outlines the different events that will be covered by the business, including dates, locations, and descriptions.'
									}
								/>
							}
							arrow={mergedArrow}
							color={'#202020'}
						>
							<QuestionMark />
						</Tooltip>
					</div>
					<div className="addInstructionButton">Add Instruction</div>
				</div>
				<div className="aiSetupInstructionsTableContainer">
					<div className="aiSetupInstructionsHeaderTab">
						<div style={{ flex: 1 }}>Title</div>
						<div style={{ flex: 1 }}>Last Edited</div>
						<div style={{ flex: 1 }}>Status</div>
					</div>
					{[{}, {}, {}]?.map((ele, index) => (
						<div className="aiSetupInstructionRow" key={index}>
							<div style={{ flex: 1 }} className="instrunctionsRowTitle">
								Limit the color options
							</div>
							<div style={{ flex: 1 }} className="instructionsDate">
								Jul, 26 2024
							</div>
							<div style={{ flex: 1 }}>
								<ToggleSlider />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* //workflow actions */}
			<div className="aiSetupInstructionsContainer">
				<div className="aiSetupInstructionsHeader">
					<div className="aiSetupInstructionsHeaderText">
						Workflow Actions
						<Tooltip
							placement="bottomLeft"
							title={
								<ToolTipContainer
									title={'Events'}
									content={
										'This table outlines the different events that will be covered by the business, including dates, locations, and descriptions.'
									}
								/>
							}
							arrow={mergedArrow}
							color={'#202020'}
						>
							<QuestionMark />
						</Tooltip>
					</div>
					<div className="addInstructionButton">Add Actions</div>
				</div>
				<div className="aiSetupInstructionsTableContainer">
					<div className="aiSetupInstructionsHeaderTab">
						<div style={{ flex: 1 }}>Title</div>
						<div style={{ flex: 1 }}>Last Edited</div>
						<div style={{ flex: 1 }}>Status</div>
					</div>
					{[{}, {}, {}]?.map((ele, index) => (
						<div className="aiSetupInstructionRow" key={index}>
							<div style={{ flex: 1 }} className="instrunctionsRowTitle">
								Limit the color options
							</div>
							<div style={{ flex: 1 }} className="instructionsDate">
								Jul, 26 2024
							</div>
							<div style={{ flex: 1 }}>
								<ToggleSlider />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Knowledge Base */}

			<div className="aiSetupInstructionsContainer">
				<div className="aiSetupInstructionsHeader">
					<div className="aiSetupInstructionsHeaderText">
						Knowledge Base
						<Tooltip
							placement="bottomLeft"
							title={
								<ToolTipContainer
									title={'Events'}
									content={
										'This table outlines the different events that will be covered by the business, including dates, locations, and descriptions.'
									}
								/>
							}
							arrow={mergedArrow}
							color={'#202020'}
						>
							<QuestionMark />
						</Tooltip>
					</div>
					<div className="addInstructionButton">Add More</div>
				</div>
				<div className="aiSetupInstructionsTableContainer">
					<div className="aiSetupInstructionsHeaderTab">
						<div style={{ flex: 1 }}>Title</div>
						<div style={{ flex: 1 }}>Last Edited</div>
						<div style={{ flex: 1 }}>Status</div>
					</div>
					{[{}, {}, {}]?.map((ele, index) => (
						<div className="aiSetupInstructionRow" key={index}>
							<div style={{ flex: 1 }} className="instrunctionsRowTitle">
								Limit the color options
							</div>
							<div style={{ flex: 1 }} className="instructionsDate">
								Jul, 26 2024
							</div>
							<div style={{ flex: 1 }}>
								<ToggleSlider />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(AgentsSetup);
