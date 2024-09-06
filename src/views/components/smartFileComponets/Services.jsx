import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import ToggleSlider from '../../components/input/slider';
const Services = ({ serviceData, serviceOnChangeFunc, editable }) => {
	const [info, setInfo] = useState({
		data: [],
	});

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
			<span className="servicesHeader">Services - View Only</span>

			{info?.data?.map((ele, index) => (
				<div className="serviceCardWrapper" key={index}>
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
			))}
		</div>
	) : (
		''
	);
};

export default memo(Services);
