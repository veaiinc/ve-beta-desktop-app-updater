import React, { useState } from 'react';
import '../../../assets/scss/sales/workflowTemplates.scss';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as Circle } from '../../../assets/svg/circle-outline.svg';
import SampleWorkflowImage from '../../../assets/images/workflow-sample-image.png';
import ReactModal from '../modalsV2';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';

function WorkflowTemplates({ workflows }) {
	const [modalIsOpen, setIsOpen] = useState(false);

	const openModal = (event) => {
		event.preventDefault();
		setIsOpen(true);
	};

	const closeModal = (event) => {
		setIsOpen(false);
	};

	const previewModal = () => {
		return (
			<div className="previewContainerModal">
				<div className="container">
					<div className="header">
						<p>Design</p>
						<div className="closeContainer" onClick={() => closeModal()}>
							<Close />
						</div>
					</div>

					<div className="colourContainer">
						<p>Theme</p>
						<div className="colorsPreview">
							<div className="colorsOptions">
								<div style={{ backgroundColor: '#628B48' }}></div>
								<div style={{ backgroundColor: '#D8829D' }}></div>
								<div style={{ backgroundColor: '#EDD83D' }}></div>
								<div style={{ backgroundColor: '#F3F9E3' }}></div>
							</div>
							<div className="colorsOptions">
								<div style={{ backgroundColor: '#628B48' }}></div>
								<div style={{ backgroundColor: '#D8829D' }}></div>
								<div style={{ backgroundColor: '#EDD83D' }}></div>
								<div style={{ backgroundColor: '#F3F9E3' }}></div>
							</div>
							<div className="colorsOptions">
								<div style={{ backgroundColor: '#628B48' }}></div>
								<div style={{ backgroundColor: '#D8829D' }}></div>
								<div style={{ backgroundColor: '#EDD83D' }}></div>
								<div style={{ backgroundColor: '#F3F9E3' }}></div>
							</div>
						</div>
					</div>

					<div className="previewContainer">
						<p>Proposal Template</p>
						<div className="previewDiv"></div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="workflowTemplatesContainer">
				<div className="workflowListContainer">
					<div className="listContainer">
						<div className="header">
							<p>Choose a Workflow</p>
						</div>

						{workflows.map((workflow, index) => {
							return (
								<div className="workflowCard" onClick={openModal}>
									<div className="textContainer">
										<p className="heading">{workflow.title}</p>
										<div className="subtext">
											<VE />
											<p>| Saved 10158 times</p>
										</div>
										<p className="description">
											Send this custom proposal to your potential client
											post-consult with their recommended package and optional
											add-ons.
										</p>
										<p className="modulesInWorkflowHeader">Actions</p>
										<div className="modulesInWorkflow">
											<div>
												<Circle /> <p>Proposals</p>
											</div>
											<div className="connector"></div>
											<div>
												<Circle /> <p>Thankyou</p>
											</div>
										</div>

										<div className="tagContainer">
											<p className="heading">Tags</p>
											<div className="tags">
												<p>Photography</p>
												<p>Wedding</p>
												<p>Add-Ons</p>
												<p>Proposal</p>
												<p>Event</p>
												<p>Romantic</p>
											</div>
										</div>
									</div>
									<div
										className="imageContainer"
										style={{
											backgroundImage: `url(${workflow.displayImageURL})`,
										}}
									></div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="categoryContainer">
					<p className="active">Wedding</p>
					<p>Events</p>
					<p>Parties</p>
				</div>
			</div>
			<ReactModal isOpen={modalIsOpen} closeModal={closeModal} modalType="right">
				{previewModal()}
			</ReactModal>
		</>
	);
}

export default WorkflowTemplates;
