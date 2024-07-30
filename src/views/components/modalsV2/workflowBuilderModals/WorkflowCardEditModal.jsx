import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Dustbin } from '../../../../assets/svg/worflow_builder/dustbin.svg';
import { ReactComponent as EditSvg } from '../../../../assets/svg/worflow_builder/edit.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import JoditEditor from 'jodit-react';
import Context from '../../../../context/context';
import ToggleSlider from '../../input/slider';
import moment from 'moment';
import Spinner from '../../loaders/Spinner';
const options = [
	{
		label: 'Minutes',
		value: 'minutes',
	},

	{
		label: 'Hours',
		value: 'hours',
	},
	{
		label: 'Days',
		value: 'days',
	},
	{
		label: 'Weeks',
		value: 'week',
	},
];

const smartFileActions = [
	{
		label: 'After Form response is submitted',
		value: 'After Form response is submitted',
	},

	{
		label: 'After Smart file is sent for un Accepted Proposals',
		value: 'After Smart file is sent for un Accepted Proposals',
	},
	{
		label: 'After Proposal accepted',
		value: 'After Proposal accepted',
	},
	{
		label: 'After Proposal accepted, Unsigned Contract',
		value: 'After Proposal accepted, Unsigned Contract',
	},
	{
		label: 'After Form response is submitted',
		value: 'After Form response is submitted',
	},

	{
		label: 'After Smart file is sent for un Accepted Proposals',
		value: 'After Smart file is sent for un Accepted Proposals',
	},
	{
		label: 'After Proposal accepted',
		value: 'After Proposal accepted',
	},
	{
		label: 'After Proposal accepted, Unsigned Contract',
		value: 'After Proposal accepted, Unsigned Contract',
	},
];

const WorkflowCardEditModal = ({ modalIsOpen, closeModalFunc, previousStepId }) => {
	const editor = useRef(null);
	const {
		templates: { getAllEmailTemplates, allEmailTemplates, addEmailTriggersInWorkflow },
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
		saveLoader: true,
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
		setInfo((prev) => ({ ...prev, editState: false }));
	}, [closeModalFunc]);

	const saveChangesFunc = useCallback(async () => {
		if (info?.editState) {
			return setInfo((prev) => ({ ...prev, editState: false }));
		}
		if (info?.saveLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, saveLoader: true }));

		const timeStamp = await calculateTimeStamp(info?.selectedDuration?.value, info?.noOfDays);
		const payload = {
			templateId: '66a7847c1a2699da2140c180',
			updateObj: {
				addEmailTrigger: {
					approvalRequired: info?.requiredApproval,
					emailTemplateId: info?.selectedEmailTemplate?._id,
					previousStepId: previousStepId,
					sendAt: timeStamp,
				},
			},
		};
		const response = await addEmailTriggersInWorkflow(payload);
		setInfo((prev) => ({ ...prev, saveLoader: false }));
	}, [
		info.editState,
		info.saveLoader,
		previousStepId,
		info?.selectedEmailTemplate,
		info?.noOfDays,
		info?.selectedDuration,
	]);

	const calculateTimeStamp = useCallback(async (selectedDuration, duration) => {
		const now = moment();
		if (selectedDuration === 'minutes') {
			now.add(duration, 'minutes');
		}
		if (selectedDuration === 'hours') {
			now.add(duration, 'hours');
		}
		if (selectedDuration === 'days') {
			now.add(duration, 'days');
		}
		if (selectedDuration === 'week') {
			now.add(duration, 'weeks');
		}
		return now.unix();
	}, []);

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

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal} modalType="right">
			<div className="WorkflowCardEditModalParentContainer">
				<div className="innerContainer">
					{/* header */}
					<div className="workflowHeader">
						<span className="headerTitle">
							{info?.editState ? 'Edit Email' : `Edit Action`}
						</span>
						<div className="closeDeleteContainer">
							{!info?.editState ? (
								<>
									<span className="closeBtn">
										<Dustbin />
									</span>
									<div className="deleteBtn">Delete</div>
								</>
							) : (
								''
							)}
							<div className="closeBtn" onClick={closeModalFunc}>
								<Close />
							</div>
						</div>
					</div>
					{!info?.editState ? (
						<div className="WorkFlowEditorBody">
							{/* action typ */}
							<div className="actionType">
								<span className="actionTypeTitle">Action Type</span>

								<HeadersDropDownComp
									showIcon={false}
									options={info?.emailTemplates}
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
										top: '60px',
										maxHeight: '300px',
									}}
									selectedValue={info?.selectedEmailTemplate?.title}
									onChangeFunc={(e) => onChangeEmailTemplates(e)}
								/>
							</div>
							{/* email template */}
							<div className="emailTemplate">
								<div className="emailTemplateHeader">
									<span className="emailTemplateNameStyling">
										Subject Line Here
									</span>
									<div
										className="editBtnContainer"
										onClick={() =>
											setInfo((prev) => ({ ...prev, editState: true }))
										}
									>
										<span className="EditBtn">Edit</span>
										<EditSvg />
									</div>
								</div>
								<div className="subjectInputDiv">{info?.subject}</div>
							</div>
							<div
								className="emailTemplate"
								style={{
									paddingBottom: '20px',
									borderBottom: '1px solid rgba(40, 39, 40, 0.48)',
								}}
							>
								<div className="emailTemplateHeader">
									<span className="emailTemplateNameStyling">
										Email Body Here
									</span>
								</div>
								<div className="emailBody">
									<div dangerouslySetInnerHTML={{ __html: info?.emailBody }} />
								</div>
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
						</div>
					) : (
						<div className="editEmailContainer">
							<div className="editEmailSubject">
								<span className="emailSubjectHeader">Subject Line Here</span>
								<textarea
									className="subjectTextArea"
									value={info?.subject}
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, subject: e?.target?.value }))
									}
								/>
							</div>
							<JoditEditor
								ref={editor}
								value={info?.emailBody}
								tabIndex={1} // tabIndex of textarea
								onBlur={(newContent) =>
									setInfo((prev) => ({ ...prev, emailBody: newContent }))
								} // preferred to use only this option to update the content for performance reasons
								onChange={(newContent) =>
									setInfo((prev) => ({ ...prev, emailBody: newContent }))
								}
							/>
						</div>
					)}

					{/* footer */}
					<div className="workflowEditorFooter">
						<div className="saveBtn" onClick={saveChangesFunc}>
							{info?.saveLoader ? <Spinner width={'16px'} height={'16px'} /> : ''}
							{info?.saveLoader ? 'Saving...' : 'Save Changes'}
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(WorkflowCardEditModal);
