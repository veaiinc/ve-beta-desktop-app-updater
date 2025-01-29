import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiShare.scss';
import { ReactComponent as ExternalLink } from '../../../assets/svg/ai_assistant/externalLink.svg';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';

const AiShare = ({ assistant }) => {
	const [copyStatus, setCopyStatus] = useState({ shareLink: false, embedScript: false });

	const shareUrl = 'https://ismailphotographystudio.ve.ai/ub6jdicx';
	const embedScript = `<script src="https://widget.ve.ai/public.js" data-ai-assistant-id=${assistant?._id}  data-ai-assistant-name=${assistant?.name} data-nscript="afterInteractive"></script>`;

	const handleCopy = async (text, type) => {
		try {
			console.log('text', text);
			await navigator.clipboard.writeText(text);
			setCopyStatus((prev) => ({ ...prev, [type]: true }));
			setTimeout(() => {
				setCopyStatus((prev) => ({ ...prev, [type]: false }));
			}, 800);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<div className="aiShareParentContainer">
			<div className="shareContainer">
				<div className="aiShareHeader">
					<span className="lineone">Share</span>
					<span className="linetwo">
						To add the chatbot any where on your website, add this iframe to your html
						code
					</span>
				</div>

				<div className="shareLink">{shareUrl}</div>

				<div className="shareLinkButtons">
					<span
						className="shareLinkButton"
						onClick={() => window.open(shareUrl, '_blank')}
						style={{ cursor: 'pointer' }}
					>
						<ExternalLink />
						Visit
					</span>

					<span
						className="shareLinkButton"
						onClick={() => handleCopy(shareUrl, 'shareLink')}
						style={{ cursor: 'pointer' }}
					>
						<Link />
						{copyStatus?.shareLink ? 'Copied!' : 'Copy'}
					</span>
				</div>
			</div>

			<div className="embedContainer">
				<div className="embedTitle">Embed in your website</div>
				<div className="embedScript">{embedScript}</div>

				<div className="embedBtnContainer">
					<span
						className="shareLinkButton"
						onClick={() => handleCopy(embedScript, 'embedScript')}
						style={{ cursor: 'pointer' }}
					>
						<Link />
						{copyStatus?.embedScript ? 'Copied!' : 'Copy'}
					</span>
				</div>
			</div>
		</div>
	);
};

export default memo(AiShare);
