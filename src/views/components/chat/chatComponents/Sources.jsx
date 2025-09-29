import { memo } from 'react';
import {
	redirectTo,
	fileTypeIcons,
	redirectTypeMapper,
	getFaviconUrl,
	getWebsiteName,
} from '../../../../helpers';
import '../../../../assets/scss/chat/chatComponents/sources.scss';

const Sources = ({ sources = [] }) => {
	return (
		<div className="sources">
			{sources?.map?.((source, index) => {
				const { type, name } = source;
				if (name?.length === 0) return null;
				return (
					<div
						className="source"
						key={index}
						onClick={() => {
							redirectTo?.(type, source?.[redirectTypeMapper?.[type]]);
						}}
					>
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
						<div className="website-name">
							{type === 'url' ? getWebsiteName(name) : name}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default memo(Sources);
