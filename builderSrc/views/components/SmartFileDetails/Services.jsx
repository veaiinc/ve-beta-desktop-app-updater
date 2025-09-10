import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/smart-file-components/services.scss';
// import ToggleSlider from '../ui-components/slider';
import Context from '../../../context/context';

const serviceStyleMapper = {
	0: 'Select One',
	1: 'Select Multiple',
	2: 'View Only',
};

const sericesContentMapper = {
	0: 'Client can select multiple services from below table.',
	1: 'Client can select only one service from below table.',
	2: 'Client can only view these fixed package services.',
};

const Services = ({ serviceData, serviceOnChangeFunc }) => {
	const [info, setInfo] = useState({
		data: [],
		subTotalValueMapper: {},
	});
	const {
		templates: { updateCustomVariabledata, smartFileVariablesData },
	} = useContext(Context);

	useEffect(() => {
		if (serviceData) {
			setInfo((prev) => ({ ...prev, data: serviceData }));
			for (let i = 0; i < serviceData?.length; i++) {
				const { blocks = [] } = serviceData?.[i] || {};
				let subTotalValue = 0;
				for (let j = 0; j < blocks?.length; j++) {
					let { amount, quantity } = blocks?.[j]?.subBlocks?.[0];

					amount =
						+(
							(amount + '')
								?.replace(/&nbsp;/g, ' ')
								.replace(/<\/?[^>]+(>|$)/g, '')
								.replace(/"/g, '') || ''
						) || 0;
					quantity =
						+(
							(quantity + '')
								?.replace(/&nbsp;/g, ' ')
								.replace(/<\/?[^>]+(>|$)/g, '')
								.replace(/"/g, '') || ''
						) || 0;
					subTotalValue += +(amount * quantity);
				}
				// let editable = serviceData?.[i]?.style?.services_selection === 2 ? true : false;
				let editable =
					serviceData?.[i]?.style?.services_selection != 2 || subTotalValue > 0
						? false
						: true;
				subTotalValue = editable ? serviceData?.[i]?.style?.subTotalValue : subTotalValue;
				subTotalValue =
					+(
						(subTotalValue + '')
							?.replace(/&nbsp;/g, ' ')
							.replace(/<\/?[^>]+(>|$)/g, '')
							.replace(/"/g, '') || ''
					) || 0;

				let ai_generated_subtotal_Flag = false;
				if (serviceData?.[i]?.ai_generated_subtotal && editable) {
					subTotalValue =
						serviceData?.[i]?.ai_generated_subtotal ||
						serviceData?.[i]?.ai_generated_subtotal;
					ai_generated_subtotal_Flag = true;
				}
				let obj = {
					subTotalValue,
					editable,
					itsHtmlTags: serviceData?.[i]?.style?.subTotalValue + '',
					ai_generated_subtotal_Flag,
				};
				setInfo((prev) => ({
					...prev,
					subTotalValueMapper: {
						...prev.subTotalValueMapper,
						[i]: obj,
					},
				}));
			}
		}
	}, [serviceData]);

	const onLocalServiceDataChange = useCallback(
		async (innerIndex, outerIndex, type, val, serviceBlockId = null) => {
			// if (!editable) {
			// 	return;
			// }
			// if (gotUnacceptedAiGeneratedValue) {
			// 	openAiGenerateModal();
			// 	return;
			// }

			let updatedData = [...(info?.data || [])];
			let selectedServiceTable = updatedData?.[outerIndex];

			//for service subtotal value
			if (type === 'subTotalValue') {
				let value = val?.replace(/[^0-9]/g, '');
				let { style } = selectedServiceTable || {};
				style = { ...style, subTotalValue: value };
				selectedServiceTable.style = style;
				updatedData?.splice(outerIndex, 1, selectedServiceTable);
				setInfo((prev) => ({ ...prev, data: updatedData }));

				//fetching subtotal value  with incoming styling and replacing it with new value
				let subtotalValueWithTags =
					info?.subTotalValueMapper?.[outerIndex]?.itsHtmlTags || '';

				if (subtotalValueWithTags?.includes('<')) {
					// Extract inner content while keeping HTML tags intact
					let extractedInnerText =
						subtotalValueWithTags
							?.replace(/<[^>]*>/g, '') // Remove tags, keep content
							.replace(/&nbsp;/g, ' ') // Convert &nbsp; to space
							.replace(/"/g, '') || '';

					// Ensure only inner content is replaced
					// subtotalValueWithTags = subtotalValueWithTags.replace(
					// 	new RegExp(`(?<=>)${extractedInnerText}(?=<)`, 'g'),
					// 	value,
					// );

					subtotalValueWithTags = updateNumericTextInHtml(subtotalValueWithTags, value);
				} else {
					subtotalValueWithTags = value;
				}

				selectedServiceTable = {
					...selectedServiceTable,
					style: { ...selectedServiceTable.style, subTotalValue: subtotalValueWithTags },
				};

				serviceOnChangeFunc(selectedServiceTable, outerIndex);
				let subtotalVarID = smartFileVariablesData?.custom?.find((ele) => {
					return ele?.blockId === serviceBlockId;
				})?._id;
				if (subtotalVarID) {
					updateCustomVariabledata({ defaultValue: val }, subtotalVarID);
				}
				return;
			}
			let { blocks } = selectedServiceTable;
			let selectedBlocks = blocks?.[innerIndex];

			if (type === 'show') {
				selectedBlocks = {
					...selectedBlocks,
					subBlocks: [{ ...selectedBlocks?.subBlocks?.[0], show: val }],
				};
			}
			if (type === 'increment') {
				// Ensure quantity is a number and has a default value of 0
				const currentQuantity = +(selectedBlocks?.subBlocks?.[0]?.quantity || 0);
				const updatedQuantity = currentQuantity + 1;
				selectedBlocks = {
					...selectedBlocks,
					subBlocks: [{ ...selectedBlocks?.subBlocks?.[0], quantity: updatedQuantity }],
				};
			}
			if (type === 'decrement') {
				// Ensure quantity is a number and has a default value of 0
				const currentQuantity = +(selectedBlocks?.subBlocks?.[0]?.quantity || 0);
				const updatedQuantity = currentQuantity - 1;

				selectedBlocks = {
					...selectedBlocks,
					subBlocks: [
						{
							...selectedBlocks?.subBlocks?.[0],
							quantity: updatedQuantity >= 0 ? updatedQuantity : 0,
						},
					],
				};
			}
			if (type === 'quantityInputChange') {
				// Parse input value as integer with fallback to 0
				const updatedQuantity = parseInt(val, 10) || 0;

				selectedBlocks = {
					...selectedBlocks,
					subBlocks: [
						{
							...selectedBlocks?.subBlocks?.[0],
							quantity: updatedQuantity >= 0 ? updatedQuantity : 0,
						},
					],
				};
			}
			blocks?.splice(innerIndex, 1, selectedBlocks);
			selectedServiceTable = { ...selectedServiceTable, blocks };
			updatedData?.splice(outerIndex, 1, selectedServiceTable);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			serviceOnChangeFunc(selectedServiceTable, outerIndex);
		},
		[
			info?.data,
			// editable,
			serviceOnChangeFunc,
			// gotUnacceptedAiGeneratedValue,
		],
	);

	return info?.data?.length && info.data.some((ele) => ele?.blocks?.length > 0) ? (
		<div className="servicesSuperParentContainer">
			{info?.data?.map((ele, index) => (
				<div className="serviceParentContainer" key={index} id={`sidebar-${ele?._id}`}>
					<span className="servicesLabel">
						Services -{' '}
						{
							sericesContentMapper?.[
								ele?.style?.services_selection !== undefined
									? ele?.style?.services_selection
									: '2'
							]
						}
					</span>
					<div className="servicesContentContainer">
						<div className="serviceTitleContainer">
							<span className="serviceTitleText">
								{ele?.style?.subTotalTitle
									?.replace(/&nbsp;/g, ' ')
									.replace(/<\/?[^>]+(>|$)/g, '')
									.replace(/"/g, '') || 'Services Subtotal'}
							</span>
							<span className="serviceSubTotalContainer">
								<span className="serviceSubtotalText">Selected Subtotal :</span>

								{info?.subTotalValueMapper?.[index]?.editable ? (
									<input
										value={info?.subTotalValueMapper?.[index]?.subTotalValue}
										onChange={(e) =>
											onLocalServiceDataChange(
												0,
												index,
												'subTotalValue',
												e.target.value,
												ele?._id,
											)
										}
										className={'serviceSubtotalValueInput'}
										type="text"
									/>
								) : (
									<span className="serviceSubtotalAmount">
										{info?.subTotalValueMapper?.[index]?.subTotalValue}
									</span>
								)}
							</span>
						</div>
						<div className="serviceSubBlockContainer">
							{ele?.blocks?.map((val, ind) => (
								<div className="serviceRow" key={ind}>
									<div className="custom-checkbox">
										<input
											type="checkbox"
											id={`service-checkbox-${ind}-${index}`}
											checked={val?.subBlocks?.[0]?.show}
											onChange={(e) =>
												onLocalServiceDataChange(
													ind,
													index,
													'show',
													e.target.checked,
												)
											}
										/>
										<label
											htmlFor={`service-checkbox-${ind}-${index}`}
											className="checkbox-label"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="10"
												viewBox="0 0 12 10"
												fill="none"
											>
												<path
													d="M0.959839 5.86677L4.15976 8.7467L11.0396 1.54688"
													stroke="#E8E8E8"
													style={{
														stroke: 'color(display-p3 0.9097 0.9096 0.9096)',
														strokeOpacity: 1,
													}}
													strokeWidth="1.19997"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</label>
									</div>
									<div
										className={`serviceBlockContent ${
											!val?.subBlocks?.[0]?.show ? 'unchecked' : ''
										}`}
									>
										<span className="serviceBlockTitle">
											{val?.subBlocks?.[0]?.title
												?.replace(/&nbsp;/g, ' ')
												.replace(/<\/?[^>]+(>|$)/g, '')
												.replace(/"/g, '') || `Service ${ind + 1}`}
										</span>
										<div className="serviceBlockQunatityContainer">
											<div className="quantityActionsContainer">
												<div
													className="quantityActionButton"
													onClick={() =>
														onLocalServiceDataChange(
															ind,
															index,
															'decrement',
														)
													}
												>
													-
												</div>
												<input
													type="number"
													className="quantityInput"
													value={val?.subBlocks?.[0]?.quantity}
													onChange={(e) =>
														onLocalServiceDataChange(
															ind,
															index,
															'quantityInputChange',
															e.target.value,
														)
													}
													// readOnly={!editable}
												/>
												<div
													className="quantityActionButton"
													onClick={() =>
														onLocalServiceDataChange(
															ind,
															index,
															'increment',
														)
													}
												>
													+
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	) : null;
};

export default memo(Services);

const updateNumericTextInHtml = (html, newValue) => {
	// Create a temporary container element
	const container = document.createElement('div');
	container.innerHTML = html;

	// Use a TreeWalker to iterate over text nodes
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);

	let updated = false;
	while (walker.nextNode()) {
		const node = walker.currentNode;
		if (/^\s*\d+\s*$/.test(node.nodeValue)) {
			if (!updated) {
				node.nodeValue = newValue; // Update the first matching node
				updated = true;
			} else {
				node.nodeValue = ''; // Clear subsequent numeric nodes
			}
		}
	}

	// If no numeric text node was found, insert the new value into the first <span>
	if (!updated) {
		const firstSpan = container.querySelector('span');
		if (firstSpan) {
			firstSpan.textContent = newValue;
		} else {
			// If no span exists, append a new text node to the container
			container.appendChild(document.createTextNode(newValue));
		}
	}

	return container.innerHTML;
};
