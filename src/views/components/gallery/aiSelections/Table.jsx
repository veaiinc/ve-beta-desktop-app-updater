import React, { memo } from 'react';
import '../../../../assets/scss/gallery/table.scss';

const Table = ({ tableData, thead }) => {
	return (
		<div className="tableContainer">
			<table>
				<thead>
					<tr>
						<th className="text-left">Name & Email</th>
						<th>Mobile Number</th>
						<th>{thead}</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					{tableData.map((row, index) => (
						<tr key={index}>
							<td className="text-left">
								<div
									style={{
										width: '36px',
										height: '36px',
										background: '#6055EC',
										borderRadius: '50%',
									}}
								></div>
								<div className="details">
									<p>{row.name}</p>
									<p>{row?.email}</p>
								</div>
							</td>
							<td>{row.mobileNumber}</td>
							<td>{row.registerStage}</td>
							<td>{row.date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default memo(Table);
