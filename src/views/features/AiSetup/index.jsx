import { memo, useContext, useEffect, useState, useCallback } from 'react';
import '../../../assets/scss/AiSetup/aiSetup.scss';
import SectionBlock from '../../components/AiS/SectionBlock';
import Context from '../../../context/context';
import AddNewGoalModal from '../../components/modalsV2/settings/ai_setup/AddNewGoalModal';
import { message } from 'antd';
import ConfirmationModal from '../../components/modalsV2/settings/ai_setup/ConfirmationModal';
const AiSetup = () => {
	const {
		aiSetup: { getAiSetup, aiSetupData, updateAiSetupData, resetAiSetupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiSetup: null,
		openAddNewGoalModal: false,
		loading: true,
		modalType: 'memory',
		submitLoading: false,
		openConfirmationModal: false,
		resetLoading: false,
		resetSelectedType: null,
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

	const handleResetBtnClick = useCallback((type) => {
		updateState({ openConfirmationModal: true, resetSelectedType: type });
	}, []);

	const handleSubmit = useCallback(async (data) => {
		updateState({ submitLoading: true });
		const response = await updateAiSetupData(data);
		if (response?.[0]) {
			message?.success('Updated successfully');
			updateState({ submitLoading: false, openAddNewGoalModal: false });
			return true;
		} else {
			message?.error('Failed to update');
			updateState({ submitLoading: false });
			return false;
		}
	}, []);

	const handleResetAiSetup = useCallback(async () => {
		updateState({ resetLoading: true });
		const response = await resetAiSetupData(info?.resetSelectedType);
		if (response?.[0]) {
			message?.success('Reset successfully');
			updateState({ resetLoading: false, openConfirmationModal: false });
		} else {
			message?.error('Failed to reset');
			updateState({ resetLoading: false });
		}
	}, [info?.resetSelectedType]);

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
							onResetClick={handleResetBtnClick}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							type="focus"
							title="Things I need to know"
							data={aiSetupData?.focus}
							loading={info?.loading}
							onResetClick={handleResetBtnClick}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							title="Memory"
							type="memory"
							data={aiSetupData?.memory}
							loading={info?.loading}
							onResetClick={handleResetBtnClick}
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
			<ConfirmationModal
				open={info?.openConfirmationModal}
				close={() => updateState({ openConfirmationModal: false })}
				onConfirm={handleResetAiSetup}
				title="Reset AI Setup"
				description="Are you sure you want to reset the AI Setup? This action cannot be undone."
				resetLoading={info?.resetLoading}
			/>
		</>
	);
};

export default memo(AiSetup);
