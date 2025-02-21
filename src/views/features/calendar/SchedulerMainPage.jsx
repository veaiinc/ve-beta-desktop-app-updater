import React, { memo } from 'react';
import '../../../assets/scss/scheduler/schedulerMainPage.scss';
import ToggleSwitch from '../../components/input/slider';

const sessionGridItems = [
	{
		id: 1,
		title: 'Yoga Session',
		duration: '45 minutes',
		price: 'Rs.3200',
		location: 'Moonshine Studio, Banjara hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: true,
	},
	{
		id: 2,
		title: 'Meditation Class',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 3,
		title: 'Technical Class',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 4,
		title: 'Clasical Session',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 5,
		title: 'Dance Session',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
	{
		id: 6,
		title: 'Nutrition Class',
		duration: '30 minutes',
		price: 'Rs.2500',
		location: 'Peace Studio, Jubilee Hills',
		image: 'https://images.pexels.com/photos/8471810/pexels-photo-8471810.jpeg?auto=compress&cs=tinysrgb&w=1200',
		isActive: false,
	},
];

const SchedulerMainPage = () => {
	return (
		<div className="schedulerMainPageParentContainer">
			<div className="calendarHeaderContainer">
				<div className="calendarHeaderTitle">
					<span>Manage</span> Your Sessions
				</div>
				<div className="calendarHeaderSubTitle">
					Effortlessly manage your time with AI scheduling.
				</div>
			</div>

			<div className="schedulerMainPageContainer">
				<div className="sessionGridParentContainer">
					<div className="sessionGridContainer addNewSession">
						<div>+ New session</div>
					</div>
					{sessionGridItems?.map((item) => (
						<div className="sessionGridContainer" key={item.id}>
							<div className="sessionGridItem">
								<div className="sessionImage">
									<img src={item?.image} alt={item.title} />
								</div>
								<div className="sessionContent">
									<div className="sessionHeader">
										<h3>{item.title}</h3>
										<ToggleSwitch
											checked={item.isActive}
											onChange={() => {
												console.log('toggle');
											}}
										/>
									</div>
									<div className="sessionInfo">
										<div className="duration">{item.duration}</div>
										<div className="price">{item.price}</div>
									</div>
									<div className="location">{item.location}</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="sessionAvailabelTime">Time Slots</div>
			</div>
		</div>
	);
};

export default memo(SchedulerMainPage);
