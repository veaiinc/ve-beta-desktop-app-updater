import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import ToggleSlider from '../../components/input/slider';
import { Tooltip } from 'antd';
import ToolTipContainer from '../popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/workflow/questionMark.svg';

const serviceStyleMapper = {
	0: 'Select One',
	1: 'Select Multiple',
	2: 'View Only',
};

const sericesContentMapper = {
	0: 'This Table shows Select one services that are mentioned in the smart file, Lead can select any one service from the list of services.',
	1: 'This Table shows Select mutiple services that are mentioned in the smart file, Lead can select multiple services from the list of services.',
	2: 'This Table shows view only services that are mentioned in the smart file, Lead will only view this service details',
};

const Services = ({ serviceData, serviceOnChangeFunc, editable }) => {
	const [info, setInfo] = useState({
		data: [],
		subTotalValueMapper: {},
	});

	const [arrow, setArrow] = useState('Show');
	const mergedArrow = useMemo(() => {
		if (arrow === 'Hide') {
			return false;
		}
		if (arrow === 'Show') {
			return true;
		}
		return {
			pointAtCenter: true,
		};
	}, [arrow]);

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
				let editable = serviceData?.[i]?.style?.services_selection === 2 ? true : false;

				subTotalValue = editable ? serviceData?.[i]?.style?.subTotalValue : subTotalValue;
				subTotalValue =
					+(
						(subTotalValue + '')
							?.replace(/&nbsp;/g, ' ')
							.replace(/<\/?[^>]+(>|$)/g, '')
							.replace(/"/g, '') || ''
					) || 0;
				let obj = {
					subTotalValue,
					editable,
					itsHtmlTags: serviceData?.[i]?.style?.subTotalValue + '',
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
		async (innerIndex, outerIndex, type, val) => {
			if (!editable) {
				return;
			}

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
				let incomingValue =
					subtotalValueWithTags
						?.replace(/&nbsp;/g, ' ')
						.replace(/<\/?[^>]+(>|$)/g, '')
						.replace(/"/g, '') || '';
				subtotalValueWithTags = subtotalValueWithTags?.replace(incomingValue, value);

				selectedServiceTable = {
					...selectedServiceTable,
					style: { ...selectedServiceTable.style, subTotalValue: subtotalValueWithTags },
				};

				serviceOnChangeFunc(selectedServiceTable, outerIndex);
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
				let updatedQuantity = selectedBlocks?.subBlocks?.[0]?.quantity + 1;
				selectedBlocks = {
					...selectedBlocks,
					subBlocks: [{ ...selectedBlocks?.subBlocks?.[0], quantity: updatedQuantity }],
				};
			}
			if (type === 'decrement') {
				let updatedQuantity = selectedBlocks?.subBlocks?.[0]?.quantity - 1;

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
				let updatedQuantity = val;

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
		[info?.data, editable],
	);

	return info?.data?.length ? (
		<div className="servicesParentContainer">
			{info?.data?.map((ele, index) => (
				<>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<span className="servicesHeader">
							Services -{' '}
							{
								serviceStyleMapper?.[
									ele?.style?.services_selection !== undefined
										? ele?.style?.services_selection
										: '2'
								]
							}
						</span>
						<span className="svgHolder">
							<Tooltip
								placement="bottomLeft"
								title={
									<ToolTipContainer
										title={`Services - ${
											serviceStyleMapper?.[
												ele?.style?.services_selection !== undefined
													? ele?.style?.services_selection
													: '2'
											]
										}`}
										content={
											sericesContentMapper?.[
												ele?.style?.services_selection !== undefined
													? ele?.style?.services_selection
													: '2'
											]
											// 'This Table shows view only services that are mentioned in the smart file, Lead will only view this service details'
										}
									/>
								}
								arrow={mergedArrow}
								color={'#202020'}
							>
								<QuestionMark />
							</Tooltip>
						</span>
					</div>
					<div className="serviceCardWrapper" key={index}>
						<div className="serviceCardHeaderBlock">
							<span className="serviceSubTitle">
								{ele?.style?.subTotalTitle
									?.replace(/&nbsp;/g, ' ')
									.replace(/<\/?[^>]+(>|$)/g, '')
									.replace(/"/g, '') || ''}
							</span>
							<div className="serviceSubTotalWrapper">
								<span className="subTotalValueTitle">Subtotal</span>
								{editable && info?.subTotalValueMapper?.[index]?.editable ? (
									<input
										value={info?.subTotalValueMapper?.[index]?.subTotalValue}
										onChange={(e) =>
											onLocalServiceDataChange(
												0,
												index,
												'subTotalValue',
												e.target.value,
											)
										}
										className="serviceSubtotalValueInput"
										readOnly={!editable}
										type="text"
									/>
								) : (
									<span className="ServiceSubTotalValue">
										{info?.subTotalValueMapper?.[index]?.subTotalValue}
									</span>
								)}
							</div>
						</div>

						{/* //USE ,MAP HERE */}
						{ele?.blocks?.map((val, ind) => (
							<div className="serviceCard" key={ind}>
								<div className="serviceTitleContainer">
									<ToggleSlider
										value={val?.subBlocks?.[0]?.show}
										onChange={(val) =>
											onLocalServiceDataChange(ind, index, 'show', val)
										}
										editable={editable}
									/>
									<span className="serviceCardTitle">
										{val?.subBlocks?.[0]?.title
											?.replace(/&nbsp;/g, ' ')
											.replace(/<\/?[^>]+(>|$)/g, '')
											.replace(/"/g, '') || ''}
									</span>
								</div>
								<div className="serviceQuantityContainer">
									<span className="quantityTitle">Quantity</span>
									<div className="incrementDecrementContainer">
										<span
											className="incrementorBtns"
											onClick={() =>
												onLocalServiceDataChange(ind, index, 'decrement')
											}
										>
											-
										</span>
										<input
											type="number"
											className="incrementDecrementinput"
											value={val?.subBlocks?.[0]?.quantity}
											onChange={(e) =>
												onLocalServiceDataChange(
													ind,
													index,
													'quantityInputChange',
													e.target.value,
												)
											}
											readOnly={!editable}
										/>
										<span
											className="incrementorBtns"
											onClick={() =>
												onLocalServiceDataChange(ind, index, 'increment')
											}
										>
											+
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			))}
		</div>
	) : (
		''
	);
};

export default memo(Services);
