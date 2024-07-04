import React, { memo } from 'react';
import '../../../assets/scss/modules/proposal/servicesBlock.scss';
import ToggleSlider from '../input/slider';
const ServicesBlock = () => {
	return (
		<div className="servicesBlockContainer">
			<span className="serviceBlockHeader">Select Services</span>
			<div className="serviceCard">
				<ToggleSlider />
				<div className="seriveContentContainer">
					{/* titile */}
					<div className="inputHolder">
						<span className="serviceTitle">Service Title</span>
						<input className="propsalinputContainer" />
					</div>
					{/* description */}
					<div className="inputHolder">
						<span className="serviceTitle">Description (Optional)</span>
						<textarea className="propsalinputContainer" />
					</div>
					{/* //unitPrice and guests */}
					<div className="multipleInputContainer">
						<div className="inputHolder">
							<span className="serviceTitle">Unit Price</span>
							<div className="inputWrapper">
								<span className="currencyHolder">$</span>
								<input
									type="number"
									className="propsalinputContainer"
									style={{ border: 'none' }}
								/>
							</div>
						</div>
						<div className="inputHolder">
							<span className="serviceTitle">Number of Guests</span>
							<div className="inputWrapper">
								<input
									type="number"
									className="propsalinputContainer"
									style={{ border: 'none' }}
								/>
								<div className="incrementDecrementBtnHolder">
									<span className="decrementBtn">-</span>
									<span className="incrementBtn">+</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ServicesBlock);
