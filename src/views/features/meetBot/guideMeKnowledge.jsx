import { memo, useState } from 'react';
import './guideMePopup.scss';
import { ReactComponent as UrlLinkIcon } from './urlLinkIcon.svg';
import { ReactComponent as FileIcon } from './newFilesIcon.svg';
import { ReactComponent as TestIcon } from './textIcon.svg';
import { ReactComponent as LeftArrowIcon } from './leftArrowIcon.svg';
import { ReactComponent as TickSvg } from './newTickIcon.svg';
import { ReactComponent as CancelSvg } from '../../../assets/svg/gallery/cross.svg';

const UrlLinks = [
	{
		id: 1,
		title: 'https://www.techinsights.com/articles/latest-gadgets',
	},
];
const GuideMeKnowledge = () => {
	const [info, setInfo] = useState({
		selectedOption: 'url',
		selectedUrl: '',
	});
	return (
		<div className="guideMeKnowledgeMainContainer">
			<div className="guideMeButtonContainer">
				<div
					className={`guideMeEachButton${info.selectedOption === 'url' ? ' active' : ''}`}
					onClick={() => setInfo({ selectedOption: 'url' })}
				>
					<UrlLinkIcon />
					URL
				</div>
				<div
					className={`guideMeEachButton${
						info.selectedOption === 'file' ? ' active' : ''
					}`}
					onClick={() => setInfo({ selectedOption: 'file' })}
				>
					<FileIcon />
					File
				</div>
				<div
					className={`guideMeEachButton${
						info.selectedOption === 'text' ? ' active' : ''
					}`}
					onClick={() => setInfo({ selectedOption: 'text' })}
				>
					<TestIcon />
					Custom text
				</div>
			</div>
			<div className="guideMeKnowledgeUrlsContainer">
				<div className="knowledgeInputContainer">
					<input
						type="text"
						placeholder="Enter URL"
						className="knowledgeBaseInputText"
						value={info.selectedUrl}
						onChange={(e) => setInfo({ ...info, selectedUrl: e.target.value })}
					/>
					<div className="knowledgeInputArrow">
						<LeftArrowIcon />
					</div>
				</div>
				{info?.selectedOption === 'url' && (
					<div className="knowledgeUrlsListContainer">
						{UrlLinks.map((item) => (
							<div
								className={`knowledgeUrlItemContainer${
									info.selectedUrl === item.title ? ' active' : ''
								}`}
							>
								<div
									key={item.id}
									className={`knowledgeUrlItem${
										info.selectedUrl === item.title ? ' active' : ''
									}`}
									onClick={() => setInfo({ ...info, selectedUrl: item.title })}
								>
									<div className="knowledgeUrlItemIcon">
										<TickSvg />
									</div>
									<span className="knowledgeUrlItemText">{item.title}</span>
								</div>
								{info.selectedUrl === item.title && (
									<div
										className="knowledgeUrlItemDelete"
										onClick={() => setInfo({ ...info, selectedUrl: '' })}
									>
										<CancelSvg />
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(GuideMeKnowledge);
