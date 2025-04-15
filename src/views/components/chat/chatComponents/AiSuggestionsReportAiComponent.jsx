import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/aiSuggestionsReportAiComponent.scss';
import { Markdown } from '../../../../helpers/markdownHelper';

const AiSuggestionsReportAiComponent = ({ data }) => {
	if (!data) return null;
	const { research_report } = data;
	return (
		<div className="ai-suggestions-report-ai-component">
			<Markdown>
				{(research_report || '')
					?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')
					?.replace(/\\n/g, '\n')}
			</Markdown>
		</div>
	);
};
export default memo(AiSuggestionsReportAiComponent);
