import { memo } from 'react';
import s from '../../../assets/scss/login_page/logindescription.module.scss';
import { loginDescriptionContent } from './constants';

const LoginDescription = () => {
	return (
		<div className={s.loginDescriptionContainer}>
			<div className={s.loginDescriptionText}>
				{loginDescriptionContent.descriptionText.map((text, index) => (
					<p key={index}>{text}</p>
				))}
			</div>
			<div className={s.loginDescriptionText2}>
				{loginDescriptionContent.descriptionText2.map((text, index) => (
					<p key={index}>{text}</p>
				))}
			</div>
			<div className={s.loginDescriptionText3}>
				{loginDescriptionContent.descriptionText3.map((text, index) => (
					<p key={index}>{text}</p>
				))}
			</div>
			<div className={s.loginDescriptionTwo}>
				<div className={s.loginDescriptionTwoText}>
					{loginDescriptionContent.descriptionTwo.title
						.split('Promise.')
						.map((part, index) =>
							index === 0 ? (
								<p key={index}>
									{part}
									<span>Promise.</span>
								</p>
							) : null,
						)}
				</div>
				<ul>
					{loginDescriptionContent.descriptionTwo.features.map((feature, index) => (
						<li key={index}>{feature}</li>
					))}
				</ul>
			</div>
			<div className={s.loginDescriptionThree}>
				{loginDescriptionContent.descriptionThree}
			</div>
			<div className={s.loginDescriptionFour}>
				<div className={s.descriptionFourTitle}>
					{loginDescriptionContent.descriptionFour.title}
				</div>
				<div className={s.descriptionFourPoints}>
					<ul>
						{loginDescriptionContent.descriptionFour.points.map((point, index) => (
							<li key={index}>{point}</li>
						))}
					</ul>
				</div>
			</div>
			<div className={s.bottomText}>{loginDescriptionContent.bottomText}</div>
		</div>
	);
};

export default memo(LoginDescription);
