import { memo, useContext } from 'react';
import Context from '../../../context/context';
import '../../../assets/scss/elastic_search/index.scss';
import { ReactComponent as Pdf } from '../../../assets/svg/files/pdfSvg.svg';
import { ReactComponent as Mp3 } from '../../../assets/svg/files/mp3Svg.svg';
import { ReactComponent as Mp4 } from '../../../assets/svg/files/mp4Svg.svg';
import { ReactComponent as Document } from '../../../assets/svg/files/docSvg.svg';
import { ReactComponent as Psd } from '../../../assets/svg/files/psdSvg.svg';
import { ReactComponent as Zip } from '../../../assets/svg/files/zipSvg.svg';
import { ReactComponent as File } from '../../../assets/svg/files/file.svg';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';

const ElasticSearchResults = () => {
	const navigate = useNavigate();
	const {
		templates: { updateStateValues: updateTemplateStateValues },
		elasticSearch: { elasticSearchResults },
	} = useContext(Context);

	const getFileTypeInfo = (searchItem) => {
		// First check explicit fileType if present
		if (searchItem.fileType) {
			const type = (searchItem.fileType?.toLowerCase() || '').replace(/^\./, '');
			switch (type) {
				case 'pdf':
				case 'epub':
				case 'mobi':
				case 'azw':
					return {
						icon: <Pdf />,
						color: '#FF4D4D',
					};
				case 'mp3':
				case 'wav':
				case 'aac':
				case 'flac':
				case 'ogg':
					return {
						icon: <Mp3 />,
						color: '#9747FF',
					};
				case 'mp4':
				case 'mkv':
				case 'avi':
				case 'mov':
				case 'webm':
					return {
						icon: <Mp4 />,
						color: '#9747FF',
					};
				case 'doc':
				case 'docx':
				case 'xls':
				case 'xlsx':
				case 'csv':
				case 'ods':
				case 'ppt':
				case 'pptx':
				case 'key':
					return {
						icon: <Document />,
						color: '#2D7FF9',
					};
				case 'psd':
				case 'ai':
				case 'figma':
				case 'xd':
				case 'sketch':
					return {
						icon: <Psd />,
						color: '#2D7FF9',
					};
				case 'zip':
				case 'rar':
				case '7z':
				case 'tar.gz':
					return {
						icon: <Zip />,
						color: '#71717A',
					};
				case 'json':
				case 'xml':
				case 'yaml':
				case 'txt':
				case 'md':
				case 'log':
				case 'ini':
				case 'cfg':
					return {
						icon: <File />,
						color: '#71717A',
					};
				default:
					return {
						icon: <File />,
						color: '#71717A',
					};
			}
		}

		// If no fileType, try to determine from other properties
		if (searchItem.sourceType) {
			switch (searchItem.sourceType.toLowerCase()) {
				case 'pdf':
					return {
						icon: <Pdf />,
						color: '#FF4D4D',
					};
				case 'png':
				case 'jpg':
				case 'jpeg':
				case 'image':
					return {
						icon: <File />,
						color: '#2D7FF9',
					};
				case 'workflow':
					return {
						icon: <Document />,
						color: '#2D7FF9',
					};
				case 'url':
					return {
						icon: <File />,
						color: '#71717A',
					};
			}
		}

		// Try to determine from URL or fileUrl if present
		const url = searchItem.url || searchItem.fileUrl;
		if (url) {
			const extension = url.split('.').pop().toLowerCase();
			switch (extension) {
				case 'pdf':
					return {
						icon: <Pdf />,
						color: '#FF4D4D',
					};
				case 'png':
				case 'jpg':
				case 'jpeg':
					return {
						icon: <File />,
						color: '#2D7FF9',
					};
			}
		}
		return {
			icon: <File />,
			color: '#71717A',
		};
	};

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
					<div className="hover-card-title">{searchItem.title || 'Singularity'}</div>
				</div>
				<div className="hover-card-content">
					<div
						className="hover-card-description"
						dangerouslySetInnerHTML={renderHTMLContent(
							searchItem.text ||
								'Connect to Notion to manage <mark>tasks</mark>, organize projects, and centralize your work.',
						)}
					/>
				</div>
			</div>
		);
	};

	const handleOpenClick = (gallery) => {
		if (gallery.sourceType === 'workflow') {
			navigate(`/doc/${gallery?._id}`);
		} else if (gallery.platform === 've.ai') {
			if (gallery.fileUrl) {
				window.open(gallery.fileUrl, '_blank');
			}
			if (gallery.url) {
				window.open(gallery.url, '_blank');
			}
		} else {
			if (gallery.url) {
				window.open(gallery.url, '_blank');
			}
		}
	};

	const shouldShowOpenButton = (gallery) => {
		if (gallery.sourceType === 'workflow') {
			return true;
		}

		if (gallery.platform === 've.ai') {
			return !!gallery.fileUrl || !!gallery.url;
		}

		return !!gallery.url;
	};

	const handleAskClick = (searchItem) => {
		updateTemplateStateValues({ galleryFile: searchItem });
		const chatId = ObjectID()?.toString();
		navigate(`/chat/${chatId}`);
	};

	return (
		<div className="search-results-list">
			{elasticSearchResults?.length > 0 &&
				elasticSearchResults?.map((searchItem, index) => (
					<div key={searchItem._id || index} className="search-result-item">
						<div className="search-result-item-content">
							<div className="search-result-item-left">
								<div style={{ color: getFileTypeInfo(searchItem).color }}>
									{getFileTypeInfo(searchItem).icon}
								</div>
								<div className="search-result-item-info">
									<h4>{searchItem.title || 'Singularity'}</h4>
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
					</div>
				))}
		</div>
	);
};

export default memo(ElasticSearchResults);
