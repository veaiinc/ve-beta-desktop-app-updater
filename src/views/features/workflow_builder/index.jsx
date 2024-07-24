import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilder.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';
import WorkflowCardEditModal from '../../components/modalsV2/workflowBuilderModals/WorkflowCardEditModal';
const WorkflowBuilder = () => {
	const [info, setInfo] = useState({
		data: [
			{
				label: 'Workflow Start Point',
				title: 'Enquiry form for Running your studio Like Made in Heaven',
				actions: [{ name: 'View' }, { name: 'Edit Form' }],
				type: 'Entry',
			},
			{
				label: 'Wedding Proposal template',
				title: 'Proposal',
				actions: [],
				subLabel: 'Immediately after Form is submitted, wait for my approval',
				type: 'image',
			},
			{
				label: 'Reminder Email template',
				title: 'Send Reminder Email',
				actions: [{ name: 'Edit Email' }],
				subLabel: 'Wait for 2 hours after Proposal is sent and then wait for my approval',
			},
		],
		modalIsOpen: false,
	});

	const alterData = useCallback(
		(index, newData) => {
			const updatedata = [...info?.data];
			updatedata?.splice(index, 0, newData);
			setInfo((prev) => ({ ...prev, data: updatedata }));
		},
		[info?.data],
	);

	const closeModalFunc = useCallback(() => {
		setInfo((prev) => ({ ...prev, modalIsOpen: false }));
	}, []);

	const openModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, modalIsOpen: true }));
	}, []);

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
				/>
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
