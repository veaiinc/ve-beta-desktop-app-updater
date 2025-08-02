import { memo } from 'react';
import s from '../../../assets/scss/login_page/logindescription.module.scss';
import { loginLeftContents } from './constants';

const LoginDescription = () => (
	<div className={s.loginDescriptionContainer}>
		<div className={s.contentArea}>
			{loginLeftContents.map(
				(
					{ gap, marginBottom, content, title, boldText, name, titleGap, list, endText },
					index,
				) => (
					<div key={index} style={{ marginBottom, gap }} className={s.section}>
						{title && (
							<p className={s.title} style={{ marginBottom: titleGap }}>
								{title} {endText && <span className={s.endText}>{endText}</span>}
							</p>
						)}
						{boldText && <p className={s.boldText}>{boldText}</p>}
						{name && <p className={s.name}>{name}</p>}
						{list && (
							<ul>
								{list.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						)}
						{content &&
							content.map((item, parentIndex) =>
								item
									.split('\n')
									.map((line, index) => (
										<p key={`${parentIndex}-${index}`}>{line}</p>
									)),
							)}
					</div>
				),
			)}
		</div>
	</div>
);

export default memo(LoginDescription);
