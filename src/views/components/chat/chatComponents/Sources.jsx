import { memo, useLayoutEffect, useState } from 'react';
import {
	redirectTo,
	fileTypeIcons,
	redirectTypeMapper,
	getFaviconUrl,
	getWebsiteName,
} from '../../../../helpers';
import '../../../../assets/scss/chat/chatComponents/sources.scss';

const Sources = ({ sources = [] }) => {
	const [info, setInfo] = useState({
		sources: [],
	});

	useLayoutEffect(() => {
		if (sources?.length > 0) {
			const formattedSources = sources?.map((source) => {
				let title = source?.title ?? '';
				title = title?.trim();
				if (title?.length > 0) {
					const words = title?.split(' ');
					title = words?.slice(0, 12)?.join(' ');
					if (words?.length > 12) {
						title += ' ...';
					}
				}
				return {
					...source,
					title,
				};
			});
			setInfo((prev) => ({ ...prev, sources: formattedSources }));
		}
	}, [sources]);

	return (
		<div className="sources">
			{info?.sources?.map?.((source, index) => {
				const { type, name, title } = source;
				return (
					<button
						className="source"
						key={index}
						onClick={() => {
							redirectTo?.(type, source?.[redirectTypeMapper?.[type]]);
						}}
					>
						<div className="left-container">
							<div className="icon">
								{type === 'url' ? (
									getFaviconUrl(name) ? (
										<img
											src={getFaviconUrl(name)}
											alt="favicon"
											className="favicon-image"
										/>
									) : (
										<div className="company-icon">
											{getWebsiteName(name)?.charAt(0)}
										</div>
									)
								) : (
									<div className="company-icon">
										{type === 's3_key'
											? fileTypeIcons[name?.match(/\.(\w+)$/)?.[1]]
											: fileTypeIcons[type]}
									</div>
								)}
							</div>

							<div className="source-title">{title ?? ''}</div>
						</div>

						<div className="right-container">
							<div className="website-name">
								{type === 'url' ? getWebsiteName(name) : name}
							</div>
						</div>
					</button>
				);
			})}
		</div>
	);
};

export default memo(Sources);
