import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import Spinner from '../../components/loaders/Spinner';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
const MostUsedEntries = ({ mostUsedEntities, isLoading }) => {
	const navigate = useNavigate();
	if (isLoading) {
		return <Spinner />;
	}

	const getEntityBadge = (item) => {
		switch (item.entity?.toLowerCase()) {
			case 'workflow':
				return 'Document';
			case 'page':
				return 'Note';
			case 'form':
				return 'Form';
			default:
				return item.entityType || 'Template';
		}
	};

	const getEntityNavigationPath = (item) => {
		switch (item.entity?.toLowerCase()) {
			case 'workflow':
				return `/doc/${item._id}`;
			case 'page':
				return `/note/${item._id}`;
			case 'form':
				return `/form/${item._id}`;
			default:
				return `/doc/${item._id}`;
		}
	};

	return (
		<div className={`card-container`}>
			{mostUsedEntities?.data?.slice(0, 12).map((item, index) => (
				<div
					className="card-item"
					key={index}
					onClick={() => navigate(getEntityNavigationPath(item))}
				>
					<div className="card-item-style content-wrapper">
						<span className={`status-badge`}>{getEntityBadge(item)}</span>
						<span className="item-title">
							{item.title?.slice(0, 20)}
							{item.title?.length > 20 ? '...' : ''}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(MostUsedEntries);
