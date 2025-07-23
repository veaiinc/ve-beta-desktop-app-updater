import { memo, useContext, useEffect, useState } from 'react';
import s from '../../../assets/scss/notes/meetSummary.module.scss';
import { Markdown } from '../../../helpers/markdownHelper';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';

const MeetSummary = ({ activeTab, history, pageId }) => {
	const {
		notes: { getMeetSummary, meetSummary },
	} = useContext(Context);

	const [info, setInfo] = useState({
		summary: '',
		loading: false,
	});

	useEffect(() => {
		if (activeTab === 'summary' && history === 'true' && !meetSummary) {
			getMeetSummary({ pageId });
			setInfo((prev) => ({ ...prev, loading: true }));
		}
	}, [activeTab]);

	useEffect(() => {
		if (meetSummary) {
			setInfo((prev) => ({ ...prev, summary: meetSummary?.summary, loading: false }));
		}
	}, [meetSummary]);

	return (
		<div className={s.meetSummaryContainer}>
			{info?.loading ? (
				<div className={s.loadingContainer}>
					<Spinner />
				</div>
			) : (
				<Markdown>{info?.summary}</Markdown>
			)}
		</div>
	);
};

export default memo(MeetSummary);
