import React, { memo, useState } from 'react';
import { ReactComponent as LinkWhite } from '../../../../assets/svg/Settings/link-white-color.svg';
import AddKnowledgeModal from '../../../components/modalsV2/settings/ai_setup/AddKnowledgeModal';
// import { ReactComponent as HollowCircleBlue } from '../../../../assets/svg/Settings/hollow-circle-blue.svg';
// import Template from './tempImg.png';

const columnNames = ['Source', 'Status'];

const KnowledgeBase = () => {
	const [info, setInfo] = useState({
		isAddKnowledgeModalOpen: false,
	});

	const toggleModal = () => {
		setInfo({ ...info, isAddKnowledgeModalOpen: !info.isAddKnowledgeModalOpen });
	};

	return (
		<div className="ai-knowledge-base-container">
			{/* <div className="assigning-ai">
				<div className="ai-header">
					<h1>Ve.ai is assisting to:</h1>
					<button>Assign</button>
				</div>
				<div className="line"></div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
			</div> */}
			<div className="active-knowledge-base">
				<div className="ai-header">
					<h1>Active Knowledges</h1>
					<button onClick={toggleModal}>Add Knowledge</button>
				</div>
				<ul className="column-titles-container">
					{columnNames.map((columnName) => (
						<li key={columnName} className={columnName.toLowerCase()}>
							{columnName}
						</li>
					))}
				</ul>
				<div className="knowledges-list">
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-status">
							{/* Loading state */}
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-status">
							{/* Ready state */}
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-status">
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
					<div className="knowledge-item">
						<div className="knowledge-link-container">
							<LinkWhite />
							<p>https://www.wikipedia.org/ve-ai</p>
						</div>
						<div className="knowledge-status">
							<span className="status">Training...</span>
							<span className="time">2 hrs left</span>
						</div>
					</div>
				</div>
			</div>
			<AddKnowledgeModal isOpen={info?.isAddKnowledgeModalOpen} toggleModal={toggleModal} />
		</div>
	);
};

export default memo(KnowledgeBase);
