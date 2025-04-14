import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import moment from 'moment';
import { DocsStatusButton } from '../../features/docs/Docs';
import { useNavigate } from 'react-router-dom';
const DocsGrid = ({ docsFilesList, statusTextmapper }) => {
	const navigate = useNavigate();
	const getStatusBadge = (status) => {
		switch (status?.toLowerCase()) {
			case 'enquiry':
				return 'Draft';
			case 'filesent':
				return 'Sent';
			case 'filesviewed':
				return 'Client Viewed';
			case 'proposalaccepted':
				return 'Client Accepted';
			case 'contractsigned':
				return 'Client Signed';
			case 'confirmed':
				return 'Confirmed';
			case 'draft':
				return 'Draft';
			case 'published':
				return 'Live';
			default:
				return status || 'Draft';
		}
	};

	return (
		<div className={`card-container`}>
			{docsFilesList?.data?.slice(0, 12).map((doc, index) => (
				<div className="card-item" key={index} onClick={() => navigate(`/doc/${doc?._id}`)}>
					<div className="card-item-style content-wrapper docs">
						<div className="docs-preview"></div>
						<DocsStatusButton
							content={statusTextmapper?.[doc?.status]?.text}
							style={statusTextmapper?.[doc?.status]?.style}
							dotStyle={statusTextmapper?.[doc?.status]?.dotStyle}
						/>
						<div className="docs-title-wrapper">
							<span className="docs-item-title">{doc?.title}</span>
							<span className="docs-item-sub-title">
								{moment.unix(doc?.createdAt).fromNow()}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default DocsGrid;
