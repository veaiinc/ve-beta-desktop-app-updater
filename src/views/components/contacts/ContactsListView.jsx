import { memo } from 'react';
import '../../../assets/scss/contacts/contactsListView.scss';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ClockSvg } from '../../../assets/svg/contacts/clock.svg';
import { ReactComponent as SortDescSvg } from '../../../assets/svg/home_page/sortDesc.svg';
import { ReactComponent as SortAscSvg } from '../../../assets/svg/home_page/sortAsc.svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import { Tooltip } from 'antd';

dayjs?.extend(relativeTime);

const ContactsListView = ({ data, hasMore, fetchMore, onSort, sortType }) => {
	const navigate = useNavigate();

	const handleSortClick = () => {
		const newSortType = sortType === -1 ? 1 : -1;
		onSort?.(newSortType);
	};

	return (
		<div className="contacts-table">
			<div className="table-header">
				<div className="column people">Name/Email</div>
				<div className="column strength"></div>
				<div className="column interaction">
					<div className="interaction-header">
						Last Interaction <ClockSvg />
						<Tooltip
							placement="bottom"
							// title={<div className="tooltipTitle">Sort by created at</div>}
							color="transparent"
							arrow={false}
						>
							<div className="sort-by-created-at" onClick={handleSortClick}>
								{sortType === -1 ? <SortAscSvg /> : <SortDescSvg />}
							</div>
						</Tooltip>
					</div>
				</div>
			</div>
			<div className="table-body-container">
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
						<div className="table-body">
							{data?.map((contact) => (
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
											{contact?.updatedAt ? (
												<Tooltip
													title={`Last Interacted on: ${dayjs
														?.unix(contact?.updatedAt)
														?.format('DD MMM YYYY')}`}
												>
													<span>
														{dayjs?.unix(contact?.updatedAt)?.fromNow()}
													</span>
												</Tooltip>
											) : (
												'N/A'
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</InfiniteScroll>
				)}
			</div>
		</div>
	);
};

export default memo(ContactsListView);
