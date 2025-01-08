import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/docs/index.scss';
import { ReactComponent as Files } from '../../../assets/svg/docs/files.svg';
import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import FilesListView from './FilesListView';
import Context from '../../../context/context';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { calc } from 'antd/es/theme/internal';
import Sidebar from '../../components/docs/Sidebar';
let origin = fetchOriginSelection();

const staticCreateActions = [
	{
		title: 'Create Smart File',
		subtext: 'Create a tailored smart file and present it to your clients.',
	},
	{
		title: 'Create Proposal',
		subtext: 'Create a tailored business proposal and present it to your clients.',
	},
	{
		title: 'Create Presentation',
		subtext: 'Create a tailored business proposal and present it to your clients.',
	},
	{
		title: 'Create Invoice',
		subtext: 'Track invoice status, Payment schedule, amounts, and more.',
	},
	{ title: 'Create Contract', subtext: 'Stay on top of contracts and signatures.' },
	{ title: 'Create Landing Page', subtext: 'Create and share a landing page with clients.' },
];

const statusTextmapper = {
	filesViewed: {
		text: 'Files Viewed',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
	},
	enquiry: {
		text: 'Enquiry',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
	},
	filesSent: {
		text: 'Sent',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
	},
	confirmed: {
		text: 'Confirmed',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
	},
	expired: {
		text: 'Expired',
		dotStyle: {
			backgroundColor: '#E27B1C',
		},
		style: {
			backgroundColor: 'rgba(125, 79, 39, 1)',
		},
	},
	accepted: {
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
	},
	proposalAccepted: {
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
	},
};
const DocsStatusButton = ({ content = '', style = {}, textStyle = {}, dotStyle = {} }) => {
	return (
		<div className="DocsStatusButtonOuterContainer" style={{ ...style }}>
			<div className="DocsStatusCircle" style={{ ...dotStyle }}></div>
			<span className="DocsButtontext" style={{ ...textStyle }}>
				{content}
			</span>
		</div>
	);
};
const Docs = () => {
	let {
		templates: { getDocsFilesList, updateStateValues, docsFilesList, moreDocsFilesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		currentPage: 1,
		hasNextPage: false,
		loading: true,
		docsData: [],
		showRightDrawer: false,
		activeFileData: null,
	});

	useEffect(() => {
		getDocsFilesListFunc(1);
	}, []);

	useEffect(() => {
		if (docsFilesList) {
			parseDocsFilesListDeatils(docsFilesList, false);
		}
	}, [docsFilesList]);

	useEffect(() => {
		if (moreDocsFilesList) {
			parseDocsFilesListDeatils(moreDocsFilesList, true);
		}
	}, [moreDocsFilesList]);

	const onGenerateAIFunc = () => {
		window.location.href = `${origin}/generate`;
	};

	const getDocsFilesListFunc = useCallback(async (page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 30,
				page: page,
			},
		};

		getDocsFilesList(payload, fetchMore);
	}, []);

	const fetcMoreDocsFilesList = useCallback(async () => {
		getDocsFilesListFunc(info?.currentPage + 1, true);
	}, [info?.currentPage]);

	const parseDocsFilesListDeatils = useCallback(async (variableType, fetchMore = false) => {
		let { hasNextPage, currentPage, data } = variableType || {};

		setInfo((prev) => ({
			...prev,
			loading: false,
			docsData: fetchMore ? prev?.docsData?.concat(data) : data,
			currentPage,
			hasNextPage,
		}));
	}, []);

	const handleOpenSidebar = useCallback((data) => {
		setInfo((prev) => ({ ...prev, showRightDrawer: true, activeFileData: data }));
	}, []);

	const handleCloseSidebar = useCallback(() => {
		setInfo((prev) => ({ ...prev, showRightDrawer: false, activeFileData: null }));
	}, []);

	return (
		<div className="docsParentContainer">
			<div className="docsParentHeaderContainer">
				<div className="docsHeaderButtons colorful" onClick={onGenerateAIFunc}>
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitleColored">Start with AI</div>
				</div>
				<div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Pick your template from your playbook
					</div>
				</div>
				<div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Create proposal from your template</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Upload your files, our AI will generate tailored proposal for you
					</div>
				</div>
			</div>
			<div className="docsTemplatesContainer">
				<div className="docsTemplateContainer">
					{staticCreateActions?.map((ele, index) => (
						<div key={index} className="createStaticActionsCards">
							<span className="createStaticActionsCardsTitle">{ele?.title}</span>
							<span className="createStaticActionsCardsSubTitle">{ele?.subtext}</span>
						</div>
					))}
				</div>
			</div>

			<div className="docsFileContainer">
				<div className="docsFileHeaderContainer">
					<span className="docsFileHeaderContainerTitle">Files</span>
				</div>
				<div className="docsFilesInfiiniteContainer">
					<InfiniteScroll
						dataLength={info?.docsData?.length || 0}
						next={fetcMoreDocsFilesList}
						hasMore={info?.hasNextPage}
						loader={<FetchMoreLoaderComp />}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							width: '100%',
						}}
						className="tetsing"
						height="calc(100vh - 500px)"
					>
						{info?.docsData?.map((ele, index) => (
							<div
								className="docsRow"
								key={index}
								onClick={() => handleOpenSidebar(ele)}
							>
								<div className="docsFilesRowTitle">{ele?.title}</div>
								<div className="docsKeyWordsContainer">
									{ele?.clientDetails?.name ? (
										<span className="docsclientdetailsName">
											{ele?.clientDetails?.name}
										</span>
									) : (
										''
									)}

									<DocsStatusButton
										content={statusTextmapper?.[ele?.status]?.text}
										style={statusTextmapper?.[ele?.status]?.style}
										dotStyle={statusTextmapper?.[ele?.status]?.dotStyle}
									/>
								</div>
							</div>
						))}
					</InfiniteScroll>
				</div>

				<Sidebar
					open={info?.showRightDrawer}
					onClose={handleCloseSidebar}
					activeFileData={info?.activeFileData}
				/>
			</div>
		</div>
	);
};

