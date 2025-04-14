import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import moment from 'moment';
import { DocsStatusButton } from '../../features/docs/Docs';
const FormsGrid = ({ formsTemplatesList, statusTextmapper, setInfo, handleNavigateForm }) => {
	return (
		<div className={`card-container`}>
			<div className="card-item">
				<div className="card-item-style card-item-style-btn">
					<button
						className="card-btn"
						onClick={() => setInfo((prev) => ({ ...prev, openProposalPopup: true }))}
					>
						<Plus />
						Create Form
					</button>
				</div>
			</div>
			{formsTemplatesList?.data?.slice(0, 12).map((form, index) => (
				<div
					className="card-item"
					key={index}
					onClick={() => handleNavigateForm(form?._id)}
				>
					<div className="card-item-style content-wrapper docs">
						<DocsStatusButton
							content={statusTextmapper?.[form?.status]?.text}
							style={statusTextmapper?.[form?.status]?.style}
							dotStyle={statusTextmapper?.[form?.status]?.dotStyle}
						/>
						<div className="docs-title-wrapper docs-title-wrapper-form">
							<div className=""></div>
							<span className="docs-item-title">{form?.title.slice(0, 20)}</span>
							<span className="docs-item-sub-title">
								{moment.unix(form?.createdAt).fromNow()}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default FormsGrid;
