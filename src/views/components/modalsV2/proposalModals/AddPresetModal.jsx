import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/smartFile/addPresetModal.scss';
const AddPresetModal = ({ modalIsOpen, closeModal }) => {
	const presetData = [
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
	];
	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModal}>
			<div className="addPresetModalParentContainer">
				<div className="presetHeaderContainer">
					<span className="createNewEventStyling">Create event preset</span>
					<span onClick={closeModal} className="closePresetModalBtn">
						<Close />
					</span>
				</div>
				<div className="createPresetContainer">
					{/* //events Name */}
					<div className="addPresetEventNameContainer">
						<span className="eventNameLabel">Event Name</span>
						<input className="addpresetInput" placeholder="Title" />
					</div>

					{/* //service provided */}
					<div className="addPresetEventNameContainer">
						<span className="eventNameLabel">Services Provided</span>
					</div>
					<div className="presetCardHolder">
						{presetData?.map((ele, index) => (
							<div className="presetServicesCard" key={index}>
								<input className="addpresetInput" placeholder="Title" />
								<div className="presetservicesIncrementor">
									<span
										onClick={closeModal}
										className="closePresetModalBtn incrementorButtons"
									>
										-
									</span>
									<input className="incrementorDecrementorInput" />
									<span
										onClick={closeModal}
										className="closePresetModalBtn incrementorButtons"
									>
										+
									</span>
								</div>
								<span className="closePresetModalBtn">
									<Close />
								</span>
							</div>
						))}
					</div>

					<span className="addRoleBtn">+ Add role</span>
					<div className="createPresetBtn"> Create Preset</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AddPresetModal);
