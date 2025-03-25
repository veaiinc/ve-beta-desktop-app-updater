import { memo, useContext, useEffect, useState, useCallback } from 'react';
import '../../../assets/scss/AiSetup/aiSetup.scss';
import SectionBlock from '../../components/AiS/SectionBlock';
import Context from '../../../context/context';
import AddNewGoalModal from '../../components/modalsV2/settings/ai_setup/AddNewGoalModal';
import { message } from 'antd';
import ConfirmationModal from '../../components/modalsV2/settings/ai_setup/ConfirmationModal';
const AiSetup = () => {
	const {
		aiSetup: {
			getAiSetup,
			aiSetupData,
			updateAiSetupData,
			resetAiSetupData,
			deleteAiSetupData,
			editAiSetupData,
		},
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
		confirmType: null,
		deleteSelectedData: null,
		editSelectedData: null,
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
		updateState({ openAddNewGoalModal: false, editSelectedData: null });
	}, []);

	const handleResetBtnClick = useCallback((type) => {
		updateState({
			openConfirmationModal: true,
			resetSelectedType: type,
			confirmType: 'reset',
		});
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

	const handleEditSubmit = useCallback(
		async (data) => {
			updateState({ submitLoading: true });
			const response = await editAiSetupData(
				info?.editSelectedData?.type,
				info?.editSelectedData?.id,
				{
					...(data?.type !== 'memory' && { heading: data?.heading }),
					description: data?.description,
				},
			);
			if (response?.[0]) {
				message?.success('Updated successfully');
				updateState({ submitLoading: false, openAddNewGoalModal: false });
				return true;
			} else {
				message?.error('Failed to update');
				updateState({ submitLoading: false });
				return false;
			}
		},
		[info?.editSelectedData],
	);

	const handleResetAiSetup = useCallback(async () => {
		updateState({ resetLoading: true });
		const response = await resetAiSetupData(info?.resetSelectedType);
		if (response?.[0]) {
			message?.success('Reset successfully');
			updateState({
				resetLoading: false,
				openConfirmationModal: false,
				confirmType: null,
				resetSelectedType: null,
			});
		} else {
			message?.error('Failed to reset');
			updateState({ resetLoading: false });
		}
	}, [info?.resetSelectedType]);

	const handleDeleteAiSetupData = useCallback(async () => {
		updateState({ resetLoading: true });
		const response = await deleteAiSetupData(
			info?.deleteSelectedData?.type,
			info?.deleteSelectedData?.id,
		);
		if (response?.[0]) {
			message?.success('Deleted successfully');
			updateState({
				resetLoading: false,
				openConfirmationModal: false,
				confirmType: null,
				deleteSelectedData: null,
			});
		} else {
			message?.error('Failed to delete');
			updateState({ resetLoading: false });
		}
	}, [info?.deleteSelectedData]);

	const handleDeleteButtonClick = useCallback((type, id) => {
		updateState({
			openConfirmationModal: true,
			deleteSelectedData: { type, id },
			confirmType: 'delete',
		});
	}, []);

	const handleEditButtonClick = useCallback((type, id, heading, description) => {
		updateState({
			openAddNewGoalModal: true,
			modalType: type,
			editSelectedData: {
				type,
				id,
				...(type !== 'memory' && { heading }),
				description,
			},
		});
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
							onResetClick={handleResetBtnClick}
							onDeleteClick={handleDeleteButtonClick}
							onEditClick={handleEditButtonClick}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							type="focus"
							title="Things I need to know"
							data={aiSetupData?.focus}
							loading={info?.loading}
							onResetClick={handleResetBtnClick}
							onDeleteClick={handleDeleteButtonClick}
							onEditClick={handleEditButtonClick}
						/>
						<SectionBlock
							openAddNewGoalModal={handleOpenAddNewGoalModal}
							title="Memory"
							type="memory"
							data={aiSetupData?.memory}
							loading={info?.loading}
							onResetClick={handleResetBtnClick}
							onDeleteClick={handleDeleteButtonClick}
							onEditClick={handleEditButtonClick}
						/>
					</div>
				</div>
			</div>
			<AddNewGoalModal
				openAddNewGoalModal={info?.openAddNewGoalModal}
				closeAddNewGoalModal={handleCloseAddNewGoalModal}
				type={info?.modalType}
				onSubmit={info?.editSelectedData ? handleEditSubmit : handleSubmit}
				submitLoading={info?.submitLoading}
				editSelectedData={info?.editSelectedData}
			/>
			<ConfirmationModal
				open={info?.openConfirmationModal}
				close={() => updateState({ openConfirmationModal: false })}
				onConfirm={
					info?.confirmType === 'reset' ? handleResetAiSetup : handleDeleteAiSetupData
				}
				title={info?.confirmType === 'reset' ? 'Reset AI Setup' : 'Delete AI Setup Data'}
				description={
					info?.confirmType === 'reset'
						? 'Are you sure you want to reset the AI Setup? This action cannot be undone.'
						: 'Are you sure you want to delete the AI Setup Data? This action cannot be undone.'
				}
				resetLoading={info?.resetLoading}
			/>
		</>
	);
};

export default memo(AiSetup);
