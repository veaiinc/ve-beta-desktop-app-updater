import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/aiSuggestionsReportUserComponent.scss';

const AISuggestionsReportUserComponent = ({ data }) => {
	if (!data) return null;
	const { title, description, confidence_score, priority } = data;
	return (
		<div className="report-user-component">
			<div className="report-header">
				<div className="info">
					{confidence_score && (
						<div className="confidence">
							Confidence score
							<div className="value">{`${confidence_score * 100}%`}</div>
						</div>
					)}
					{confidence_score && <span>|</span>}

					<div className="priority">
						<div
							className="indicator"
							style={{
								background:
									priority === 'High'
										? 'red'
										: priority === 'Medium'
										? 'orange'
										: 'green',
							}}
						></div>
						{`${priority} Priority`}
					</div>
				</div>
				<div className="content">
					<div className="title-text">{title || ''}</div>
					<div className="description-text">{description || ''}</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AISuggestionsReportUserComponent);
