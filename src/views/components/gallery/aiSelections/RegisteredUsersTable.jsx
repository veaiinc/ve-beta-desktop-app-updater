import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../../../assets/scss/gallery/table.scss';

const Table = ({ tableData, thead, loading }) => {
	const formatDate = (timestamp) => {
		if (!timestamp) return '';

		const date = new Date(timestamp * 1000);

		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};
	const LoadingSkeleton = () =>
		[...Array(5)].map((_, index) => (
			<tr key={`skeleton-${index}`}>
				<td style={{ display: 'flex', alignItems: 'center' }}>
					<Skeleton circle width={36} height={36} />
					<Skeleton width={150} />
				</td>
				<td>
					<Skeleton width={80} />
				</td>
				<td>
					<Skeleton width={100} />
				</td>
			</tr>
		));

	return (
		<div className="tableContainer" id="table-scroll-container">
			<table>
				<thead>
					<tr>
						<th className="text-left">Name or Email</th>
						<th>{thead}</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					{loading && !tableData?.data?.length ? (
						<LoadingSkeleton />
					) : tableData?.data?.length === 0 ? (
						<tr>
							<td colSpan="3" className="no-data">
								<div className="no-data-content">
									<p>No registered users yet</p>
								</div>
							</td>
						</tr>
					) : (
						<>
							{tableData?.data?.map((row, index) => (
								<tr key={`row-${index}`}>
									<td className="text-left">
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: '36px',
												height: '36px',
												background: '#6055EC',
												borderRadius: '50%',
												color: 'white',
											}}
										>
											{row.email ? row.email.charAt(0).toUpperCase() : 'A'}
										</div>
										<div className="details">
											<p>{row?.email || 'Anonymous'}</p>
										</div>
									</td>
									<td>
										{row.registrationStage === 'registered'
											? 'Registered'
											: 'In Progress'}
									</td>
									<td>{formatDate(row.createdAt)}</td>
								</tr>
							))}
							{loading && <LoadingSkeleton />}
						</>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
