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

	return (
		<div className="tableContainer">
			<table>
				<thead>
					<tr>
						<th className="text-left">Name or Email</th>
						<th>{thead}</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					{loading
						? [...Array(5)].map((_, index) => (
								<tr key={index}>
									<td className="text-left">
										<Skeleton circle={true} height={36} width={36} />
										<div className="details">
											<Skeleton width={100} />
										</div>
									</td>
									<td>
										<Skeleton width={80} />
									</td>
									<td>
										<Skeleton width={80} />
									</td>
								</tr>
						  ))
						: tableData?.map((row, index) => (
								<tr key={index}>
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
				</tbody>
			</table>
		</div>
	);
};

export default Table;
