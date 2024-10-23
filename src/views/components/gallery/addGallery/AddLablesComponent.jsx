import React from 'react';
import { ReactComponent as CancelTag } from '../../../../assets/svg/gallery/cancel_tag.svg';

const labels = ['Portrait', 'Documentary', 'Decor', 'Decor'];
const AddLables = () => {
	return (
		<div className="add-labels-container">
			<div className="headerLabels">
				<h1>Add Labels</h1>
				<p>Categories your photos under different labels</p>
			</div>

			<div className="labels_tags_div">
				{labels?.map((singleTag, index) => (
					<div className="label_tag" key={'tag' + index}>
						<p>{singleTag}</p>
						<CancelTag />
					</div>
				))}
			</div>

			<div className="add_label_div">
				<p>Add Label</p>
			</div>
		</div>
	);
};

export default AddLables;
