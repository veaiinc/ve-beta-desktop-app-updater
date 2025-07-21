import { memo, useState } from 'react';
import './guideMePopup.scss';
import { Switch } from 'antd';
const preferenceOptions = [
	{
		id: 1,
		title: 'Smart Questions',
		desc: 'How many suggestions per 15-min block?',
		value: 'smartQuestions',
		options: [
			{
				id: 1,
				title: 'Few (1–2)',
				value: 'few',
			},
			{
				id: 2,
				title: 'Normal (3)',
				value: 'normal',
			},
			{
				id: 3,
				title: 'More (5+)',
				value: 'more',
			},
		],
	},
	{
		id: 2,
		title: 'Instant Answers',
		desc: 'How many suggestions per 15-min block?',
		value: 'instantAnswers',
		options: [
			{
				id: 1,
				title: 'Minimal',
				value: 'minimal',
			},
			{
				id: 2,
				title: 'Key Questions Only',
				value: 'keyQuestionsOnly',
			},
			{
				id: 3,
				title: 'All Possible',
				value: 'allPossible',
			},
		],
	},
	{
		id: 3,
		title: 'Action Suggestions',
		value: 'actionSuggestions',
	},
	{
		id: 4,
		title: 'Context File Pulls',
		value: 'contextFilePulls',
	},
	{
		id: 5,
		title: 'Live Conversation Coaching',
		value: 'liveConversationCoaching',
	},
];
const GuideMePreference = () => {
	const [info, setInfo] = useState({
		selectedQuestion: 'few',
		selectedInstantAnswers: 'minimal',
		enabledSwitches: {
			smartQuestions: true,
			instantAnswers: true,
			actionSuggestions: false,
			contextFilePulls: false,
			liveConversationCoaching: false,
		},
	});
	return (
		<div className="guideMePreference">
			<div className="guideMePreferenceHeader">
				<div className="guideMePreferenceTitle">Intelligence Preferences</div>
				<div className="guideMePreferenceDescription">
					What should I enable for this meeting?
				</div>
			</div>
			<div className="guideMePreferenceBody">
				{preferenceOptions?.map((item) => (
					<>
						<div key={item.id} className="guideMePreferenceBodyItem">
							<div className="guideMePreferenceBodyItemHeader">
								<div className="guideMePreferenceBodyItemHeaderTitle">
									{item.title}
								</div>
								<Switch
									checked={info?.enabledSwitches?.[item?.value]}
									onChange={(checked) => {
										setInfo({
											...info,
											enabledSwitches: {
												...info?.enabledSwitches,
												[item?.value]: checked,
											},
										});
									}}
								/>
							</div>
							{info?.enabledSwitches?.[item?.value] && (
								<div className="guideMePreferenceOptionBody">
									<div className="guideMePreferenceOptionBodyDesc">
										{item.desc}
									</div>
									<div className="guideMePreferenceOptions">
										{item?.options?.map((item) => {
											return (
												<div
													key={item.id}
													className={`guideMePreferenceEachOption${
														info?.selectedQuestion === item?.value
															? ' active'
															: ''
													} ${
														info?.selectedInstantAnswers === item?.value
															? ' active'
															: ''
													}`}
												>
													{item.title}
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>
						<div className="horizontalLine"></div>
					</>
				))}
			</div>
		</div>
	);
};

export default memo(GuideMePreference);
