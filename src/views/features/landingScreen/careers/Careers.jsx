import { memo } from 'react';
import s from './careers.module.scss';
import { paraContent1, paraContent2, categories, jobs } from './constants';
import { useState, useMemo } from 'react';

const careerPageLink = 'https://veai.ve.ai/552ysrgj';
const ContentCreator = 'https://veai.ve.ai/lo3x3v26';

const Careers = () => {
	const [info, setInfo] = useState({
		category: 'All career',
	});

	const handleSetNewCategory = (category) => {
		setInfo((prev) => ({
			...prev,
			category,
		}));
	};

	// Filter jobs based on selected category
	const filteredJobs = useMemo(() => {
		if (info.category === 'All career') {
			return jobs;
		}
		return jobs.filter((job) => job.category === info.category);
	}, [info.category]);

	return (
		<main className={s.careersContainer}>
			<section className={s.topContent}>
				<h1 className={s.mainHeading}>Careers</h1>
				{paraContent1.map((para, index) => (
					<p key={`para-${index}`} className={s.paragraph}>
						{para}
					</p>
				))}
			</section>
			<section className={s.howWeWork}>
				<h2>How we work</h2>
				{paraContent2.map((para, index) => (
					<p key={`para-${index}`} className={s.paragraph}>
						{para}
					</p>
				))}
			</section>
			<article className={s.divider}></article>
			<section className={s.joinUs}>
				<h2>Join us</h2>
				<p className={s.description}>
					Build ambient intelligence that empowers the way people work.
				</p>
			</section>
			<section className={s.categories}>
				{categories.map((category, index) => (
					<p
						key={`category-${index}`}
						className={`${s.category} ${info.category === category ? s.active : ''}`}
						onClick={() => handleSetNewCategory(category)}
					>
						{category}
					</p>
				))}
			</section>

			<section className={s.jobContainer}>
				{filteredJobs.length > 0 ? (
					filteredJobs.map((job, index) => (
						<article key={`job-${index}`} className={s.job}>
							<div className={s.left}>
								<p className={s.jobTitle}>{job.title}</p>
								<p className={s.jobDescription}>{job.description}</p>
							</div>
							<div className={s.right}>
								<a
									href={
										job.title === 'In-House Content Creator'
											? ContentCreator
											: careerPageLink
									}
									target="_blank"
								>
									Apply
								</a>
							</div>
						</article>
					))
				) : (
					<div className={s.noJobsMessage}>
						<p>No positions available in {info.category} at the moment.</p>
						<p>Please check back later or explore other categories.</p>
					</div>
				)}
			</section>
		</main>
	);
};

export default memo(Careers);
