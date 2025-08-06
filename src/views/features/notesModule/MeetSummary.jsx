import { memo, useContext, useEffect, useState } from 'react';
import s from '../../../assets/scss/notes/meetSummary.module.scss';
import { Markdown } from '../../../helpers/markdownHelper';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';

const MeetSummary = ({ activeTab, meetingId }) => {
	const {
		notes: { getMeetSummary, meetSummary },
	} = useContext(Context);
	const [info, setInfo] = useState({
		summary: '',
		loading: true,
	});

	useEffect(() => {
		if (meetSummary) {
			setInfo((prev) => ({
				...prev,
				summary: meetSummary?.summary,
				loading: false,
			}));
		}
	}, [meetSummary]);

	const loading = meetSummary ? false : true;

	return (
		<div className={s.meetSummaryContainer}>
			{loading ? (
				<div className={s.loadingContainer}>
					<Spinner />
				</div>
			) : info?.summary ? (
				<Markdown>{info?.summary}</Markdown>
			) : (
				<div className={s.loadingContainer}>No summary.</div>
			)}
		</div>
	);
};

export default memo(MeetSummary);
