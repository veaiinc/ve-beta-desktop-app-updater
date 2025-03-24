import { memo, useContext, useEffect, useState, useCallback } from 'react';
import '../../../assets/scss/AiSetup/aiSetup.scss';
import SectionBlock from '../../components/AiSetup/SectionBlock';
import Context from '../../../context/context';
import AddNewGoalModal from '../../components/modalsV2/settings/ai_setup/AddNewGoalModal';
import { message } from 'antd';
const AiSetup = () => {
	const {
		aiSetup: { getAiSetup, aiSetupData, updateAiSetupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiSetup: null,
		openAddNewGoalModal: false,
		loading: true,
		modalType: 'memory',
		submitLoading: false,
	});

	useEffect(() => {
		if (!aiSetupData) {
			getAiSetup();
		} else {
			updateState({ aiSetup: aiSetupData, loading: false });
		}
	}, [aiSetupData]);

	const updateState = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleOpenAddNewGoalModal = useCallback((type) => {
		updateState({ openAddNewGoalModal: true, modalType: type });
	}, []);

	const handleCloseAddNewGoalModal = useCallback(() => {
		updateState({ openAddNewGoalModal: false });
	}, []);

	const handleSubmit = useCallback(async (data) => {
		updateState({ submitLoading: true });
		const response = await updateAiSetupData(data);
		if (response?.[0]) {
			message?.success('Updated successfully');
			updateState({ submitLoading: false, openAddNewGoalModal: false });
		} else {
			message?.error('Failed to update');
			updateState({ submitLoading: false });
		}
	}, []);

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
							type="goal"
							title="Goals"
							data={aiSetupData?.goal}
							loading={info?.loading}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							type="focus"
							title="Things I need to know"
							data={aiSetupData?.focus}
							loading={info?.loading}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							title="Memory"
							type="memory"
							data={aiSetupData?.memory}
							loading={info?.loading}
						/>
					</div>
				</div>
			</div>
			<AddNewGoalModal
				openAddNewGoalModal={info?.openAddNewGoalModal}
				closeAddNewGoalModal={handleCloseAddNewGoalModal}
				type={info?.modalType}
				onSubmit={handleSubmit}
				submitLoading={info?.submitLoading}
			/>
		</>
	);
};

export default memo(AiSetup);
