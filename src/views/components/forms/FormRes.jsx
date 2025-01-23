import React, { useState, useEffect, memo } from 'react';
import '../../../assets/scss/forms/formRes.scss';

const data = [
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Roshan@gmail.com',
		rating: '4',
		overall: 'Excellent',
		consistency: 'Very poor',
		question4: 'Other: Personal reasons',
		question5: 'Owenership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Ankit1234567890fsugcajs...',
		rating: '4',
		overall: 'Excellent',
		consistency: 'Very poor',
		question4: 'Other: Personal reasons',
		question5: 'Owenership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Harsha@gmail.com',
		rating: '8',
		overall: 'Very Good',
		consistency: 'Nice',
		question4: 'Due to Time',
		question5: 'Partnership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Incomplete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Avinash@gmail.com',
		rating: '8',
		overall: 'Very Bad',
		consistency: 'Good',
		question4: 'Due to Location',
		question5: 'Partnership',
		question6: 'Good',
	},
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Ismail@gmail.com',
		rating: '10',
		overall: 'Very Bad',
		consistency: 'Very Good',
		question4: 'Other: Personal reasons',
		question5: 'Owenership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Incomplete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Ismail@gmail.com',
		rating: '10',
		overall: 'Very Bad',
		consistency: 'Very Good',
		question4: 'Due to Location',
		question5: 'Partnership',
		question6: 'Very Good',
	},
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Roshan@gmail.com',
		rating: '4',
		overall: 'Excellent',
		consistency: 'Very poor',
		question4: 'Other: Personal reasons',
		question5: 'Owenership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Ankit1234567890fsugcajs...',
		rating: '4',
		overall: 'Excellent',
		consistency: 'Very poor',
		question4: 'Other: Personal reasons',
		question5: 'Owenership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Harsha@gmail.com',
		rating: '8',
		overall: 'Very Good',
		consistency: 'Nice',
		question4: 'Due to Time',
		question5: 'Partnership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Incomplete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Avinash@gmail.com',
		rating: '8',
		overall: 'Very Bad',
		consistency: 'Good',
		question4: 'Due to Location',
		question5: 'Partnership',
		question6: 'Good',
	},
	{
		status: 'Complete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Ismail@gmail.com',
		rating: '10',
		overall: 'Very Bad',
		consistency: 'Very Good',
		question4: 'Other: Personal reasons',
		question5: 'Owenership',
		question6: 'Very Satisfied',
	},
	{
		status: 'Incomplete',
		submission: 'Sept 28, 09:28 AM',
		uniqueId: 'Ismail@gmail.com',
		rating: '10',
		overall: 'Very Bad',
		consistency: 'Very Good',
		question4: 'Due to Location',
		question5: 'Partnership',
		question6: 'Very Good',
	},
];

const FormRes = () => {
	const [info, setInfo] = useState({
		resizing: null,
		columns: [
			{ id: 'status', width: 120, label: 'Status' },
			{ id: 'submission', width: 150, label: 'Submission' },
			{ id: 'uniqueId', width: 200, label: 'Unique ID' },
			{ id: 'rating', width: 220, label: 'Rate your overall personali...' },
			{ id: 'overall', width: 200, label: 'How much do you rate yo...' },
			{ id: 'consistency', width: 180, label: 'How consistent you are?' },
			{ id: 'question4', width: 180, label: 'Question 4' },
			{ id: 'question5', width: 150, label: 'Question 5' },
			{ id: 'question6', width: 150, label: 'Question 6' },
		],
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

	const handleMouseDown = (index, e) => {
		setInfo({
			...info,
			resizing: {
				index,
				startX: e.pageX,
				startWidth: info?.columns[index]?.width,
			},
		});
	};

	const handleMouseMove = (e) => {
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
	};

	const handleMouseUp = () => {
		setInfo((prev) => ({
			...prev,
			resizing: null,
		}));
	};

	return (
		<div className="formResParentContainer">
			<div className="tableWrapper">
				{/* <div className="gradientHeader" /> */}
				<div className="tableContent">
					<div className="headerRow">
						{info?.columns?.map((column, index) => (
							<div
								key={column?.id}
								className="headerCell"
								style={{ width: column?.width }}
							>
								<div className="cellContent">{column?.label}</div>
								<div
									className="resizeHandle"
									onMouseDown={(e) => handleMouseDown(index, e)}
								/>
							</div>
						))}
					</div>
					<div className="tableBody">
						{data.map((row, rowIndex) => (
							<div key={rowIndex} className="tableRow">
								{info?.columns?.map((column) => (
									<div
										key={column.id}
										className="tableCell"
										style={{ width: column.width }}
									>
										{column.id === 'status' ? (
											<span
												className={`statusBadge ${
													row[column.id] === 'Complete'
														? 'complete'
														: 'incomplete'
												}`}
											>
												{row[column.id]}
											</span>
										) : (
											row[column.id]
										)}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(FormRes);
