import React, { Component } from 'react';

import '../../../assets/scss/login.scss';
import { ReactComponent as Logo } from '../../../assets/svg/huemn.svg';
import { ReactComponent as Magic } from '../../../assets/svg/magic.svg';
// import LoginImg from '../../../assets/images/loginImage.jpg';
// import BackgroundImage1 from '../../../assets/svg/login_backgrounds/login_background_1.svg';
// import BackgroundImage2 from '../../../assets/svg/login_backgrounds/login_background_2.svg';
// import BackgroundImage3 from '../../../assets/svg/login_backgrounds/login_background_3.svg';
// import BackgroundImage4 from '../../../assets/svg/login_backgrounds/login_background_4.svg';
// import BackgroundImage5 from '../../../assets/svg/login_backgrounds/login_background_5.svg';
// import BackgroundImage6 from '../../../assets/svg/login_backgrounds/login_background_6.svg';
// import BackgroundImage7 from '../../../assets/svg/login_backgrounds/login_background_7.svg';
// import BackgroundImage8 from '../../../assets/svg/login_backgrounds/login_background_8.svg';
import Slider from 'react-slick';
import _ from 'lodash';
const modulesContent = [
	{
		title: 'Get started with Projects!',
		content:
			'Our project management tool offers a thorough overview of every project from beginning to end and was created with photographers in mind. Our platform enables you to distribute assignments and due dates to team members, monitor development in real-time, and get alerts when tasks are finished. This enables you to maintain control over every element of your projects and guarantee that everything is finished on schedule.',
		images: [
			'/emptyStateSliders/projectsList/1.png',
			'/emptyStateSliders/projectsList/2.png',
			'/emptyStateSliders/projectsList/3.png',
			'/emptyStateSliders/projectsList/4.png',
			'/emptyStateSliders/projectsList/5.png',
		],
	},
	{
		title: 'Get started with Shoots!',
		content:
			'As a photographer, you are aware that every event is different and presents a different set of chances and obstacles. To ensure that everything goes as planned, its crucial to have a thorough plan in place. To address this issue, our programme provides a number of functions, such as the ability to make shoot lists, allocate crew, collect all the necessary information—even client reporting time—manage lighting and equipment, and keep tabs on spending. This helps you to deliver great results to your clients, while staying within budget.',
		images: [
			'/emptyStateSliders/shoots/1.png',
			'/emptyStateSliders/shoots/2.png',
			'/emptyStateSliders/shoots/3.png',
		],
	},
	{
		title: 'Get started with Deliverables!',
		content:
			'Our platform enables you to distribute assignments and due dates to team members, monitor development in real-time, and get alerts when tasks are finished. This enables you to maintain control over every element of your projects and guarantee that everything is finished on schedule.',
		images: [
			'/emptyStateSliders/deliverables/1.png',
			'/emptyStateSliders/deliverables/2.png',
			'/emptyStateSliders/deliverables/3.png',
		],
	},
	{
		title: 'Get started with Tasks!',
		content:
			'You can assign tasks to team members, establish deadlines, and monitor development in real-time with our platform. Each project can have a unique process that keeps everyone informed about what has to be done and when.',
		images: ['/emptyStateSliders/tasks/1.png', '/emptyStateSliders/tasks/2.png'],
	},

	{
		title: 'Get started with Forms!',
		content:
			'Make the most of every opportunity with our customizable lead forms for photographers. Whether you`re looking to capture potential clients at events, on your website, or through social media, our forms are designed to help you gather the information you need to turn leads into loyal customers. With options to customize fields, branding, and more, our lead forms are the perfect way to streamline your lead collection process and take your photography business to the next level.',
		images: [
			'/emptyStateSliders/forms/1.png',
			'/emptyStateSliders/forms/2.png',
			'/emptyStateSliders/forms/3.png',
			'/emptyStateSliders/forms/4.png',
		],
	},
	{
		title: 'Get started with Proposals!',
		content:
			'You can easily build and distribute personalised quotations and invoices using our user-friendly platform. As our templates were created especially for photographers, you can be confident that your documents will appear well-put-together and expert.',
		images: [
			'/emptyStateSliders/proposals/1.png',
			'/emptyStateSliders/proposals/2.png',
			'/emptyStateSliders/proposals/3.png',
		],
	},
	{
		title: 'Get started with Expenses!',
		content:
			'Our software offers a range of features to enhance your financial management, including Team Expense as well as Client Expense tracking and reporting. This helps you to stay on top of your finances and make informed decisions about your business.',
		images: ['/emptyStateSliders/expenses/1.png', '/emptyStateSliders/expenses/2.png'],
	},
];
class PublicLayout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			randomContent: modulesContent[Math.floor(Math.random() * 7)],

			images: [],
		};
	}

	render() {
		const settings = {
			className: 'center',
			centerMode: true,
			infinite: true,
			centerPadding: '154px',
			slidesToShow: 2,
			autoplay: true,
			speed: 1000,
			dots: true,
			responsive: [
				{
					breakpoint: 1600,
					settings: {
						centerPadding: '4px',
					},
				},
			],
		};

		return (
			<div className="container">
				<div className={'leftContainer'}>
					<div className="login-content">
						<div className="feature">feature</div>
						<>
							<h2>{this.state.randomContent['title']}</h2>
							<p>{this.state.randomContent['content']}</p>
							<div className="login-slider">
								<Slider {...settings}>
									{_.map(this.state.randomContent['images'], (image, key) => {
										return (
											<div className="img">
												<img src={image} />
											</div>
										);
									})}
								</Slider>
							</div>
						</>
						<span>
							<Magic />
						</span>
						<h4>
							Take full advantage of your powerful tool. Learn more about features in
							Huemn
						</h4>
						<a
							href={'https://intercom.help/huemn/en/'}
							target={'_blank'}
							rel="noreferrer"
						>
							learn more
						</a>
					</div>
				</div>
				<div className={'rightContainer'}>
					<div
						className={'focus-container'}
						style={{
							display:
								_.has(this.props, 'signUp') && this.props.signUp ? 'block' : '',
						}}
					>
						<div className={'logo-container'}>
							<Logo />
						</div>

						<div className={'create-password-container'}>
							{this.props.subTitle ? (
								<p className="h1">
									{this.props.subTitle ? this.props.subTitle : ''}
								</p>
							) : (
								''
							)}
							{this.props.subText ? (
								<p className={'password-text'}>{this.props.subText}</p>
							) : (
								''
							)}
						</div>

						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default PublicLayout;
