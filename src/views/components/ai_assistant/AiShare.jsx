import React, { memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import '../../../assets/scss/ai_assistant/aiShare.scss';
import { ReactComponent as ExternalLink } from '../../../assets/svg/ai_assistant/externalLink.svg';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';
import { message } from 'antd';

const AiShare = ({ assistant }) => {
	const [copyStatus, setCopyStatus] = useState({ shareLink: false, embedScript: false });
	const timeoutRef = useRef(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const shareUrl = useMemo(() => `https://widget.ve.ai/${assistant?._id}`, [assistant]);

	const embedScript = useMemo(
		() =>
			`<script src="https://widget.ve.ai/public.js" data-ai-assistant-id=${assistant?._id} data-nscript="afterInteractive"></script>`,
		[assistant],
	);

	const handleCopy = useCallback(async (text, type) => {
		try {
			await navigator.clipboard.writeText(text);

			// Clear any existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			setCopyStatus((prev) => ({ ...prev, [type]: true }));
			timeoutRef.current = setTimeout(() => {
				setCopyStatus((prev) => ({ ...prev, [type]: false }));
				timeoutRef.current = null;
			}, 800);
		} catch (err) {
			console.error('Failed to copy text: ', err);
			message.error('Failed to copy text');
		}
	}, []);

	const handleVisit = useCallback(() => {
		window.open(shareUrl, '_blank');
	}, [shareUrl]);

	const CopyButton = memo(({ text, type, label }) => (
		<span
			className="shareLinkButton"
			onClick={() => handleCopy(text, type)}
			style={{ cursor: 'pointer' }}
		>
			<Link />
			{copyStatus?.[type] ? 'Copied!' : label}
		</span>
	));

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
						onClick={handleVisit}
						style={{ cursor: 'pointer' }}
					>
						<ExternalLink />
						Visit
					</span>

					<CopyButton text={shareUrl} type="shareLink" label="Copy" />
				</div>
			</div>

			<div className="embedContainer">
				<div className="embedTitle">Embed in your website</div>
				<div className="embedScript">{embedScript}</div>

				<div className="embedBtnContainer">
					<CopyButton text={embedScript} type="embedScript" label="Copy" />
				</div>
			</div>
		</div>
	);
};

export default memo(AiShare);
