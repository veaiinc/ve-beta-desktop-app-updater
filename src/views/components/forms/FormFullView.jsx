import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rate } from 'antd';
import Context from '../../../context/context';
import CloseSvg from '../../../assets/svg/tasks/doubleRightArrow.svg?react';
import BiDash from '../../../assets/svg/smartFiles/formResponse/bi-dash.svg?react';
import Email from '../../../assets/svg/smartFiles/formResponse/email.svg?react';
import Phone from '../../../assets/svg/smartFiles/formResponse/phone.svg?react';
import Calendar from '../../../assets/svg/smartFiles/formResponse/calendar.svg?react';
import Clock from '../../../assets/svg/smartFiles/formResponse/clock.svg?react';
import FileUpload from '../../../assets/svg/smartFiles/formResponse/file-upload.svg?react';
import Link from '../../../assets/svg/smartFiles/formResponse/link.svg?react';
import Hash from '../../../assets/svg/smartFiles/formResponse/hash.svg?react';
import TimeDivider from '../../../assets/svg/smartFiles/formResponse/time-divider.svg?react';
import '../../../assets/scss/forms/formFullView.scss';

const iconsForQuestions = {
	shortanswer: <BiDash />,
	email: <Email />,
	phone: <Phone />,
	date: <Calendar />,
	time: <Clock />,
	fileupload: <FileUpload />,
	link: <Link />,
	number: <Hash />,
};

const removeQuotes = (text) => {
	if (!text) return '';
	if (typeof text !== 'string') return text || '';
	return text?.replace(/^["']|["']$/g, '');
};

const FormFullView = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState(null);
	const [loading, setLoading] = useState(true);
	const {
		templates: { getFormResponse },
	} = useContext(Context);

	useEffect(() => {
		const fetchFormData = async () => {
			if (id) {
				setLoading(true);
				try {
					const response = await getFormResponse({ formId: id });
					console.log('API Response:', response);
					if (response && response._id) {
						setFormData(response);
					}
				} catch (error) {
					console.error('Error fetching form response:', error);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchFormData();
	}, [id, getFormResponse]);

	const handleClose = () => {
		navigate(-1);
	};

	const renderAnswer = (type, answer) => {
		switch (type) {
			case 'time':
				const [hours, minutes] = answer.split(':');
				return (
					<div className="timeAnswer">
						<span className="time">{hours}</span>
						<TimeDivider />
						<span className="time">{minutes}</span>
					</div>
				);
			case 'fileupload':
				return (
					<div className="fileAnswer">
						{Array.isArray(answer) &&
							answer.map((file, index) => (
								<div key={index} className="fileItem">
									<FileUpload />
									<span>{file.name}</span>
								</div>
							))}
					</div>
				);
			case 'link':
				return (
					<a
						href={removeQuotes(answer)}
						target="_blank"
						rel="noopener noreferrer"
						className="linkAnswer"
					>
						{removeQuotes(answer)}
					</a>
				);
			default:
				return <div className="defaultAnswer">{answer}</div>;
		}
	};

	if (loading) {
		return (
			<div className="formFullView">
				<div className="loading">Loading...</div>
			</div>
		);
	}

	console.log('Form data state:', formData);

	if (!formData) {
		return (
			<div className="formFullView">
				<div className="loading">No form data found</div>
			</div>
		);
	}

	return (
		<div className="formFullView">
			<div className="formFullViewContent">
				<div className="headerContainer">
					<div className="headerLeft">
						<CloseSvg onClick={handleClose} />
						<div className="formTitle">Form Response Details</div>
					</div>
					<div className="headerRight">
						<span
							className={`statusBadge ${formData.isRead ? 'incomplete' : 'complete'}`}
						>
							{formData.isRead ? 'Incomplete' : 'Complete'}
						</span>
					</div>
				</div>

				<div className="responseContainer">
					{formData.response.map((item) => (
						<div key={item._id} className="responseItem">
							<div className="questionSection">
								{iconsForQuestions[item.type] || <BiDash />}
								<span className="questionText">{item.question}</span>
							</div>
							<div className="answerSection">
								{renderAnswer(item.type, item.answer)}
							</div>
							<div className="divider" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FormFullView;
