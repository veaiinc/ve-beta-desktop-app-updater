import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilder.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';
import WorkflowCardEditModal from '../../components/modalsV2/workflowBuilderModals/WorkflowCardEditModal';
import Context from '../../../context/context';
const WorkflowBuilder = () => {
	const {
		templates: { getTemplateInfo, specificTemplatesInfo },
	} = useContext(Context);
	const [info, setInfo] = useState({
		data: null,
		modalIsOpen: false,
		previousStepId: null,
	});

	//useEffects
	useEffect(() => {
		getTemplateInfoSteps();
	}, []);

	useEffect(() => {
		if (specificTemplatesInfo && specificTemplatesInfo?.steps?.length) {
			console.log('hgello', specificTemplatesInfo);
			setInfo((prev) => ({ ...prev, data: specificTemplatesInfo?.steps }));
		}
	}, [specificTemplatesInfo]);

	//function definations

	const getTemplateInfoSteps = useCallback(async () => {
		const payload = {
			templateInfoId: '66a7847c1a2699da2140c180',
		};
		getTemplateInfo(payload);
	}, [getTemplateInfo]);

	const closeModalFunc = useCallback(() => {
		setInfo((prev) => ({ ...prev, modalIsOpen: false }));
	}, []);

	const openModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, modalIsOpen: true }));
	}, []);

	const alterData = useCallback(
		(index, newData) => {
			// const updatedata = [...info?.data];
			// updatedata?.splice(index, 0, newData);
			setInfo((prev) => ({
				...prev,
				modalIsOpen: true,
				previousStepId: info?.data?.[index - 1]?._id,
			}));
		},
		[info?.data],
	);

	return (
		<div className="workflowBuilderContainer">
			{/* header */}
			<div className="workflowBuilderHeader">
				<div className="workflowBuilderNavigationContainer">
					<BackArrow />
					<span className="builderHeaderText">Run your Studio Like Made in Heaven</span>
					<div className="draftBtn">Draft</div>
				</div>
				<div className="discardSaveBtnGrp">
					<div className="discardBtn">Discard</div>
					<div className="saveChangesbtn">Save Changes</div>
				</div>
			</div>
			<div className="workflowBuilderContentContainer">
				{info?.data?.map((ele, index) => (
					<div
						key={index}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '10px',
						}}
					>
						<WorkflowBuilderCards workflowdata={ele} openModal={openModal} />
						<WorkflowConnector alterData={alterData} index={index} />
					</div>
				))}
				<WorkflowCardEditModal
					closeModalFunc={closeModalFunc}
					modalIsOpen={info?.modalIsOpen}
					previousStepId={info?.previousStepId}
				/>
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
