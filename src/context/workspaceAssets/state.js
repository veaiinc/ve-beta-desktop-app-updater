import Service from '../../services/index';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const initialState = {
	workspaceImagesData: null,
	unsplashImagesData: null,
};

const unsplashAccessKey = 'IM1OB5Rl6mXxzyWEkSagDs7dDEOZys65NSSQoRCai7M';

export const WorkspaceAssetsState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const getWorkspaceImages = async (page = 1, limit = 10, append = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `${workspaceId}/workspaceAssets-images`;
			const token = localStorage.getItem('usertoken');
			const params = { page, limit };
			const type = 'workspace_images_api';

			const response = await Service.fetchGet(path, token, type, params);

			if (response?.[0]) {
				const fetchedImages = response?.[1]?.data?.map((img) => ({
					id: img._id,
					givenFileName: img.givenFileName,
					imageUrl: img?.s3_optimized_3840w?.key
						? `https://ap.images.ve.ai/${img.s3_optimized_3840w.key}`
						: img?.s3_optimized_2560w?.key
						? `https://ap.images.ve.ai/${img.s3_optimized_2560w.key}`
						: img?.s3_optimized_1920w?.key
						? `https://ap.images.ve.ai/${img.s3_optimized_1920w.key}`
						: img?.s3_optimized_1000w?.key
						? `https://ap.images.ve.ai/${img.s3_optimized_1000w.key}`
						: img?.s3_optimized_500w?.key
						? `https://ap.images.ve.ai/${img.s3_optimized_500w.key}`
						: '',
				}));

				const data = append
					? [...(state?.workspaceImagesData?.data || []), ...fetchedImages]
					: fetchedImages;

				const currentPage = response?.[1]?.currentPage || page;
				const hasNextPage = response?.[1]?.hasNextPage ?? false;

				const payload = {
					data,
					hasNextPage,
					currentPage,
				};

				dispatch({
					type: Actions.SET_WORKSPACE_IMAGES,
					payload,
				});
			}
		} catch (error) {
			console.log('error in getWorkspaceImages', error);
		}
	};

	const getUnsplashImages = async (query = 'fall', page = 1, perPage = 10, append = false) => {
		try {
			const url = `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&page=${page}&per_page=${perPage}&client_id=${unsplashAccessKey}`;
			const res = await fetch(url);
			const json = await res.json();

			const images = json?.results?.map((img) => ({
				id: img.id,
				description: img.alt_description,
				previewImageUrl: img.urls.small, //raw, full, small, regular, thumb, small_s3
				uploadImageUrl: img.urls.full,
			}));

			const data = append ? [...(state?.unsplashImagesData?.data || []), ...images] : images;

			const hasNextPage = page < json?.total_pages / perPage;
			const payload = {
				data,
				hasNextPage,
				currentPage: page,
			};

			dispatch({
				type: Actions.SET_UNSPLASH_IMAGES,
				payload,
			});
		} catch (error) {
			console.log('error fetching unsplash images', error);
		}
	};

	const resetWorkspaceAssetsState = () => {
		dispatch({
			type: Actions.RESET_STATE,
		});
	};

	return {
		...state,
		getWorkspaceImages,
		getUnsplashImages,
		resetWorkspaceAssetsState,
	};
};

export default WorkspaceAssetsState;
