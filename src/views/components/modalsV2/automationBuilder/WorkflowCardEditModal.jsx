import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Dustbin } from '../../../../assets/svg/worflow_builder/dustbin.svg';
import { ReactComponent as Ai } from '../../../../assets/svg/workflow/ai.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import Context from '../../../../context/context';
import ToggleSlider from '../../input/slider';
import Spinner from '../../loaders/Spinner';
import DeleteWorkflowStep from './DeleteWorkflowStep';
import {
	calculateTimeDifference,
	smartFileActions,
	options,
	returnDurationOption,
	calculateTimeStamp,
} from '../../../features/workflow_builder/workflowContantsHelpers';
import { Drawer } from 'antd';
import EditAndViewEmailTemplateModal from './EditAndViewEmailTemplateModal';

const initialState = {
	editState: false,
	emailTemplates: null,
	selectedEmailTemplate: null,
	subject: '',
	emailBody: '',
	noOfDays: 1,
	selectedDuration: {
		label: 'Days',
		value: 'days',
	},
	requiredApproval: false,
	saveLoader: false,
	pageLoader: true,
	deleteStepModal: false,
	title: null,
	deleteLoader: false,
	previewAndEdit: false,
};

const WorkflowCardEditModal = ({
	modalIsOpen,
	closeModalFunc,
	previousStepId,
	addorUpdateSteps,
	mode,
	deleteWorkFlowStep,
	currentStepInfo,
	currentStepIndex,
	editWorkflowStep,
	templateId,
}) => {
	const {
		templates: {
			getAllEmailTemplates,
			allEmailTemplates,
			addEmailTriggersInWorkflow,
			getSpecificWorkflowTemplateDetails,
			updateWorkflowSteps,
		},
	} = useContext(Context);

	//states
	const [info, setInfo] = useState({
		editState: false,
		emailTemplates: null,
		selectedEmailTemplate: null,
		subject: '',
		emailBody: '',
		noOfDays: 1,
		selectedDuration: {
			label: 'Days',
			value: 'days',
		},
		requiredApproval: false,
		saveLoader: false,
		pageLoader: true,
		deleteStepModal: false,
		title: null,
		deleteLoader: false,
	});

	//useEFfects

	useEffect(() => {
		getEmailTemplates();
	}, []);

	useEffect(() => {
		if (allEmailTemplates) {
			const { data } = allEmailTemplates;

			const options = [];

			for (let i = 0; i < data?.length; i++) {
				let obj = {
					label: data?.[i]?.title,
					ele: data?.[i],
					_id: data?.[i]?._id,
				};
				options?.push(obj);
			}
			setInfo((prev) => ({
				...prev,
				emailTemplates: options,
				selectedEmailTemplate: data?.[0],
				subject: data?.[0]?.subject,
				emailBody: data?.[0]?.htmlBody,
			}));
		}
	}, [allEmailTemplates]);

	useEffect(() => {
		getSpecifiTemplateDetails();
	}, [modalIsOpen, mode, currentStepInfo]);

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
			const payload = {
				getEmailTemplateId: currentStepInfo?.emailTemplateId,
			};
			const response = await getSpecificWorkflowTemplateDetails(payload);
			const { approvalRequired, htmlBody, sendAt, subject, title } = response?.[1] || {};
			let timeStampData,
				noOfDays = 1,
				selectedDuration = {
					label: 'Days',
					value: 'days',
				};
			if (sendAt) {
				timeStampData = calculateTimeDifference(sendAt);
				noOfDays = +timeStampData?.[0];
				selectedDuration = returnDurationOption(timeStampData?.[1]);
			}

			setInfo((prev) => ({
				...prev,
				subject,
				emailBody: htmlBody,
				requiredApproval: approvalRequired,
				title,
				pageLoader: false,
				noOfDays,
				selectedDuration,
			}));
		}
		if (modalIsOpen && mode === 'create') {
			setInfo((prev) => ({ ...prev, pageLoader: false }));
		}
	}, [modalIsOpen, mode, currentStepInfo]);

	const onChangeEmailTemplates = useCallback(
		async (data) => {
			const { ele } = data;

			if (ele?._id === info?.selectedEmailTemplate?._id) {
				return;
			}

			setInfo((prev) => ({
				...prev,
				selectedEmailTemplate: ele,
				subject: ele?.subject,
				emailBody: ele?.htmlBody,
			}));
		},
		[info?.emailTemplates, info?.selectedEmailTemplate],
	);

	const closeModal = useCallback(() => {
		closeModalFunc();
		let updatedData = { ...initialState };
		if (info?.emailTemplates) {
			updatedData.emailTemplates = [...(info?.emailTemplates || [])];
			updatedData.selectedEmailTemplate = info?.emailTemplates?.[0]?.ele;
			updatedData.subject = info?.emailTemplates?.[0]?.ele?.subject;
			updatedData.emailBody = info?.emailTemplates?.[0]?.ele?.htmlBody;
		}

		setInfo(updatedData);
	}, [closeModalFunc, info?.emailTemplates]);

	const saveChangesFunc = useCallback(async () => {
		if (info?.info?.pageLoader) {
			return;
		}
		if (info?.editState) {
			return setInfo((prev) => ({ ...prev, editState: false }));
		}
		if (info?.saveLoader) {
			return;
		}

		setInfo((prev) => ({ ...prev, saveLoader: true }));

		let response;
		//save edit stage
		if (mode === 'edit') {
			const timeStamp = await calculateTimeStamp(
				info?.selectedDuration?.value,
				info?.noOfDays,
			);
			const payload = {
				updateEmailTemplateId: currentStepInfo?.emailTemplateId,
				updateTemplateInput: {
					approvalRequired: info?.requiredApproval,
					htmlBody: info?.emailBody,
					sendAt: timeStamp,
					subject: info?.subject,
				},
			};

			response = await updateWorkflowSteps(payload);
			setInfo((prev) => ({ ...prev, saveLoader: false }));
			if (response?.[0]) {
				const selectedIndex = currentStepIndex;
				closeModal();
				const newData = { ...currentStepInfo, emailTemplateSubject: info?.subject };
				editWorkflowStep(newData, selectedIndex);
			}
		}

		//save create stage
		if (mode === 'create') {
			const timeStamp = await calculateTimeStamp(
				info?.selectedDuration?.value,
				info?.noOfDays,
			);
			const payload = {
				templateId: templateId,
				updateObj: {
					addEmailTrigger: {
						approvalRequired: info?.requiredApproval,
						emailTemplateId: info?.selectedEmailTemplate?._id,
						previousStepId: previousStepId,
						sendAt: timeStamp,
						htmlBody: info?.emailBody,
						subject: info?.subject,
					},
				},
			};
			response = await addEmailTriggersInWorkflow(payload);
			setInfo((prev) => ({ ...prev, saveLoader: false }));
			if (response?.[0]) {
				const stepsData = response?.[1]?.steps;
				addorUpdateSteps(stepsData);
				closeModal();
			}
		}
	}, [
		info.editState,
		info.saveLoader,
		previousStepId,
		info?.selectedEmailTemplate,
		info?.noOfDays,
		info?.selectedDuration,
		info?.subject,
		info?.emailBody,
		info?.requiredApproval,
		mode,
		currentStepInfo,
		currentStepIndex,
		info?.pageLoader,
	]);

	const incrementorDecrementorFunc = useCallback(
		async (type) => {
			if (type === 'increment') {
				setInfo((prev) => ({ ...prev, noOfDays: prev?.noOfDays + 1 }));
			} else {
				setInfo((prev) => ({
					...prev,
					noOfDays: prev?.noOfDays - 1 >= 0 ? prev?.noOfDays - 1 : 1,
				}));
			}
		},
		[info?.noOfDays],
	);

	const onChangeDuration = useCallback(
		(data) => {
			if (info?.selectedDuration?.value === data?.value) {
				return;
			}
			setInfo((prev) => ({ ...prev, selectedDuration: data }));
		},
		[info?.selectedDuration],
	);

	const approvalOnChange = useCallback(async (data) => {
		setInfo((prev) => ({ ...prev, requiredApproval: data }));
	}, []);

	const closeDeleteStepModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, deleteStepModal: false }));
	}, []);

	const modifiedDeleteWorkflowStep = useCallback(async () => {
		if (info?.deleteLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, deleteLoader: true }));
		const response = await deleteWorkFlowStep();
		setInfo((prev) => ({ ...prev, deleteLoader: false }));
		if (response) {
			closeDeleteStepModal();
			closeModal();
		}
	}, [deleteWorkFlowStep, info?.deleteLoader]);

	const changeSubjectOrEmailBody = useCallback(
		(updatedData) => {
			setInfo((prev) => ({ ...prev, ...updatedData }));
		},
		[info],
	);

	return (
		<Drawer
			onClose={closeModal}
			width={420}
			open={modalIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="WorkflowCardEditModalParentContainer">
				<div className="innerContainer">
					{/* header */}
					<div className="workflowHeader">
						<span className="headerTitle">
							{info?.editState ? 'Edit Email' : `Edit Action`}
						</span>
						<div className="closeDeleteContainer">
							{/* {!info?.editState && mode === 'edit' ? (
								<div
									style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
									onClick={() =>
										setInfo((prev) => ({ ...prev, deleteStepModal: true }))
									}
								>
									<span className="closeBtn">
										<Dustbin />
									</span>
									<div className="deleteBtn">Delete</div>
								</div>
							) : (
								''
							)} */}
							<div className="closeBtn" onClick={closeModal}>
								<Close />
							</div>
						</div>
					</div>
					{info?.pageLoader ? (
						<div
							className="loadingScreen"
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								flex: 1,
								gap: '24px',
								color: '#fff',
							}}
						>
							<Spinner />
							<span>Fetching details ....</span>
						</div>
					) : (
						<div className="WorkFlowEditorBody">
							{/* action typ */}

							<div className="actionType">
								<span className="actionTypeTitle">Action Type</span>

								<div className="staticActionTitle">Send Email</div>
							</div>

							{/* email templates */}
							<div className="actionType">
								<div className="emailTemplateHeaderWrapper">
									<span className="actionTypeTitle">Email Templates</span>
									<span
										className="previewAndEdit"
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												previewAndEdit: true,
											}))
										}
									>
										Preview & edit
									</span>
								</div>

								{mode === 'create' ? (
									<HeadersDropDownComp
										showIcon={false}
										options={info?.emailTemplates}
										containerStyle={{
											padding: '12px 24px',
											height: '48px',
											padding: '12px 24px',
											color: '#e4e5e6',
											// width: 'inherit',
											flex: 1,
											alignSelf: 'stretch',
											borderRadius: '0.625rem',
											border: '1px solid rgba(36, 36, 36, 0.64)',
											backgroundColor: '#151515',
											width: '100%',
										}}
										dropDownStyle={{
											right: 0,
											top: '60px',
											maxHeight: '300px',
										}}
										selectedValue={info?.selectedEmailTemplate?.title}
										onChangeFunc={(e) => onChangeEmailTemplates(e)}
										outerContainerStyle={{ width: '100%' }}
										showSelectedValueTick={true}
										uniqueIdentifierForTickIcon={'_id'}
										selectedValueObj={info?.selectedEmailTemplate}
										dropDownTextStyling={{
											color: 'var(--nav-bar-button-text, #FFF)',
											fontFamily: 'Inter',
											fontSize: '14px',
											fontStyle: 'normal',
											fontWeight: '400',
											lineHeight: '26px' /* 185.714% */,
											textTransform: 'capitalize',
										}}
									/>
								) : (
									<div className="staticActionTitle">{info?.title}</div>
								)}
							</div>

							<div className="emailScheduleTimingContainer">
								<span className="emailScheduleTimingContainerheader">When?</span>
								<div className="buttonContainer">
									<div className="daysIncrementor">
										<span
											className="incrementorButtons"
											onClick={() => incrementorDecrementorFunc('decrement')}
										>
											-
										</span>
										<input
											type="number"
											className="daysIncrementText"
											value={info?.noOfDays}
										/>
										<span
											className="incrementorButtons"
											onClick={() => incrementorDecrementorFunc('increment')}
										>
											+
										</span>
									</div>
									<HeadersDropDownComp
										showIcon={false}
										options={options}
										containerStyle={{
											padding: '12px 24px',
											height: '48px',
											padding: '12px 24px',
											color: '#e4e5e6',
											width: 'inherit',
											flex: 1,
											alignSelf: 'stretch',
											borderRadius: '0.625rem',
											border: '1px solid rgba(36, 36, 36, 0.64)',
											backgroundColor: '#151515',
										}}
										dropDownStyle={{
											right: 0,
											top: '-170px',
											maxHeight: '300px',
										}}
										selectedValue={info?.selectedDuration?.label}
										onChangeFunc={(e) => onChangeDuration(e)}
										outerContainerStyle={{ width: '100%' }}
										showSelectedValueTick={true}
										uniqueIdentifierForTickIcon={'value'}
										selectedValueObj={info?.selectedDuration}
										dropDownTextStyling={{
											color: 'var(--nav-bar-button-text, #FFF)',
											fontFamily: 'Inter',
											fontSize: '14px',
											fontStyle: 'normal',
											fontWeight: '400',
											lineHeight: '26px' /* 185.714% */,
											textTransform: 'capitalize',
										}}
									/>
								</div>
								<HeadersDropDownComp
									showIcon={false}
									options={smartFileActions}
									containerStyle={{
										padding: '12px 24px',
										height: '48px',
										padding: '12px 24px',
										color: '#e4e5e6',
										width: 'inherit',
										flex: 1,
										alignSelf: 'stretch',
										borderRadius: '0.625rem',
										border: '1px solid rgba(36, 36, 36, 0.64)',
										backgroundColor: '#151515',
									}}
									dropDownStyle={{
										right: 0,
										top: '-295px',
										maxHeight: '300px',
									}}
									outerContainerStyle={{ width: '100%' }}
								/>
							</div>
							<div className="approvalContainer">
								<span className="approvalContainerHeader">
									Require Approval before sending
								</span>
								<ToggleSlider
									value={info?.requiredApproval}
									onChange={approvalOnChange}
								/>
							</div>
							<div className="editWorkflowBuilderModalFooterContainer">
								<Ai />
								<span className="editWorkflowBuilderModalFooterTextStyling">
									If you need assistance, contact our support team at<br></br>
									<span className="supportVeText">support@ve.ai</span>
									<br></br>
									Here’s to doing what you love! Let’s do this :)
								</span>
							</div>
						</div>
					)}

					{/* footer */}
					{/* <div className="workflowEditorFooter">
						<div className="saveBtn" onClick={saveChangesFunc}>
							{info?.saveLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
							{info?.saveLoader ? 'Saving...' : 'Save Changes'}
						</div>
					</div> */}
				</div>
			</div>

			<DeleteWorkflowStep
				modalIsOpen={info?.deleteStepModal}
				closeModal={closeDeleteStepModal}
				deleteWorkFlowStep={modifiedDeleteWorkflowStep}
				deleteLoader={info?.deleteLoader}
			/>
			<EditAndViewEmailTemplateModal
				open={info?.previewAndEdit}
				closeModal={() => setInfo((prev) => ({ ...prev, previewAndEdit: false }))}
				subject={info?.subject}
				emailBody={info?.emailBody}
				changeSubjectOrEmailBody={changeSubjectOrEmailBody}
			/>
		</Drawer>
	);
};

export default memo(WorkflowCardEditModal);
