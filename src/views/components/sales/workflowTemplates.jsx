import React, { useState, useContext } from 'react';
import '../../../assets/scss/sales/workflowTemplates.scss';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as Circle } from '../../../assets/svg/circle-outline.svg';
import SampleWorkflowImage from '../../../assets/images/workflow-sample-image.png';
import ReactModal from '../modalsV2';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

function WorkflowTemplates({ workflows }) {
	const [modalIsOpen, setIsOpen] = useState(false);
	const [workflow, setWorkFlow] = useState({ id: '', title: '' });
	const [isLoading, setLoading] = useState(false);

	let {
		templates: { duplicateTemplate },
	} = useContext(Context);

	const openModal = (event, workflow) => {
		event.preventDefault();

		setWorkFlow((prevState) => ({
			...prevState,
			id: workflow._id,
			title: workflow.title,
			parsedHtmlContent: workflow.parsedHtmlContent,
		}));
		setIsOpen(true);
	};

	const closeModal = (event) => {
		setIsOpen(false);
		setWorkFlow((prevState) => ({
			id: '',
			title: '',
			parsedHtmlContent: '',
		}));
	};

	const navigate = useNavigate();

	const handleUseTemplate = async () => {
		setLoading(true);

		let payload = {
			title: workflow['title'],
		};

		let response = await duplicateTemplate(workflow['id'], payload);
		if (response[0]) {
			setLoading(false);
			closeModal();
			navigate(`/sales/${response[1]['_id']}`);
		}
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
						<p className="heading">Proposal Template</p>
						<div className="previewDiv">
							<div
								dangerouslySetInnerHTML={{ __html: workflow.parsedHtmlContent }}
								style={{ width: '100%' }}
							/>
						</div>

						<div className="buttonContainer">
							<div className="customizeContainer">
								<a href={`https://builder.ve.co/${workflow.id}`}>
									<p>Customize</p>
								</a>
							</div>
							<div className="customizeContainer" onClick={() => handleUseTemplate()}>
								<p>Use Template</p>
							</div>
						</div>
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
								<div
									className="workflowCard"
									onClick={(e) => openModal(e, workflow)}
								>
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
										dangerouslySetInnerHTML={{
											__html: workflow.parsedHtmlContent,
										}}
									></div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="categoryContainer">
					<p className="active">Sell a Service</p>
					<p>Sell a Session</p>
				</div>
			</div>
			<ReactModal isOpen={modalIsOpen} closeModal={closeModal} modalType="right">
				{previewModal()}
			</ReactModal>
		</>
	);
}

export default WorkflowTemplates;