export default memo(Docs);
{
	/* <div className="docsTemplatesContainer">
				<div className="docsTemplatesContainerHeader">
					Create new file from your existing templates
					<div className="docsTemplatesAllFilesContainer">
						<Files />
						All files
					</div>
				</div>

				<div className="docsTemplateContainer">
					{[{}, {}, {}, {}, {}, {}, {}, {}]?.map((ele, index) => (
						<div key={index} className="docsTemplateCard">
							<div className="docsTemplateImageContainer">
								<div className="docsTemplateHoverContentContainer">
									<div className="docsHoverArrowContainer">
										<UpArrow />
									</div>
									<div className="docsHoverOptionsContainer">
										<span className="docsHoverOptionsStyling">Create File</span>
										<span className="docsHoverOptionsStyling">Edit Design</span>
										<span className="docsHoverOptionsStyling">Duplicate</span>
										<span className="docsHoverOptionsStyling">Delete</span>
									</div>
								</div>
								<img
									src="https://s3-alpha-sig.figma.com/img/15b6/6719/e9a63a81d478a52552ed98ac31e7a2b6?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AHd93og5SQiiQLECz4ZuNCrzERGP~NAz3qk7eS5Sfl2rnN0oWzjo~8CgS5fNWE5Knb5s0yTjbQ7uXSeHW6H8J3E1eSneLfc0U9057RjAp0VEqJ-evjzPJjlrXdlli85n2yZM7obW8hfc~8-9MlR57xLGtWobCP7v50apSuXv~1NXhnucgryS87p1CZyKsZZ1Ro-JHIDtSqRygCQDk7N~x2ZS0u5JL6cEZF~nC0oZdxR73cBZ1yBbIG~CYAqEdojkRWVcoOYkPROyviNf-vIl8O3kRvgvVLXAgH7WeebcdHwODd4LeNcCXL7uhHAfZPRwvTeKbq4NW9MarD7lglA2cw__"
									alt="Template preview"
								/>
							</div>
							<div className="docsFooterContent">
								<span className="docsFooterContentTitle">
									Jaylon Korsgaard Wedding Proposal
								</span>
								<span className="docsFooterContentSubTitle">created 14 files</span>
							</div>
						</div>
					))}
				</div>
			</div> */
}
