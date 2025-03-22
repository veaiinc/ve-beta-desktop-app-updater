import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/AiSetup/aiSetup.scss';
import SectionBlock from '../../components/AiSetup/SectionBlock';
import Context from '../../../context/context';
import AddNewGoalModal from '../../components/modalsV2/settings/ai_setup/AddNewGoalModal';

const AiSetup = () => {
	const {
		aiSetup: { getAiSetup, aiSetupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiSetup: null,
		openAddNewGoalModal: false,
	});

	useEffect(() => {
		if (!aiSetupData) {
			getAiSetup();
		} else {
			setInfo({ aiSetup: aiSetupData });
		}
	}, [aiSetupData]);

	const handleOpenAddNewGoalModal = () => {
		setInfo((prev) => ({ ...prev, openAddNewGoalModal: true }));
	};

	const handleCloseAddNewGoalModal = () => {
		setInfo((prev) => ({ ...prev, openAddNewGoalModal: false }));
	};

	return (
		<>
			<div className="AiSetupContainer">
				<div className="AiSetupWrapper">
					{/* <div className="ai-setup-tabs">Tabs goes here</div> */}
					<div className="ai-setup-sections">
						<h1 className="ai-setup-title">
							Tell me about your business, and I'll help you achieve your goals!
						</h1>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							title="Goals"
							data={aiSetupData?.goal}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							title="Things I need to know"
							data={aiSetupData?.focus}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							title="Memory"
							type="memory"
							data={aiSetupData?.memory}
						/>
					</div>
				</div>
			</div>
			<AddNewGoalModal
				openAddNewGoalModal={info?.openAddNewGoalModal}
				closeAddNewGoalModal={handleCloseAddNewGoalModal}
			/>
		</>
	);
};

export default memo(AiSetup);
