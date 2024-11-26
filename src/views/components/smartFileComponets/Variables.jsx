import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import moment from 'moment';

const Variables = ({
	variablesData,
	variableOnChangeFunc,
	variableOnFocusFunc,
	editable,
	handleUpdateVaraiblesArray,
	expiresAt,
	updateSmartFileExpiry,
	gotUnacceptedAiGeneratedValue,
	openAiGenerateModal,
}) => {
	const [info, setInfo] = useState({
		data: [],

		variableMapper: {},
		timeout: null,
		workflowexpiryInDays: 0,
		workflowexpiryInDaysChanged: false,
		timeout: null,
	});

	//useEffects
	useEffect(() => {
		if (variablesData) {
			let data = [].concat(...Object.values(variablesData));
			let variableMapper = {};
			let updatedData = [];
			for (let i = 0; i < data?.length; i++) {
				if (variableMapper[data?.[i]?._id]) {
					variableMapper[data?.[i]?._id]?.push(data?.[i]);
				} else {
					variableMapper[data?.[i]?._id] = [data?.[i]];
					updatedData?.push(data?.[i]);
				}
			}
			setInfo((prev) => ({ ...prev, data: updatedData, variableMapper }));
		}
	}, [variablesData]);

	useEffect(() => {
		if (expiresAt) {
			const currentTimestamp = moment().unix();
			const hoursLeft = moment.unix(expiresAt).diff(moment.unix(currentTimestamp), 'hours');
			const daysLeft = Math.max(0, Math.ceil(hoursLeft / 24));
			setInfo((prev) => ({ ...prev, workflowexpiryInDays: daysLeft }));
		}
	}, [expiresAt]);

	useEffect(() => {
		if (info?.workflowexpiryInDaysChanged) {
			handleDebouceFunctionCall(info?.workflowexpiryInDays);
		}
	}, [info?.workflowexpiryInDays, info?.workflowexpiryInDaysChanged]);

	//function definations

	const onLocalVariableDataChange = useCallback(
		async (e, index) => {
			if (gotUnacceptedAiGeneratedValue) {
				openAiGenerateModal();
				return;
			}
			let updatedData = [...(info?.data || [])];
			let variableElementToBeUpdated = updatedData?.[index];
			variableElementToBeUpdated = { ...variableElementToBeUpdated, value: e.target.value };
			updateDuplicatedVaribales({ ...variableElementToBeUpdated });
			updatedData?.splice(index, 1, variableElementToBeUpdated);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			variableOnChangeFunc(variableElementToBeUpdated);
			return;
		},
		[info?.data, variableOnChangeFunc, gotUnacceptedAiGeneratedValue],
	);
	const updateDuplicatedVaribales = useCallback(
		async (data) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				if (info?.variableMapper) {
					const { _id } = data;
					const updatedMapper = { ...(info.variableMapper || {}) };

					if (updatedMapper?.[_id] && updatedMapper?.[_id]?.length > 1) {
						let duplicatedArray = [...updatedMapper?.[_id]];
						for (let i = 0; i < duplicatedArray?.length; i++) {
							if (i === 0) {
								duplicatedArray[i] = { ...data };
							} else {
								let updatedObj = { ...duplicatedArray?.[i], value: data?.value };
								duplicatedArray[i] = updatedObj;
							}
						}
						const arrayTobeChangedViaApiCall = duplicatedArray?.slice(1);
						handleUpdateVaraiblesArray(arrayTobeChangedViaApiCall);
						updatedMapper[_id] = duplicatedArray;
						setInfo((prev) => ({ ...prev, variableMapper: updatedMapper }));
					}
				}
			}, 1000);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.variableMapper, info?.timeout],
	);

	const onLocalVariableFocus = useCallback(
		async (e, index) => {
			let updatedData = [...(info?.data || [])];
			let variableElementToBeUpdated = updatedData?.[index];
			variableOnFocusFunc(variableElementToBeUpdated._id);
			return;
		},
		[info?.data],
	);

	const onChangeLocalWorkflowExpiry = useCallback(
		async (e) => {
			if (gotUnacceptedAiGeneratedValue) {
				openAiGenerateModal();
				return;
			}
			const value = e.target.value.replace(/[^0-9]/g, '');
			if (+value === +info?.workflowexpiryInDays) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				workflowexpiryInDays: +value,
				workflowexpiryInDaysChanged: true,
			}));
		},
		[info?.workflowexpiryInDays, gotUnacceptedAiGeneratedValue],
	);

	const handleDebouceFunctionCall = useCallback(
		(data) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				updateSmartFileExpiry(data);
				setInfo((prev) => ({
					...prev,
					timeout: null,
				}));
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout, updateSmartFileExpiry],
	);

	return (
		<div className="variablesParentContainer">
			<div className="variableListHolder">
				{info?.data?.map((ele, index) => (
					<div className="inputWithLabelContainer" key={index}>
						<span className="labelName">{ele?.code}</span>
						<input
							className={`custominputContainer ${editable ? 'edit' : ''}`}
							value={ele?.value || ''}
							onChange={(e) => onLocalVariableDataChange(e, index)}
							readOnly={!editable}
							onFocus={(e) => onLocalVariableFocus(e, index)}
							id={ele?._id}
						/>
					</div>
				))}
				<div className="proposalContainer">
					<div className="inputWithLabelContainer">
						<span className="labelName">Workflow Validity</span>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								alignSelf: 'stretch',
								gap: '12px',

								borderRadius: '10px',
								paddingRight: '14px',
							}}
							className={`customproposalInputContainer ${editable ? 'edit' : ''}`}
						>
							<input
								className="proposalInputCustomContainer"
								type="text"
								value={info?.workflowexpiryInDays}
								onChange={onChangeLocalWorkflowExpiry}
								readOnly={!editable}
								style={{ flex: 1 }}
							/>
							<span>Days</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Variables);
