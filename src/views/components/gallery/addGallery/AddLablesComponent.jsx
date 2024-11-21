import React, { useState, useContext, useEffect } from 'react';
import { ReactComponent as CancelTag } from '../../../../assets/svg/gallery/cancel_tag.svg';
import Context from '../../../../context/context';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Select } from 'antd';
import slugify from 'slugify';
const AddLables = ({ info, setinfo, searchParams }) => {
	const { galleryId, albumId } = useParams();
	const {
		galleryInfo: { tagsList, getGalleryTagsList, addGalleryTag, getImageDuplicatesList },
	} = useContext(Context);
	const navigate = useNavigate();
	const [inputTag, setinputTag] = useState('');

	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		if (tagsList?.galleryId !== galleryId) {
			getGalleryTagsList(galleryId);
			getImageDuplicatesList(galleryId, albumId).then((response) => {
				if (response?.[0] === 404 && response?.[1]?.message === 'album not found') {
					navigate(`/galleries/${galleryId}`);
				}
			});
		} else if (info?.selectedGalleryTags?.length === 0) {
			// setinfo((prev) => ({ ...prev, selectedGalleryTags: tagsList?.list || [] }));
			let selectedGalleryTags = tagsList?.list?.filter((tag) => tag.displayName === 'All');
			if (searchParams.get('tag')) {
				selectedGalleryTags.push(
					tagsList?.list?.find((tag) => tag?.displayName === searchParams.get('tag')),
				);
			}
			setinfo((prev) => ({
				...prev,
				selectedGalleryTags,
			}));
		}
	}, [tagsList, galleryId, albumId]);

	const addNewTagHandler = async () => {
		if (!inputTag.trim().length) {
			messageApi.error('Tag cannot be empty');
			setinputTag('');
			return;
		}

		if (tagsList?.list.find((tag) => tag.displayName === inputTag)) {
			if (info?.selectedGalleryTags?.find((tag) => tag.displayName === inputTag)) {
				messageApi.warning('Tag already exists');
				return;
			} else {
				return;
				// setinfo((prev) => ({
				// 	...prev,
				// 	selectedGalleryTags: [
				// 		...prev.selectedGalleryTags,
				// 		tagsList?.list.find((tag) => tag.displayName === inputTag),
				// 	],
				// }));
				// setinputTag('');
			}

			return;
		}

		const json = {
			displayName: inputTag,
			slug: slugify(inputTag, { lower: true, strict: true }),
		};

		const response = await addGalleryTag(json, galleryId);
		if (response?.[0] === true) {
			setinfo((prev) => ({
				...prev,
				selectedGalleryTags: [
					...prev.selectedGalleryTags,
					{ _id: response?.[1]?._id, displayName: response?.[1]?.displayName },
				],
			}));
			setinputTag('');
		}
	};

	const onSelectTagFunc = (value, moreOptions) => {
		setinfo((prev) => ({
			...prev,
			selectedGalleryTags: [
				...prev.selectedGalleryTags,
				{ _id: value, displayName: moreOptions?.label },
			],
		}));
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
				{info?.selectedGalleryTags.map((singleTag) => (
					<div className="label_tag" key={singleTag?._id}>
						<p>{singleTag?.displayName}</p>
						{singleTag?.displayName !== 'All' && (
							<CancelTag
								onClick={() => removeTagsFromSelectionList(singleTag?._id)}
							/>
						)}
					</div>
				))}
			</div>

			<div className="add_label_div">
				<div className="add_label_input">Label </div>
				<div> :</div>
				{/* <input
					type="text"
					placeholder="Add Label"
					value={inputTag}
					onChange={(e) => setinputTag(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && addNewTagHandler()}
				/> */}

				{/* <Select
					showSearch
					value={inputTag}
					placeholder="Add Label"
					style={{ width: '100%', color: '#fff' }}
					defaultActiveFirstOption={false}
					suffixIcon={null}
					filterOption={true}
					onSearch={(value) => setinputTag(value)}
					// onChange={(value, v2) => console.log(value, v2)}
					onSelect={onSelectTagFunc}
					notFoundContent={null}
					optionFilterProp="label"
					// allowClear
					options={(tagsList?.list || [])
						?.filter(
							(tag) =>
								!info.selectedGalleryTags.some(
									(selectedTag) => selectedTag._id === tag._id,
								),
						)
						.map((d) => ({
							value: d._id,
							label: d.displayName,
						}))}
					onKeyDown={(e) => e.key === 'Enter' && addNewTagHandler()}
					// dropdownStyle={{ backgroundColor: '#333', color: '#fff' }}
				/> */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
						width: '100%',
						position: 'relative',
					}}
					className="headerLabels"
				>
					<Select
						showSearch
						value={inputTag}
						placeholder="Add Label"
						style={{ width: '100%', color: '#fff' }}
						suffixIcon={null}
						notFoundContent={null}
						onSelect={onSelectTagFunc}
						autoFocus
						onSearch={(value) => setinputTag(value)}
						optionFilterProp="label"
						onKeyDown={(e) => e.key === 'Enter' && addNewTagHandler()}
						options={(tagsList?.list || [])
							?.filter(
								(tag) =>
									!info.selectedGalleryTags.some(
										(selectedTag) => selectedTag._id === tag._id,
									),
							)
							.map((d) => ({ value: d._id, label: d.displayName }))}
					/>

					<p
						style={{
							fontSize: '10px',
							color: '#ccc',
							position: 'absolute',
							bottom: '-20px',
						}}
					>
						Press Enter to Add Tag
					</p>
				</div>
			</div>
		</div>
	);
};

export default AddLables;
