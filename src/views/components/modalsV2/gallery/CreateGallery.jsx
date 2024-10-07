import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as UpArrow } from '../../../../assets/svg/workflow/downArrow.svg';
import '../../../../assets/scss/gallery/modals/createGallery.scss';
const CreateGallery = ({ open, closeModal }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="createModalMainContainer">
				<div className="headingContainer">
					<p className="heading">Create New Gallery</p>
					<p className="closeIcon heading" onClick={closeModal}>
						X
					</p>
				</div>
				<div className="inputContainer">
					<div className="gallery-name">
						<p className="subHeading">Gallery Name</p>
						<input placeholder="e.g. Swarthika & Gandhi" />
					</div>
					<div className="gallery-date">
						<p className="subHeading">Gallery date</p>
						<input placeholder="pick a date" type="date" />
					</div>
					<div className="choose-workflow">
						<p className="subHeading">Choose a workflow</p>
						<div className="selectWorkflow">
							<input placeholder="Select Workflow" />
							<UpArrow />
						</div>
					</div>
				</div>
				<div className="create-gallery-button">
					<p>Create Gallery</p>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateGallery);
