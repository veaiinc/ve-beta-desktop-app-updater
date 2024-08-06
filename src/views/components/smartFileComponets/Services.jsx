import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import ToggleSlider from '../../components/input/slider';
const Services = ({ serviceData, serviceOnChangeFunc }) => {
	const [info, setInfo] = useState({
		data: [],
	});

	useEffect(() => {
		if (serviceData) {
			setInfo((prev) => ({ ...prev, data: [].concat(...Object.values(serviceData)) }));
		}
	}, [serviceData]);

	const onLocalServiceDataChange = useCallback(
		async (innerIndex, outerIndex, type, val) => {
			let updatedData = [...(info?.data || [])];
			let selectedServiceTable = updatedData?.[outerIndex];
			let valueTobeChanged = selectedServiceTable?.values?.[innerIndex];

			if (type === 'show') {
				valueTobeChanged = { ...valueTobeChanged, show: val };
			}
			if (type === 'increment') {
				let updatedQuantity = valueTobeChanged?.quantity + 1;
				valueTobeChanged = {
					...valueTobeChanged,
					quantity: updatedQuantity,
				};
			}
			if (type === 'decrement') {
				let updatedQuantity = valueTobeChanged?.quantity - 1;
				valueTobeChanged = {
					...valueTobeChanged,
					quantity: updatedQuantity >= 0 ? updatedQuantity : 0,
				};
			}
			selectedServiceTable?.values?.splice(innerIndex, 1, valueTobeChanged);
			updatedData?.splice(outerIndex, 1, selectedServiceTable);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			serviceOnChangeFunc(selectedServiceTable);
		},
		[info?.data],
	);

	return info?.data?.length ? (
		<div className="servicesParentContainer">
			<span className="servicesHeader">Services - View Only</span>

			{info?.data?.map((ele, index) => (
				<div className="serviceCardWrapper" key={index}>
					{/* //USE ,MAP HERE */}
					{ele?.values?.map((val, ind) => (
						<div className="serviceCard" key={ind}>
							<div className="serviceTitleContainer">
								<ToggleSlider
									value={val?.show}
									onChange={(val) =>
										onLocalServiceDataChange(ind, index, 'show', val)
									}
								/>
								<span className="serviceCardTitle">{val?.title || ''}</span>
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
										value={val?.quantity}
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
