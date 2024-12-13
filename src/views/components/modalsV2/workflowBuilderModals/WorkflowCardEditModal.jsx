/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import Context from '../../../../context/context';
import { Drawer } from 'antd';
import RenderActionUi from './RenderActionUi';
import RenderNotificationUi from './NotificationUi';
import WorkflowBuilderLoader from '../../workflowBuilderComponents/WorkflowBuilderLoader';
import RenderConditionUi from './ConditionalUi';
import RenderPipelineUi from './PipelineUi';
const initialState = {
	editState: false,
	pageLoader: true,
	localOptionType: null,
};

const WorkflowCardEditModal = ({
	modalIsOpen,
	closeModalFunc,
	previousStepId,
	mode,
	currentStepInfo,
	templateId,
	previousStepPath,
	optionType,
	newNodeType,
	moveToPath,
	scrollToNewOrUpdatedNodes,
}) => {
	const {
		templates: { getAllEmailTemplates, getSpecificTemplatesInfo },
		profileInfo: { getTenantSettings, tennantSettingsData },
	} = useContext(Context);

	//states
	const [info, setInfo] = useState({
		...initialState,
	});

	//useEFfects

	useEffect(() => {
		getEmailTemplates();
	}, []);

	useEffect(() => {
		getSpecifiTemplateDetails();
	}, [modalIsOpen, mode, currentStepInfo]);

	useEffect(() => {
		if (optionType) {
			setInfo((prev) => ({ localOptionType: optionType }));
		}
	}, [optionType]);

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, []);

	//function definations

	const getEmailTemplates = useCallback(() => {
		const payload = {
			filters: {
				limit: 1000,
				page: 1,
				modules: ['forms', 'proposals', 'contracts', 'invoices'],
			},
		};
		getAllEmailTemplates(payload);
	}, [getAllEmailTemplates]);

	const getSpecifiTemplateDetails = useCallback(async () => {
		if (modalIsOpen && mode === 'edit') {
			const { type, actionType } = currentStepInfo || {};
			let finalisedOption = type === 'condition' ? type : actionType;
			setInfo((prev) => ({ ...prev, localOptionType: finalisedOption, pageLoader: false }));
		}
		if (modalIsOpen && mode === 'create') {
			setInfo((prev) => ({ ...prev, pageLoader: false }));
		}
	}, [modalIsOpen, mode, currentStepInfo]);

	const closeModal = useCallback(() => {
		closeModalFunc();
		let updatedData = { ...initialState };
		setInfo(updatedData);
	}, [closeModalFunc]);

	const changeLocalOptionType = useCallback(
		(data) => {
			if (data === info?.localOptionType) {
				return;
			}
			setInfo((prev) => ({ ...prev, localOptionType: data }));
		},
		[info?.localOptionType],
	);

	const refetchWorkflowBuilderData = useCallback(async () => {
		const response = await getSpecificTemplatesInfo({
			templateInfoId: templateId,
		});
		return response;
	}, [templateId]);

	///updated functions
	const compMapper = useMemo(() => {
		if (info?.localOptionType) {
			return {
				action: (
					<RenderActionUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
					/>
				),
				condition: (
					<RenderConditionUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
						previousStepId={previousStepId}
						templateId={templateId}
						previousStepPath={previousStepPath}
						moveToPath={moveToPath}
						refetchWorkflowBuilderData={refetchWorkflowBuilderData}
						mode={mode}
						currentStepInfo={currentStepInfo}
						scrollToNewOrUpdatedNodes={scrollToNewOrUpdatedNodes}
					/>
				),
				notification: (
					<RenderNotificationUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
						previousStepId={previousStepId}
						templateId={templateId}
						previousStepPath={previousStepPath}
						refetchWorkflowBuilderData={refetchWorkflowBuilderData}
						mode={mode}
						currentStepInfo={currentStepInfo}
						scrollToNewOrUpdatedNodes={scrollToNewOrUpdatedNodes}
					/>
				),
				pipeline: (
					<RenderPipelineUi
						closeModal={closeModal}
						changeLocalOptionType={changeLocalOptionType}
						localOptionType={info?.localOptionType}
					/>
				),
			};
		}
	}, [info?.localOptionType]);

	return (
		<Drawer
			onClose={closeModal}
			width={360}
			open={modalIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			zIndex={1500}
		>
			<div className="WorkflowCardEditModalParentContainer">
				<div className="innerContainer">
					{info?.pageLoader ? (
						<WorkflowBuilderLoader />
					) : (
						compMapper?.[info?.localOptionType]
					)}
				</div>
			</div>
		</Drawer>
	);
};

export default memo(WorkflowCardEditModal);
