import { memo, useContext, useEffect, useState } from 'react';
import s from '../../../assets/scss/notes/meetSummary.module.scss';
import { Markdown } from '../../../helpers/markdownHelper';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import { useSearchParams } from 'react-router-dom';

const MeetSummary = ({ activeTab, meetingId }) => {
	const {
		notes: { getMeetSummary, meetSummary },
		templates: { updateStateValues },
	} = useContext(Context);
	const [searchParams, setSearchParams] = useSearchParams();

	const [info, setInfo] = useState({
		summary: '',
		loading: true,
		popover: null,
		selectedText: '',
	});

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	useEffect(() => {
		document.addEventListener('mouseup', handleSelection);

		return () => {
			document.removeEventListener('mouseup', handleSelection);
		};
	}, []);

	const handleSelection = () => {
		setTimeout(() => {
			const selection = window.getSelection();

			if (selection && !selection.isCollapsed) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();
				handleInfoChange({
					popover: {
						x: rect.left + rect.width / 2,
						y: rect.top - 10 + window.scrollY,
					},
					selectedText: selection.toString(),
				});
			} else {
				handleInfoChange({ popover: null });
			}
		}, 0); // let the browser finish updating selection first
	};

	const handleAskAi = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('chat', 'true');
		setSearchParams(newParams, { replace: true });
		updateStateValues({
			chatReplyData: info?.selectedText,
		});
	};

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

			{info?.popover && (
				<div
					className={s.popover}
					style={{
						top: info.popover.y,
						left: info.popover.x,
					}}
					onClick={() => {
						handleAskAi();
					}}
				>
					Ask VE
				</div>
			)}
		</div>
	);
};

export default memo(MeetSummary);
