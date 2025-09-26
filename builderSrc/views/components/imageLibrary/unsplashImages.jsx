import React from 'react';
import { createApi } from 'unsplash-js';
import _ from 'lodash'; // Make sure lodash is imported
import Masonry from 'masonry-layout';
import './images.scss';
// Create Unsplash API instance
const api = createApi({
	accessKey: 'IM1OB5Rl6mXxzyWEkSagDs7dDEOZys65NSSQoRCai7M',
});

// Body Class Component
class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			isImagesLoading: true,
			searchKey: 'fall',
			debounceForSearch: null,
		};
	}

	componentDidMount() {
		this.fetchPhotos(this.state.searchKey);
	}
	componentDidUpdate = () => {
		this.masonryView();
	};
	masonryView = () => {
		const grid = document.querySelector('.grid');

		const msnry = new Masonry(grid, {
			itemSelector: '.grid-item',

			transitionDuration: '0.8s',
			gutter: 4,
		});

		msnry.layout();
		//this.scrollToLastViewedImage();
	};
	fetchPhotos = (query) => {
		api.search
			.getPhotos({ query, orientation: 'landscape' })
			.then((result) => {
				this.setState({ data: result, isImagesLoading: false });
			})
			.catch(() => {
				this.setState({ isImagesLoading: false }); // Ensure loading state is cleared
			});
	};
	handleSearchUnsplash = (e) => {
		const query = e.target.value;

		this.setState(
			{
				searchKey: query,
			},
			() => {
				if (this.state.searchKey.length > 1) {
					// Set a timeout to delay the fetchPhotos call

					// ! old logic
					// setTimeout(() => {
					// 	this.setState({ isImagesLoading: true }, () => {
					// 		this.fetchPhotos(query); // Fetch photos with the new query
					// 	});
					// }, 1000);

					// ! new logic
					this.debounceFuncForSearch(() => {
						this.setState({ isImagesLoading: true }, () => {
							this.fetchPhotos(query); // Fetch photos with the new query
						});
					}, 1000);
				}
			},
		);
	};
	debounceFuncForSearch = (func, timeout = 800) => {
		if (this.state?.debounceForSearch) {
			clearTimeout(this.state?.debounceForSearch);
		}
		const timeoutFunc = setTimeout(() => {
			func();
		}, timeout);
		this.setState({
			debounceForSearch: timeoutFunc,
		});
	};
	handleSelectImage = async (e, url, download_location) => {
		e.stopPropagation(); // Prevent click from bubbling
		let result = await api.photos.trackDownload({ downloadLocation: `${download_location}` });
		await this.props.setLibraryImage(result.response.url);
		await this.props.close(e);
	};
	render() {
		const { data, isImagesLoading } = this.state;
		const isDocument = window.location.pathname.includes('document');

		return (
			<>
				<div>
					<input
						value={this.state.searchKey}
						onChange={(e) => this.handleSearchUnsplash(e)}
						placeholder="search here"
						style={{
							width: '100%',
							padding: 12,
							color: isDocument ? '#ffffff' : '#333',
							fontSize: 13,
							fontFamily: 'Inter Medium',
							border: isDocument
								? '1px solid #ffffff'
								: '1px solid var(--stroke, #2c2d2e)',
							borderRadius: '10px',
						}}
					/>
				</div>
				{this.state.isImagesLoading || data == null ? (
					<div className="ilbb-images grid ilbb-image-loader" style={{ height: '400px' }}>
						<div className="page_loading" style={{ gap: 12 }}>
							<span className="loader"></span>
							Getting your images ready
						</div>
					</div>
				) : (
					<>
						<div className="ilbb-images grid">
							{_.size(data.response.results) > 0 ? (
								data.response.results.map((image) => {
									let width = (609 - 12) / 3;
									let height = (width / image.width) * image.height;

									return (
										<a
											key={image.id} // Add key for React list rendering
											className="grid-item"
											style={{
												width,
												height,
												cursor: 'pointer',
											}}
										>
											<img
												src={image.urls.regular}
												alt={image.description || 'Image'}
											/>

											<div className="gi-overlay">
												{/* <a
													className="credit"
													target="_blank"
													rel="noopener noreferrer"
													href={`https://unsplash.com/@${image.user.username}`}
													style={{
														position: 'absolute',
														top: 0,
														left: 0,
														zIndex: 1,
														color: '#fff',
														fontSize: 12,
													}}
												>
													{image.user.name}
												</a> */}
												<a
													href={`https://unsplash.com/@${
														image.user.username
													}?utm_source=${'ve.ai'}&utm_medium=referral`}
													style={{
														position: 'absolute',
														top: 0,
														left: 0,
														zIndex: 1,
														color: '#fff',
														fontSize: 12,
													}}
												>
													Photo by {image.user.username} on{' '}
												</a>{' '}
												<a
													style={{
														position: 'absolute',
														top: 15,
														left: 0,
														zIndex: 1,
														color: '#ccc',
														fontSize: 12,
													}}
													href={`https://unsplash.com/?utm_source=${'ve.ai'}&utm_medium=referral`}
												>
													Unsplash
												</a>
												<span
													onClick={(e) => {
														this.handleSelectImage(
															e,
															image.urls.regular,
															image.links.download_location,
														);
													}}
												>
													Select
												</span>
											</div>
										</a>
									);
								})
							) : (
								<div>No images found.</div>
							)}
						</div>
					</>
				)}
			</>
		);
	}
}

export default Body;
