import React from 'react';
import '../../../assets/scss/sales/workflowTemplates.scss';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as Circle } from '../../../assets/svg/circle-outline.svg';
import SampleWorkflowImage from '../../../assets/images/workflow-sample-image.png';

function WorkflowTemplates({ workflows }) {
	return (
		<div className="workflowTemplatesContainer">
			<div className="workflowListContainer">
				<div className="listContainer">
					<div className="header">
						<p>Choose a Workflow</p>
					</div>

					{workflows.map((workflow, index) => {
						return (
							<div className="workflowCard">
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
									style={{ backgroundImage: `url(${workflow.displayImageURL})` }}
								></div>
							</div>
						);
					})}
					<div className="workflowCard">
						<div className="textContainer">
							<p className="heading">Wedding Photography Proposal</p>
							<div className="subtext">
								<VE />
								<p>| Saved 10158 times</p>
							</div>
							<p className="description">
								Send this custom proposal to your potential client post-consult with
								their recommended package and optional add-ons.
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
							style={{ backgroundImage: `url(${SampleWorkflowImage})` }}
						></div>
					</div>
				</div>
			</div>
			<div className="categoryContainer">
				<p className="active">Wedding</p>
				<p>Events</p>
				<p>Parties</p>
			</div>
		</div>
	);
}

export default WorkflowTemplates;
