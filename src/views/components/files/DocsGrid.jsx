import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import moment from 'moment';
import { DocsStatusButton } from '../../features/docs/Docs';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { useNavigate } from 'react-router-dom';
import { memo, useContext, useEffect, useState } from 'react';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import Context from '../../../context/context';
const DocsGrid = ({ statusTextmapper, handleCreateDoc }) => {
	const navigate = useNavigate();

	const {
		templates: { getDocsFilesList, docsFilesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		docs: [],
		hasNextPage: false,
		currentPage: 1,
	});

	useEffect(() => {
		if (docsFilesList) {
			const { currentPage = 1, hasNextPage = false, data = [] } = docsFilesList;
			const newDocs = currentPage === 1 ? [...data] : [...info?.docs, ...(data || [])];
			handleStateUpdate({ docs: newDocs, currentPage, hasNextPage });
		}
	}, [docsFilesList]);

	useEffect(() => {
		fetchDocs({ page: 1 });
	}, []);

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const fetchDocs = async ({ page = 1, limit = 10 }) => {
		try {
			const payload = {
				filters: {
					limit,
					page,
				},
			};
			await getDocsFilesList(payload, false);
		} catch (error) {
			console.error('Error fetching docs:', error);
		}
	};

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		fetchDocs({ page: info?.currentPage + 1 });
	};

	return (
		<InfiniteScroll
			dataLength={info?.docs?.length}
			next={fetchMore}
			hasMore={info?.hasNextPage}
			height={'100%'}
		>
			<div className={`card-container`}>
				<div className="card-item" onClick={handleCreateDoc}>
					<div className="card-item-style card-item-style-btn">
						<button className="card-btn">
							<Plus />
							Create Document
						</button>
					</div>
				</div>
				{info?.docs?.map((doc, index) => (
					<div
						className="card-item"
						key={index}
						onClick={() => navigate(`/doc/${doc?._id}`)}
					>
						<div className="card-item-style content-wrapper docs">
							<div className="docs-preview"></div>
							<DocsStatusButton
								content={statusTextmapper?.[doc?.status]?.text}
								style={statusTextmapper?.[doc?.status]?.style}
								dotStyle={statusTextmapper?.[doc?.status]?.dotStyle}
							/>
							<div className="docs-title-wrapper">
								<span className="docs-item-title">{doc?.title}</span>
								<span className="docs-item-sub-title">
									{moment.unix(doc?.createdAt).fromNow()}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};

export default memo(DocsGrid);
