import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/smart-file-components/variables.scss';
import '../../../assets/scss/smart-file-components/eventsPresetsParentContainer.scss';
import Context from '../../../context/context';
import { ReactComponent as DocumentToForm } from '../../../assets/svg/document/documentToForm.svg';
import { message } from 'antd';

const clientVariableMapper = {
	'client-name': 'name',
	'client-phone-number': 'phoneNumber',
	'client-email-id': 'email',
};
const Variables = ({
	data,
	clientDetails,
	variableBlockChanges,
	updateLocalStateData,
	scrollAndHighlightElement,
	handleReplaceMultipleInput,
	previewReady,
	onVariableUpdate,
	formResponses = [],
}) => {
	const {
		templates: { updateClientVariablesData, updateCustomVariabledata },
	} = useContext(Context);

	const [info, setInfo] = useState({
		variablesData: [],
		loading: true,
	});
	const [popoverIndex, setPopoverIndex] = useState(null);
	const popoverRef = useRef(null);
	// Track which variables are currently being updated to prevent flicker
	const [updatingVariables, setUpdatingVariables] = useState(new Set());

	useEffect(() => {
		if (info?.variablesData?.length && previewReady) {
			setTimeout(() => {
				handleReplaceMultipleInput(info?.variablesData || []);
			}, 1000);
		}
	}, [previewReady, info]);

	useEffect(() => {
		if (data && clientDetails) {
			let variabledata = [...(data || [])];
			let variableMapper = {};

			for (let i = 0; i < variabledata?.length; i++) {
				let ele = variabledata?.[i];
				if (ele?.type !== 'workspace' && !ele?.blockId) {
					const key = variabledata[i]?.code;
					if (clientVariableMapper[key]) {
						ele.value = clientDetails[clientVariableMapper[key]] || '';
						ele.defaultValue = clientDetails[clientVariableMapper[key]] || '';
					} else {
						// Ensure all variables have defined values
						ele.value = ele.value || ele.defaultValue || '';
						ele.defaultValue = ele.defaultValue || '';
					}
					variableMapper[ele?._id] = ele;
				}
			}

			setInfo((prev) => {
				const prevVars = prev.variablesData || [];
				const mergedVars = Object.values(variableMapper).map((newVar) => {
					const prevVar = prevVars.find((v) => v._id === newVar._id);

					// Don't overwrite if variable is currently being updated (prevents flicker)
					if (updatingVariables.has(newVar._id)) {
						return prevVar || newVar;
					}

					// Preserve user's current defaultValue if it exists and is different from backend
					if (
						prevVar &&
						prevVar.defaultValue !== undefined &&
						prevVar.defaultValue !== newVar.defaultValue
					) {
						return {
							...newVar,
							value: prevVar.defaultValue,
							defaultValue: prevVar.defaultValue,
						};
					}
					return newVar;
				});
				return {
					...prev,
					variablesData: mergedVars,
					loading: false,
				};
			});
		}
	}, [data, clientDetails, updatingVariables]);

	const onChangeVariablesData = useCallback(
		(e, index, valueOverride = null) => {
			const newData = [...info?.variablesData];
			const oldData = { ...(newData[index] || {}) };
			const value = (valueOverride !== null ? valueOverride : e?.target?.value) || '';

			// Update the data array with new value
			newData[index] = { ...newData[index], value, defaultValue: value };

			// Mark this variable as being updated to prevent flicker during API calls
			setUpdatingVariables((prev) => new Set(prev).add(oldData?._id));

			// Update state immediately for responsive UI
			setInfo((prev) => ({ ...prev, variablesData: newData }));

			// Call other functions
			variableBlockChanges(oldData?._id, value);
			scrollAndHighlightElement(oldData?._id);
			setPopoverIndex(null); // close popover on select

			// Debounce the API call
			handleDeboucne({ ...newData[index], value });
		},
		[info, variableBlockChanges, scrollAndHighlightElement],
	);

	const updateVariablesData = useCallback(
		async (updatedVariablesData) => {
			const key = updatedVariablesData?.code;
			const clientVariables = clientVariableMapper[key] ? true : false;

			// Mark this variable as updating to prevent flicker
			setUpdatingVariables((prev) => new Set(prev).add(updatedVariablesData._id));

			try {
				if (clientVariables) {
					const requiredKey = clientVariableMapper?.[key];
					const payload = {
						updateClientId: clientDetails?._id,
						updateClientInput: {
							[requiredKey]: updatedVariablesData?.value || '',
						},
					};
					const response = await updateClientVariablesData(payload);
					if (response?.[0]) {
						// Don't update state again - it's already updated optimistically
						updateLocalStateData({
							clientDetails: { ...(response?.[1] || {}) },
						});
						if (onVariableUpdate) {
							// Delay the data refresh to prevent flicker
							setTimeout(() => {
								onVariableUpdate();
							}, 100);
						}
					} else {
						// Revert on error
						setInfo((prev) => ({
							...prev,
							variablesData: prev.variablesData.map((v) =>
								v._id === updatedVariablesData._id
									? {
											...v,
											value: updatedVariablesData.defaultValue,
											defaultValue: updatedVariablesData.defaultValue,
									  }
									: v,
							),
						}));
					}
				} else {
					const variableId = updatedVariablesData?._id;
					const payload = {
						defaultValue: updatedVariablesData?.value || '',
					};
					const response = await updateCustomVariabledata(payload, variableId);
					if (!response?.[0]) {
						message.error('Something went wrong, while updating variable');
						// Revert on error
						setInfo((prev) => ({
							...prev,
							variablesData: prev.variablesData.map((v) =>
								v._id === updatedVariablesData._id
									? {
											...v,
											value: updatedVariablesData.defaultValue,
											defaultValue: updatedVariablesData.defaultValue,
									  }
									: v,
							),
						}));
					} else {
						// Don't update state again - it's already updated optimistically
						if (onVariableUpdate) {
							// Delay the data refresh to prevent flicker
							setTimeout(() => {
								onVariableUpdate();
							}, 100);
						}
					}
				}
			} finally {
				// Remove from updating set after a delay to prevent flicker from data refresh
				setTimeout(() => {
					setUpdatingVariables((prev) => {
						const newSet = new Set(prev);
						newSet.delete(updatedVariablesData._id);
						return newSet;
					});
				}, 200);
			}
		},
		[
			clientDetails,
			updateClientVariablesData,
			updateCustomVariabledata,
			updateLocalStateData,
			onVariableUpdate,
		],
	);

	const handleDeboucne = useCallback(
		(updatedVariablesData) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				updateVariablesData(updatedVariablesData);
			}, 1000);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info, updateVariablesData],
	);

	// Filter suggestions: all except type 'events', 'fileupload', 'image', 'files'
	const SUGGESTED_TYPES_TO_EXCLUDE = ['events', 'fileupload', 'image', 'files'];
	const variableSuggestions = formResponses.filter(
		(resp) => !SUGGESTED_TYPES_TO_EXCLUDE.includes(resp.type),
	);

	// Handle outside click to close popover
	useEffect(() => {
		function handleClickOutside(event) {
			if (popoverRef.current && !popoverRef.current.contains(event.target)) {
				setPopoverIndex(null);
			}
		}
		if (popoverIndex !== null) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [popoverIndex]);

	return (
		<div className="variablesParentContainer">
			{info?.variablesData.map((ele, index) => (
				<div
					className="inputWithLabelContainer"
					key={index}
					style={{ position: 'relative' }}
				>
					<span className="labelName">
						{ele?.displayName?.length ? ele?.displayName : ele?.code || ''}
					</span>
					<div className="variableInputWithPopoverWrapper">
						<input
							className={`custominputContainer`}
							placeholder={ele?.displayName}
							value={ele?.defaultValue || ''}
							onChange={(e) => onChangeVariablesData(e, index)}
							id={'sidebar-' + ele?._id}
						/>
						{formResponses.length > 0 && (
							<span
								className="variableSuggestionIcon"
								onClick={() => setPopoverIndex(index)}
							>
								<DocumentToForm />
							</span>
						)}
						{popoverIndex === index && (
							<div
								className="eventsPresetsParentContainer variableSuggestionsPopover"
								ref={popoverRef}
							>
								<div className="definedPresetContainer">
									{variableSuggestions.length === 0 ? (
										<div className="noSuggestionsMsg">No suggestions</div>
									) : (
										variableSuggestions.map((sug, sugIdx) => (
											<div
												key={sug._id || sugIdx}
												className="varPresetCard"
												onClick={() =>
													onChangeVariablesData(
														null,
														index,
														// If answer is array/object, don't pass it directly
														typeof sug.answer === 'string'
															? sug.answer
															: '',
													)
												}
											>
												<span
													className="varPresetTitle"
													style={{ fontSize: '14px' }}
												>
													{(sug.question || '').replace(/<[^>]+>/g, '')}
												</span>
												<span
													className="varPresetSubTitle"
													style={{ fontSize: '14px' }}
												>
													{typeof sug.answer === 'string'
														? sug.answer
														: ''}
												</span>
											</div>
										))
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(Variables);
