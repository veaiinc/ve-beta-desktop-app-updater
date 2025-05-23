import React, { memo } from 'react';
import { ReactComponent as DownloadSvg } from '../../../../assets/svg/Settings/Download.svg';

const DataList = [
	{ subcription: 'Free Plan', date: '20 Sept 2024', status: 'Free', amount: 0 },
	{ subcription: 'Essential pack', date: '20 Sept 2024', status: 'Paid', amount: 35 },
];

const BillingHistoryComponent = () => {
	return (
		<>
			<div className="historyHeader">
				<div className="details">
					<h1>Billing History</h1>
				</div>
			</div>

			<div className="billingList">
				<table>
					<thead>
						<tr>
							<th>Subscription</th>
							<th>Date</th>
							<th>Status</th>
							<th>Amount</th>
							<th>PDF</th>
						</tr>
					</thead>
					<tbody>
						{[].map((data, index) => (
							<tr key={index}>
								<td className="subscription">
									{data.subcription}
									<br />

									{data?.status !== 'Free' && (
										<span children className="viewDetails">
											View Details
										</span>
									)}
								</td>
								<td>{data.date}</td>
								<td>
									<div className="status">
										<div
											className="point"
											style={{
												background:
													data?.status === 'Free' ? '#6055EC' : '#479A5F',
											}}
										></div>{' '}
										<p>{data.status}</p>{' '}
									</div>
								</td>
								<td className="amount"> ${data.amount}</td>
								<td>
									<span>
										<DownloadSvg />
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default memo(BillingHistoryComponent);
