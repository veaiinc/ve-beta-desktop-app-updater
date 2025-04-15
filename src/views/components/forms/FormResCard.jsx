import React, { useState, useEffect } from 'react';
import { ReactComponent as Download } from '../../../assets/svg/smartFiles/formResponse/download.svg';
import { ReactComponent as Call } from '../../../assets/svg/smartFiles/formResponse/call.svg';
import { ReactComponent as Message } from '../../../assets/svg/smartFiles/formResponse/message.svg';
import { ReactComponent as Calender } from '../../../assets/svg/smartFiles/formResponse/calendar.svg';
import moment from 'moment';
import '../../../assets/scss/forms/FormresCard.scss';
import service from '../../../services/graphQlServices';
import { getFormResponsesListQuery } from '../../../context/Templates/graphQlFunctions';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import QuickActions from '../globalComponents/QuickActions';
import { Tooltip } from 'antd';

const FormResCard = ({ formId, updateTotalSubmissions, handleCardClick }) => {
	const [responses, setResponses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedCard, setExpandedCard] = useState(null);
	const [info, setInfo] = useState({
		dropdown: false,
	});

	useEffect(() => {
		fetchInitialResponses();
	}, [formId]);

	useEffect(() => {
		if (responses.length) {
			const latestResponse = responses.reduce((latest, current) => {
				return !latest || current.createdAt > latest.createdAt ? current : latest;
			}, null);
			updateTotalSubmissions(responses.length, latestResponse);
		}
	}, [responses]);

	const fetchInitialResponses = async () => {
		try {
			setLoading(true);
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const response = await service.query(
				getFormResponsesListQuery,
				{
					filters: {
						workflowTemplateId: formId,
						page: 1,
						limit: 20,
					},
				},
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0] && response?.[1]?.data?.formResponsesList) {
				const { data, hasNextPage } = response[1].data.formResponsesList;
				setResponses(data || []);
				setHasNextPage(hasNextPage);
				setCurrentPage(1);
			} else {
				setError('Failed to fetch form responses');
			}
		} catch (err) {
			setError(err.message || 'An error occurred');
			console.error('Error fetching form responses:', err);
		} finally {
			setLoading(false);
		}
	};

	const fetchMoreResponses = async () => {
		if (!hasNextPage) return;

		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const nextPage = currentPage + 1;

			const response = await service.query(
				getFormResponsesListQuery,
				{
					filters: {
						workflowTemplateId: formId,
						page: nextPage,
						limit: 20,
					},
				},
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0] && response?.[1]?.data?.formResponsesList) {
				const { data, hasNextPage } = response[1].data.formResponsesList;
				setResponses((prev) => [...prev, ...(data || [])]);
				setHasNextPage(hasNextPage);
				setCurrentPage(nextPage);
			}
		} catch (err) {
			console.error('Error fetching more form responses:', err);
		}
	};

	const getName = (response) => {
		if (!response?.response) return 'No Name';
		const nameField = response.response.find((item) =>
			item?.question?.toLowerCase().includes('name'),
		);
		return nameField?.answer || 'No Name';
	};

	const getEmail = (response) => {
		if (!response?.response) return '';
		const emailField = response.response.find((item) =>
			item?.question?.toLowerCase().includes('email'),
		);
		return emailField?.answer || '';
	};

	const getPhone = (response) => {
		if (!response?.response) return '';
		const phoneField = response.response.find(
			(item) =>
				item?.question?.toLowerCase().includes('phone') ||
				item?.question?.toLowerCase().includes('mobile') ||
				item?.question?.toLowerCase().includes('contact'),
		);
		return phoneField?.answer || '';
	};

	const getTimeAgo = (response) => {
		if (!response?.createdAt) return '';
		return moment.unix(response.createdAt).fromNow();
	};

	const getResumeInfo = (response) => {
		if (!response?.response) return { name: 'Resume', url: null };

		const resumeField = response.response.find(
			(item) => item?.type === 'fileupload' || item?.type === 'fileUpload',
		);

		if (resumeField?.answer) {
			if (typeof resumeField.answer === 'object') {
				return {
					name: resumeField.answer.name || 'Resume',
					url: resumeField.answer.previewUrl,
				};
			}
			return {
				name: resumeField.answer,
				url: null,
			};
		}
		return {
			name: 'Resume',
			url: null,
		};
	};

	const handleActionClick = (actionName, response) => {
		const email = getEmail(response);
		const phone = getPhone(response);

		if (actionName === 'Call' && phone) {
			console.log(`Calling ${phone}`);
			// Here you can implement the actual call functionality
			window.location.href = `tel:${phone}`;
		} else if (actionName === 'Mail' && email) {
			console.log(`Emailing ${email}`);
			// Here you can implement the actual email functionality
			window.location.href = `mailto:${email}`;
		} else {
			console.log(`No ${actionName.toLowerCase()} data available for ${getName(response)}`);
		}
	};

	if (loading && responses.length === 0) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!responses.length) return <div>No data available</div>;

	return (
		<div className="formResLayout">
			<div className="formResponsesContainer">
				<InfiniteScroll
					dataLength={responses.length}
					next={fetchMoreResponses}
					hasMore={hasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
						width: '100%',
					}}
					height="calc(100vh - 100px)"
				>
					{responses.map((response, index) => {
						const resumeInfo = getResumeInfo(response);
						const isExpanded = expandedCard === index;

						return (
							<div
								key={index}
								className={`resWrapper ${isExpanded ? 'open' : ''}`}
								onClick={() => {
									setExpandedCard(expandedCard === index ? null : index);
									handleCardClick(response, index);
								}}
							>
								<div className="topRow">
									<div className="carddetails">
										<h1 className="name">{getName(response)}</h1>
										<h1 className="time">{getTimeAgo(response)}</h1>
									</div>
									{/* <div className="download">
										<span className="downloadicon">
											<Download />
										</span>
										{resumeInfo.url ? (
											<a
												href={resumeInfo.url}
												target="_blank"
												rel="noopener noreferrer"
												className="resumey"
												onClick={(e) => e.stopPropagation()}
											>
												{resumeInfo.name}
											</a>
										) : (
											<h2 className="resumey">{resumeInfo.name}</h2>
										)}
									</div> */}
								</div>

								{isExpanded && (
									<div className="incard">
										<h3 className="options">Ai Actions</h3>
										<div className="actionsRow">
											<div
												className="resoption"
												onClick={(e) => {
													e.stopPropagation();
													handleActionClick('Call', response);
												}}
											>
												<span className="optioncon">
													<Call />
												</span>
												<h1 className="option">Call</h1>
											</div>
											<div
												className="resoption"
												onClick={(e) => {
													e.stopPropagation();
													handleActionClick('Mail', response);
												}}
											>
												<span className="optioncon">
													<Message />
												</span>
												<h1 className="option">Email</h1>
											</div>
											<div
												className="resoption"
												onClick={(e) => {
													e.stopPropagation();
													handleActionClick('Schedule', response);
												}}
											>
												<span className="optioncon">
													<Calender />
												</span>
												<h1 className="option">Schedule</h1>
											</div>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</InfiniteScroll>
				<div
					className="formEnquiryContainer"
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						padding: '16px',
						width: '100%',
					}}
				></div>
			</div>
		</div>
	);
};

export default FormResCard;
