import { memo } from 'react';
import s from './agentSuggestion.module.scss';
import { ReactComponent as AiIcon } from '../../../../assets/svg/agents/ai.svg';
import { ReactComponent as EyeIcon } from '../../../../assets/svg/agents/eye.svg';
import { getFaviconUrl } from '../../../../helpers';
const AgentSuggestion = ({
	isAiCreated = true,
	title = 'Weekly Meeting Synthesizer',
	description = 'Detected from : 6 past meeting notes + transcript uploads',
	toolsList = [
		{
			name: 'Google',
			icon: getFaviconUrl('https://www.google.com'),
		},
		{
			name: 'Notion',
			icon: getFaviconUrl('https://www.notion.so'),
		},
		{
			name: 'Slack',
			icon: getFaviconUrl('https://www.slack.com'),
		},
	],
}) => {
	return (
		<div className={s.agentSuggestion}>
			<div className={s.agentCard}>
				<div className={s.agentcontainer}>
					{/* <div className={s.aiInfo}>
						<div className={s.aiIcon}>
							<AiIcon />
						</div>

						<div className={s.aiTitle}>
							{isAiCreated ? 'Ai-Created' : 'User-Created'}
						</div>
					</div> */}
					<div className={s.agentTitle}>{title}</div>
					<div className={s.agentDescription}>{description}</div>
					<div className={s.toolsList}>
						{toolsList.map((tool) => (
							<div className={s.toolItem}>
								<img src={tool.icon} alt={tool.name} className={s.toolIcon} />
							</div>
						))}
					</div>
				</div>
				<div className={s.agentButton}>
					<EyeIcon />
					<div className={s.agentButtonText}>Preview</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AgentSuggestion);
