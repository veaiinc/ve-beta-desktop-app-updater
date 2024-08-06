import React, { memo } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import ToggleSlider from '../../components/input/slider';
const Services = () => {
	return (
		<div className="servicesParentContainer">
			<span className="servicesHeader">Services - View Only</span>

			<div className="serviceCardWrapper">
				{/* //USE ,MAP HERE */}
				<div className="serviceCard">
					<div className="serviceTitleContainer">
						<ToggleSlider />
						<span className="serviceCardTitle">Edited Photos</span>
					</div>
					<div className="serviceQuantityContainer">
						<span className="quantityTitle">Quantity</span>
						<div className="incrementDecrementContainer">
							<span className="incrementorBtns">-</span>
							<input type="number" className="incrementDecrementinput" />
							<span className="incrementorBtns">+</span>
						</div>
					</div>
				</div>
				<div className="serviceCard">
					<div className="serviceTitleContainer">
						<ToggleSlider />
						<span className="serviceCardTitle">Edited Photos</span>
					</div>
					<div className="serviceQuantityContainer">
						<span className="quantityTitle">Quantity</span>
						<div className="incrementDecrementContainer">
							<span className="incrementorBtns">-</span>
							<input type="number" className="incrementDecrementinput" />
							<span className="incrementorBtns">+</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Services);
