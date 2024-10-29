import React, { useState, useContext, useEffect } from 'react';
import { ReactComponent as CancelTag } from '../../../../assets/svg/gallery/cancel_tag.svg';
import Context from '../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from 'antd';

const AddLables = ({ info, setinfo }) => {
	const { galleryId, albumId } = useParams();
	const {
		galleryInfo: { tagsList, getGalleryTagsList, addGalleryTag, getImageDuplicatesList },
	} = useContext(Context);

	const [inputTag, setinputTag] = useState('');

	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		if (tagsList?.galleryId !== galleryId) {
			getGalleryTagsList(galleryId);
			getImageDuplicatesList(galleryId, albumId);
		} else {
			setinfo((prev) => ({ ...prev, selectedGalleryTags: tagsList?.list || [] }));
		}
	}, [tagsList, galleryId, albumId]);

	const addNewTagHandler = () => {
		if (!inputTag.trim().length) {
			messageApi.error('Tag cannot be empty');
			setinputTag('');
			return;
		}

		if (tagsList?.list.find((tag) => tag.displayName === inputTag)) {
			if (info?.selectedGalleryTags?.find((tag) => tag.displayName === inputTag)) {
				messageApi.warning('Tag already exists');
			} else {
				setinfo((prev) => ({
					...prev,
					selectedGalleryTags: [
						...prev.selectedGalleryTags,
						tagsList?.list.find((tag) => tag.displayName === inputTag),
					],
				}));
				setinputTag('');
			}

			return;
		}

		const json = {
			displayName: inputTag,
			slug: inputTag,
		};

		addGalleryTag(json, galleryId);
		setinputTag('');
	};

	const removeTagsFromSelectionList = (id) => {
		setinfo((prev) => ({
			...prev,
			selectedGalleryTags: prev.selectedGalleryTags.filter((tag) => tag._id !== id),
		}));
	};

	return (
		<div className="add-labels-container">
			{contextHolder}
			<div className="headerLabels">
				<h1>Add Labels</h1>
				<p>Categories your photos under different labels</p>
			</div>

			<div className="labels_tags_div">
				{info?.selectedGalleryTags
					?.filter((tag) => tag.displayName !== 'All')
					.map((singleTag) => (
						<div className="label_tag" key={singleTag?._id}>
							<p>{singleTag?.displayName}</p>
							<CancelTag
								onClick={() => removeTagsFromSelectionList(singleTag?._id)}
							/>
						</div>
					))}
			</div>

			<div className="add_label_div">
				<input
					type="text"
					placeholder="Add Label"
					value={inputTag}
					onChange={(e) => setinputTag(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && addNewTagHandler()}
				/>
			</div>
		</div>
	);
};

export default AddLables;
