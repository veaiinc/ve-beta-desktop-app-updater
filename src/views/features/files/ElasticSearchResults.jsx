import { memo, useContext } from 'react';
import Context from '../../../context/context';
import '../../../assets/scss/files/search/elasticSearchResults.scss';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import moment from 'moment';
import getFileTypeInfo from './getFiletypeInfo';

const ElasticSearchResults = () => {
	const navigate = useNavigate();

	const {
		templates: { updateStateValues: updateTemplateStateValues },
		elasticSearch: { elasticSearchResults },
	} = useContext(Context);

	// Function to safely render HTML content
	const renderHTMLContent = (content) => {
		return { __html: content || '' };
	};

	// Hover card component
	const HoverCard = ({ searchItem }) => {
		const { icon, color } = getFileTypeInfo(searchItem);

		return (
			<div className="hover-card">
				<div className="hover-card-header">
					<div className="hover-card-icon" style={{ color }}>
						{icon}
					</div>
					<div className="hover-card-title">{searchItem?.title || 'Singularity'}</div>
				</div>
				<div className="hover-card-content">
					<div
						className="hover-card-description"
						dangerouslySetInnerHTML={renderHTMLContent(
							searchItem?.text ||
								'Connect to Notion to manage <mark>tasks</mark>, organize projects, and centralize your work.',
						)}
					/>
				</div>
			</div>
		);
	};

	const handleOpenClick = (gallery) => {
		if (gallery?.sourceType === 'workflow') {
			navigate(`/doc/${gallery?._id}`);
		} else if (gallery?.platform === 've.ai') {
			if (gallery?.fileUrl) {
				window.open(gallery?.fileUrl, '_blank');
			}
			if (gallery?.url) {
				window.open(gallery?.url, '_blank');
			}
			if (gallery?.title) {
				const urlRegex =
					/^(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
				if (urlRegex.test(gallery?.title)) {
					window.open(gallery?.title, '_blank');
				}
			}
		} else {
			if (gallery?.url) {
				window.open(gallery?.url, '_blank');
			}
		}
	};

	const shouldShowOpenButton = (gallery) => {
		if (gallery?.sourceType === 'workflow') {
			return true;
		}

		if (gallery?.platform === 've.ai') {
			return !!gallery?.fileUrl || !!gallery?.url;
		}

		return !!gallery?.url;
	};

	const handleAskClick = (searchItem) => {
		updateTemplateStateValues({ galleryFile: searchItem });
		const chatId = ObjectID()?.toString();
		navigate(`/chat/${chatId}`);
	};

	return (
		<div className="elastic-search-results-container">
			{elasticSearchResults?.length > 0 ? (
				elasticSearchResults?.map((searchItem, index) => (
					<div
						key={searchItem?._id || index}
						className="search-result-item"
						style={{ width: '100%' }}
					>
						<div className="search-result-item-left">
							<div
								style={{ color: getFileTypeInfo(searchItem)?.color }}
								className="image"
							>
								{getFileTypeInfo(searchItem)?.icon}
							</div>
							<div className="content">
								<h4 className="search-output-header">
									{searchItem?.title || 'Singularity'}
								</h4>
								<p className="description">
									Created on{' '}
									{moment(searchItem?.createdAt).format('MMM DD, hh:mm A')}
								</p>
							</div>
						</div>
						<div className="hover-card-wrapper">
							<HoverCard searchItem={searchItem} />
						</div>
						<div className="search-result-item-right">
							<div className="action-buttons">
								<button
									className="action-btn ask-btn"
									onClick={() => handleAskClick(searchItem)}
								>
									Ask
								</button>
								{shouldShowOpenButton(searchItem) && (
									<button
										className="action-btn open-btn"
										onClick={() => handleOpenClick(searchItem)}
									>
										Open
									</button>
								)}
							</div>
						</div>
					</div>
				))
			) : (
				<div className="no-results-container">
					<p className="no-results-text">No results found</p>
				</div>
			)}
		</div>
	);
};

export default memo(ElasticSearchResults);
