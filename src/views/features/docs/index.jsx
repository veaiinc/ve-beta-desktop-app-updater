import React, { memo } from 'react';
import '../../../assets/scss/docs/index.scss';
import { ReactComponent as Files } from '../../../assets/svg/docs/files.svg';
import { fetchOriginSelection } from '../../../helpers';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import FilesListView from './FilesListView';
let origin = fetchOriginSelection();
const Docs = () => {
	const onGenerateAIFunc = () => {
		window.location.href = `${origin}/generate`;
	};
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
									src="https://s3-alpha-sig.figma.com/img/d123/7039/e9657c701b29d41ded85c753bf7bb901?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Nh1szCywYF9uaxvrAlbwwEW7iKRl51m66dYFTwTnpwooc0ui7rZ6PgxjDHCpLGjP38fK1WErgeG9LxVxcRibSZpcm6No9vI-XpkdEmFvvctLsA6M9O1TJJi917wgV91FO8Io30dAQg1GCjUmzOmY5F1Ci8BzkMuTlO9M72c0BP3Z4CSum6QPEJm4GVhFYF-D-nEfl6jYu3X9xzYEf7f4SeRYBRRO~PS5zOKYrhVENZmiKcmnCfRPgNsmHQPPjBSO1Bhq3ba-lS0GQLNF9T~R-zppNvYKJYnPn6BEFVtHB7KAg4YirBdtqrTJMGx356~Hy3t4qg-oY5J7b0WqZ7D1sQ__"
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
			</div>
			<div className="docsFooterContainer">
				<FilesListView />
			</div>
		</div>
	);
};

export default memo(Docs);
