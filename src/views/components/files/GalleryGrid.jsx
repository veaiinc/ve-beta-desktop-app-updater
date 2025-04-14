import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import Spinner from '../../components/loaders/Spinner';
import { ReactComponent as Folder } from '../../../assets/svg/files/Folder.svg';
import { memo } from 'react';

import { useNavigate } from 'react-router-dom';
const GalleryGrid = ({ tenantGalleries, handleCreateNewGallery, handleNavigateGallery }) => {
	const navigate = useNavigate();
	if (!tenantGalleries?.galleries) {
		return (
			<div className="spinner-container">
				<Spinner />
			</div>
		);
	}
	return (
		<div className={`card-container`}>
			<div className="card-item">
				<div className="card-item-style card-item-style-btn">
					<button className="card-btn" onClick={handleCreateNewGallery}>
						<Plus />
						Create Gallery
					</button>
				</div>
			</div>
			{tenantGalleries?.galleries?.slice(0, 12).map((item, index) => (
				<div className="card-item" key={index} onClick={() => handleNavigateGallery(item)}>
					<div
						className="card-item-style content-wrapper"
						style={{
							backgroundImage: item?.coverImage?.thumbnailUrl
								? `url(${item.coverImage.thumbnailUrl})`
								: 'none',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: '120px',
							marginBottom: '8px',
						}}
					>
						{!item?.coverImage?.thumbnailUrl && (
							<div className="folder-icon-wrapper">
								<Folder />
							</div>
						)}
						{/* <span
								className={`live-badge ${
									item?.status === 'active' ? 'badge-active' : 'badge-draft'
								}`}
							>
								<span className="live-badge-dot"></span>
								<span className="live-badge-text">
									{item?.status === 'published' ? 'Live' : 'Draft'}
								</span>
							</span> */}
					</div>
					<span className="gallery-item-title">{item?.title}</span>
				</div>
			))}
		</div>
	);
};

export default memo(GalleryGrid);
