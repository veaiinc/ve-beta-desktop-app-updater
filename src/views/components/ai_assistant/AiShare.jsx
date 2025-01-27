import React, { memo } from 'react';
import '../../../assets/scss/ai_assistant/aiShare.scss';
import { ReactComponent as ExternalLink } from '../../../assets/svg/ai_assistant/externalLink.svg';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';

const AiShare = () => {
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

				<div className="shareLink">https://ismailphotographystudio.ve.ai/ub6jdicx</div>

				<div className="shareLinkButtons">
					<span className="shareLinkButton">
						<ExternalLink />
						Visit
					</span>

					<span className="shareLinkButton">
						<Link />
						Copy
					</span>
				</div>
			</div>

			<div className="embedContainer">
				<div className="embedTitle">Embed in your website</div>
				<div className="embedScript">{'<script>//</script>'}</div>

				<div className="embedBtnContainer">
					<span className="shareLinkButton">
						<Link />
						Copy
					</span>
				</div>
			</div>
		</div>
	);
};

export default memo(AiShare);
