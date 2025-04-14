import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import Spinner from '../../components/loaders/Spinner';
import { memo } from 'react';
const TemplatesGrid = ({ myWorkflows, isLoading, setInfo }) => {
	if (isLoading) {
		return <Spinner />;
	}

	const getStatusBadge = (template) => {
		if (!template?.workflowStats) return 'Draft';

		if (template.workflowStats.contractSigned) return 'Client Signed';
		if (template.workflowStats.filesViewed) return 'Client Viewed';
		if (template.workflowStats.filesSent) return 'Sent';
		if (template.workflowStats.confirmed) return 'Confirmed';
		if (template.workflowStats.enquiry) return 'Draft';

		return template?.status === 'published' ? 'Live' : 'Draft';
	};

	return (
		<div className={`card-container`}>
			<div className="card-item">
				<div className="card-item-style card-item-style-btn">
					<button
						className="card-btn"
						onClick={() => setInfo((prev) => ({ ...prev, openProposalPopup: true }))}
					>
						<Plus />
						Create Template
					</button>
				</div>
			</div>
			{myWorkflows?.data?.slice(0, 12).map((template, index) => (
				<div
					className="card-item"
					key={index}
					// onClick={() => navigate(`/template/${template?._id}`)}
				>
					<div className="card-item-style content-wrapper">
						<span
							className={`status-badge ${
								template?.status === 'published' ? 'live' : 'draft'
							}`}
						>
							{getStatusBadge(template)}
						</span>
						<span className="item-title">
							{template?.title?.slice(0, 20)}
							{template?.title?.length > 20 ? '...' : ''}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(TemplatesGrid);
