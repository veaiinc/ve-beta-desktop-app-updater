import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import ToggleSlider from '../../components/input/slider';
import { Tooltip } from 'antd';
import ToolTipContainer from '../popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/workflow/questionMark.svg';

const serviceStyleMapper = {
	0: 'Select One',
	1: 'Select Multiply',
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
				let { style } = selectedServiceTable || {};
				style = { ...style, subTotalValue: val };
				selectedServiceTable.style = style;
				updatedData?.splice(outerIndex, 1, selectedServiceTable);
				setInfo((prev) => ({ ...prev, data: updatedData }));
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
							Services - {serviceStyleMapper?.[ele?.style?.services_selection || '2']}
						</span>
						<span className="svgHolder">
							<Tooltip
								placement="bottomLeft"
								title={
									<ToolTipContainer
										title={`Services - ${
											serviceStyleMapper?.[
												ele?.style?.services_selection || '2'
											]
										}`}
										content={
											sericesContentMapper?.[
												ele?.style?.services_selection || '2'
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
								{editable ? (
									<input
										value={
											ele?.style?.subTotalValue
												?.toString()
												?.replace(/&nbsp;/g, ' ')
												?.replace(/<\/?[^>]+(>|$)/g, '')
												?.replace(/"/g, '') || ''
										}
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
									/>
								) : (
									<span className="ServiceSubTotalValue">
										{ele?.style?.subTotalValue
											?.toString()
											?.replace(/&nbsp;/g, ' ')
											?.replace(/<\/?[^>]+(>|$)/g, '')
											?.replace(/"/g, '') || ''}
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
