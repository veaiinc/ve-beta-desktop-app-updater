import { memo } from 'react';
import '../../../assets/scss/contacts/contactsWidgetView.scss';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as PhoneSvg } from '../../../assets/svg/contacts/phone.svg';
import { ReactComponent as EmailSvg } from '../../../assets/svg/activity/email.svg';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';

const ContactsWidgetView = ({ data, hasMore = false, fetchMore }) => {
	const navigate = useNavigate();

	const handleEmailClick = (e, email) => {
		e?.stopPropagation();
		window.location.href = `mailto:${email}`;
	};
	const handlePhoneClick = (e, phone) => {
		e?.stopPropagation();
		window?.open(`tel:${phone}`, '_blank');
	};
	return (
		<div className="contacts-widget-view">
			{data?.length === 0 ? (
				<div className="no-contacts-found">No contacts found</div>
			) : (
				<InfiniteScroll
					dataLength={data?.length || 0}
					next={fetchMore}
					hasMore={hasMore}
					loader={<FetchMoreLoaderComp />}
					style={{
						height: '100%',
						overflow: 'auto',
					}}
				>
					<div className="widgets">
						{data?.map((contact) => (
							<div
								className="contact-widget"
								key={contact?._id}
								onClick={() => {
									navigate(`/contact/${contact?._id}`);
								}}
							>
								<div className="person-image">
									<PersonSvg width={32} height={32} />
								</div>
								<div className="person-info">
									<div className="info-container">
										<div className="person-name">{contact?.name || ''}</div>
										<div className="person-email">
											{contact?.email || contact?.phoneNumber || ''}
										</div>
									</div>
									<div className="icons-container">
										{contact?.email &&
											/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) && (
												<div
													className="icon-container"
													onClick={(e) =>
														handleEmailClick(e, contact?.email)
													}
												>
													<EmailSvg width={20} height={20} />
												</div>
											)}
										{contact?.phoneNumber &&
											/^\+?[1-9]\d{1,14}$/.test(
												contact.phoneNumber.replace(/\s|-/g, ''),
											) && (
												<div
													className="icon-container"
													onClick={(e) =>
														handlePhoneClick(e, contact?.phoneNumber)
													}
												>
													<PhoneSvg
														width={20}
														height={20}
														fill="var(--primary-font)"
													/>
												</div>
											)}
									</div>
								</div>
							</div>
						))}
					</div>
				</InfiniteScroll>
			)}
		</div>
	);
};

export default memo(ContactsWidgetView);
