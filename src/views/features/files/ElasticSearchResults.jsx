import ObjectID from 'bson-objectid';
import { memo, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import '../../../assets/scss/files/search/elasticSearchResults.scss';
import Context from '../../../context/context';
import getFileTypeInfo, { categoryMap } from './getFiletypeInfo';
import { triggerCmdK } from '../../components/commandKSearch/CommandKSearch';

const ElasticSearchResults = () => {
	const navigate = useNavigate();

	const {
		templates: { updateStateValues: updateTemplateStateValues },
		elasticSearch: { elasticSearchResults },
	} = useContext(Context);

	const renderHTMLContent = (content) => {
		return { __html: content || '' };
	};

	const handleOpenClick = (gallery) => {
		if (gallery?.sourceType === 'workflow') {
			navigate(`/doc/${gallery?._id}`);
			triggerCmdK();
		} else if (gallery?.platform === 've.ai') {
			if (gallery?.fileUrl) window.open(gallery?.fileUrl, '_blank');
			if (gallery?.url) window.open(gallery?.url, '_blank');
			if (gallery?.title) {
				const urlRegex =
					/^(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
				if (urlRegex.test(gallery?.title)) window.open(gallery?.title, '_blank');
			}
		} else if (gallery?.url) {
			window.open(gallery?.url, '_blank');
		}
	};

	const shouldShowOpenButton = (gallery) => {
		if (gallery?.sourceType === 'workflow') return true;
		if (gallery?.platform === 've.ai') return !!gallery?.fileUrl || !!gallery?.url;
		return !!gallery?.url;
	};

	const handleAskClick = (searchItem) => {
		updateTemplateStateValues({ galleryFile: searchItem });
		const chatId = ObjectID()?.toString();
		triggerCmdK();
		navigate(`/chat/${chatId}`);
	};

	const groupedResults = useMemo(() => {
		const groups = {};
		(elasticSearchResults || []).forEach((item) => {
			const type = item?.sourceType?.toLowerCase() || 'others';
			const categoryType = categoryMap[type];
			if (!groups[categoryType]) groups[categoryType] = [];
			groups[categoryType].push(item);
		});
		return groups;
	}, [elasticSearchResults]);

	return (
		<div className="elastic-search-results-container">
			{elasticSearchResults?.length > 0 ? (
				Object.entries(groupedResults).map(([sourceType, items]) => (
					<div key={sourceType} className="source-type-group">
						<h3 className="source-type-heading">{sourceType}</h3>
						{items.map((searchItem, index) => {
							const { icon, color } = getFileTypeInfo(searchItem);

							return (
								<Tooltip
									key={searchItem?._id || index}
									title={
										<div className="hover-card">
											<div className="hover-card-header">
												<div className="hover-card-icon" style={{ color }}>
													{icon}
												</div>
												<div className="hover-card-title">
													{searchItem?.title || 'Singularity'}
												</div>
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
									}
									placement="top"
									overlayInnerStyle={{ padding: 0 }}
									overlayClassName="elastic-search-tooltip"
									arrow={false}
								>
									<div className="search-result-item" style={{ width: '100%' }}>
										<div className="search-result-item-left">
											<div className="image" style={{ color }}>
												{icon}
											</div>
											<div className="content">
												<h4 className="search-output-header">
													{searchItem?.title || 'Singularity'}
												</h4>
											</div>
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
								</Tooltip>
							);
						})}
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
