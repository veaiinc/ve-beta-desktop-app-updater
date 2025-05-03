import { memo, useMemo } from 'react';
import '../../../assets/scss/contacts/contactsListView.scss';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ClockSvg } from '../../../assets/svg/contacts/clock.svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs?.extend(relativeTime);

const ContactsListView = ({ data, searchQuery = '' }) => {
	const navigate = useNavigate();

	const filteredData = useMemo(
		() =>
			data?.filter((contact) =>
				contact?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
			),
		[data, searchQuery],
	);
	return (
		<div className="contacts-table">
			<div className="table-header">
				<div className="column people">Name/Email</div>
				<div className="column strength"></div>
				<div className="column interaction">
					Last Interaction <ClockSvg />
				</div>
			</div>
			<div className="table-body">
				{filteredData?.map((contact) => (
					<div
						key={contact?._id}
						className="table-row"
						onClick={() => navigate(`/contact/${contact?._id}`)}
					>
						<div className="row-left">
							<div className="people">
								{/* <input type="checkbox" className="checkbox" /> */}
								{/* <div className="avatar">{contact.avatar}</div> */}
								<div className="contact-info">
									<div className="name">{contact?.name || ''}</div>
									<div className="email">
										{contact?.email || contact?.phoneNumber || ''}
									</div>
								</div>
							</div>
						</div>
						<div className="row-right">
							<div className="strength">
								{/* <span
                        className={`dot ${contact.strength.toLowerCase()}`}
                    ></span>
                    <span className="text">{contact.strength}</span> */}
							</div>
							<div className="interaction">
								{contact?.updatedAt
									? dayjs.unix(contact.updatedAt).fromNow() // Converts Unix seconds -> "14 days ago"
									: 'N/A'}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(ContactsListView);
