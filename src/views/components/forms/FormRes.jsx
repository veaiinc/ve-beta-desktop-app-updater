import React, { useState, useEffect, memo, useCallback, useContext } from 'react';
import '../../../assets/scss/forms/formRes.scss';
import Context from '../../../context/context';
import { FetchMoreLoaderComp, isURL } from '../../../helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import FormModal from './FormModal';

const FormRes = ({ formId, updateTotalSubmissions }) => {
	const {
		templates: { getFormResponsesList, formResponsesList, moreFormResponsesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		resizing: null,
		currentPage: 1,
		hasNextPage: true,
		loading: true,
		formResponses: [],
		columns: [],
		modalIsOpen: false,
		selectedRow: null,
	});

	useEffect(() => {
		if (info?.resizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [info?.resizing]);

	useEffect(() => {
		fetchInitialResponses();
	}, [formId]);

	useEffect(() => {
		if (formResponsesList) {
			const formattedColumns = extractColumnsFromResponse(
				formResponsesList?.data?.[0]?.response,
			);
			setInfo((prev) => ({
				...prev,
				formResponses: formResponsesList?.data || [],
				hasNextPage: formResponsesList?.hasNextPage || false,
				loading: false,
				columns: formattedColumns,
			}));
		}
	}, [formResponsesList]);

	useEffect(() => {
		if (moreFormResponsesList) {
			setInfo((prev) => ({
				...prev,
				formResponses: [...prev?.formResponses, ...(moreFormResponsesList?.data || [])],
				hasNextPage: moreFormResponsesList?.hasNextPage || false,
				loading: false,
			}));
		}
	}, [moreFormResponsesList]);

	useEffect(() => {
		if (info?.formResponses?.length) {
			updateTotalSubmissions(info?.formResponses?.length);
		}
	}, [info?.formResponses]);

	const extractColumnsFromResponse = (responseArray) => {
		if (!responseArray?.length) return [];

		// Start with status and submission columns
		const columns = [
			{ id: 'status', width: 120, label: 'Status' },
			{ id: 'submission', width: 150, label: 'Submission' },
		];

		// Add columns from response questions
		responseArray?.forEach((item) => {
			// Extract text from HTML string
			const questionText = item?.question?.replace(/<[^>]+>/g, '');
			columns?.push({
				id: item?._id,
				width: 180,
				label: questionText,
				type: item?.type,
			});
		});

		return columns;
	};

	const getAnswerForQuestion = (response, questionId) => {
		const questionData = response?.find((item) => item?._id === questionId);
		if (!questionData) return '';
		if (isURL(questionData?.answer))
			return (
				<a href={questionData?.answer} target="_blank" rel="noopener noreferrer">
					<img
						style={{ width: '100%', height: '100%' }}
						src={questionData?.answer}
						alt="answer"
					/>
				</a>
			);

		if (questionData?.type === 'events') {
			try {
				const events = JSON.parse(questionData?.answer || '[]');
				return events?.map((event) => `${event?.name} - ${event?.date}`).join(', ');
			} catch (e) {
				return questionData?.answer || '';
			}
		}

		return questionData?.answer || '';
	};

	const fetchInitialResponses = useCallback(async () => {
		setInfo((prev) => ({ ...prev, loading: true }));
		await getFormResponsesList(formId, 1, 20);
	}, [formId]);

	const fetchMoreResponses = useCallback(async () => {
		if (info?.hasNextPage) {
			const nextPage = info?.currentPage + 1;
			await getFormResponsesList(formId, nextPage, 20, true);
			setInfo((prev) => ({
				...prev,
				currentPage: nextPage,
			}));
		}
	}, [info?.hasNextPage, info?.currentPage, formId]);

	const handleMouseDown = useCallback(
		(index, e) => {
			setInfo({
				...info,
				resizing: {
					index,
					startX: e.pageX,
					startWidth: info?.columns[index]?.width,
				},
			});
		},
		[info?.columns],
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (!info?.resizing) return;
			const diff = e.pageX - info?.resizing.startX;
			const newColumns = [...info?.columns];
			newColumns[info?.resizing.index] = {
				...newColumns[info?.resizing.index],
				width: Math.max(100, info?.resizing.startWidth + diff),
			};
			setInfo((prev) => ({
				...prev,
				columns: newColumns,
			}));
		},
		[info?.resizing, info?.columns],
	);

	const handleMouseUp = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			resizing: null,
		}));
	}, []);

	const handleOpenModal = (row) => {
		setInfo((prev) => ({ ...prev, modalIsOpen: true, selectedRow: row }));
	};

	return (
		<div className="formResParentContainer">
			<div className="tableWrapper">
				<div className="tableContent">
					<div className="tableBody">
						<InfiniteScroll
							dataLength={info?.formResponses?.length || 0}
							next={fetchMoreResponses}
							hasMore={info?.hasNextPage}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								width: 'fit-content',
							}}
							height="calc(100vh - 520px)"
						>
							<div className="headerRow">
								{info?.columns?.map((column, index) => (
									<div
										key={column?.id}
										className="headerCell"
										style={{ width: column?.width }}
									>
										<div className="cellContent">
											{(column?.label || '')
												?.replace(/<\/?[^>]+(>|$)/g, '')
												?.replace(/&nbsp;/g, ' ')}
										</div>
										<div
											className="resizeHandle"
											onMouseDown={(e) => handleMouseDown(index, e)}
										/>
									</div>
								))}
							</div>
							{info?.formResponses?.map((row, rowIndex) => (
								<div key={rowIndex} className="tableRow">
									{info?.columns?.map((column) => (
										<div
											key={column?.id}
											className="tableCell"
											style={{ width: column?.width }}
											onClick={() => handleOpenModal(row)}
										>
											{column?.id === 'status' ? (
												<span
													className={`statusBadge ${
														row?.isRead ? 'incomplete' : 'complete'
													}`}
												>
													{row?.isRead ? 'Incomplete' : 'Complete'}
												</span>
											) : column?.id === 'submission' ? (
												moment
													.unix(row?.createdAt)
													.format('MMM DD, hh:mm A')
											) : (
												getAnswerForQuestion(row?.response, column?.id)
											)}
										</div>
									))}
								</div>
							))}
						</InfiniteScroll>
					</div>
				</div>
			</div>
			<FormModal
				isOpen={info?.modalIsOpen}
				onClose={() =>
					setInfo((prev) => ({ ...prev, modalIsOpen: false, selectedRow: null }))
				}
				selectedRow={info?.selectedRow}
			/>
		</div>
	);
};

export default memo(FormRes);
