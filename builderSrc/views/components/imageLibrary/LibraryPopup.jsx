import React, { Component } from 'react';
import './library.scss';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import Images from '../../../controllers/images';
import Masonry from 'masonry-layout';
import UnsplashImages from './unsplashImages';
import InfiniteScroll from 'react-infinite-scroll-component';
import _ from 'lodash';

class LibraryPopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: props.libraryImageType || 'l',
			images: {},
			libraryImages: {
				currentPage: 1,
				data: [],
				hasNextPage: false,
				hasPrevPage: false,
				limit: 30,
				nextPage: 1,
				prevPage: null,
				totalDocs: 0,
				totalPages: 0,
			},
			isLoading: true,
		};
	}
	componentDidMount = async () => {
		await this.getAllImages(this.state.libraryImages.limit, 1);
	};
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

	fetchMoreData = async () => {
		await this.getAllImages(
			this.state.libraryImages.limit,
			this.state.libraryImages.currentPage + 1,
			false,
		);
	};
	render() {
		let url;
		const region = localStorage.getItem('region') || 'ap-south-1';
		if (region === 'ap-south-1') {
			url = 'https://ap.images.ve.ai';
		} else {
			url = 'https://us.images.ve.ai';
		}
		return (
			<div className="image-library-popup">
				<div className="il-header">
					<div className="il-h-left">
						<div
							className={`il-h-left-item  ${
								this.state.activeTab === 'l' ? 'active' : ''
							}`}
							onClick={(e) =>
								this.setState({
									activeTab: 'l',
								})
							}
						>
							<a>Library</a>
							<span
								className={
									this.state.activeTab === 'l' ? 'il-h-left-item-line ' : ''
								}
							></span>
						</div>
						<div
							className={`il-h-left-item  ${
								this.state.activeTab === 'u' ? 'active' : ''
							}`}
							onClick={(e) =>
								this.setState({
									activeTab: 'u',
								})
							}
						>
							<a>Unsplash</a>
							<span
								className={
									this.state.activeTab === 'u' ? 'il-h-left-item-line ' : ''
								}
							></span>
						</div>
						{/* <div
							className={`il-h-left-item  ${
								this.state.activeTab === 'b' ? 'active' : ''
							}`}
							onClick={(e) =>
								this.setState({
									activeTab: 'b',
								})
							}
						>
							<a>Background</a>
							<span
								className={
									this.state.activeTab === 'b' ? 'il-h-left-item-line ' : ''
								}
							></span>
						</div> */}
					</div>
					<div className="il-h-right">
						<span onClick={(e) => this.props.close(e)}>
							<Close />
						</span>
					</div>
					{this.state.activeTab === 'b' && (
						<div className="il-h-right">
							<span className="checkbox-container">
								<span className="checkbox-container-item">
									<input type="checkbox" className="checkbox" />
								</span>
								<p className="active">Uploaded</p>
							</span>
							<span className="checkbox-container">
								<input type="checkbox" className="checkbox" />
								<p>Solid Colors</p>
							</span>
							<span className="checkbox-container">
								<input type="checkbox" className="checkbox" />
								<p>Gradients</p>
							</span>
							<span className="checkbox-container">
								<input type="checkbox" className="checkbox" />
								<p>Others</p>
							</span>

							{/* <span onClick={(e) => this.props.close(e)}>
								<Close />
							</span> */}
						</div>
					)}

					{/* / */}
				</div>
				<div className="il-b">
					<div className="ilb-body">
						{this.state.activeTab === '' && (
							<div className="ilbb-tabs">
								{/* <input type="text" placeholder="Search for an image" /> */}
								<div className="input">Search for an image</div>
							</div>
						)}

						{this.state.activeTab === 'l' ? (
							<>
								{this.state.isLoading ? (
									<div className="ilbb-images grid">
										<div className="page_loading">
											<a>
												<span class="loader"></span>
												Getting your images ready
											</a>
										</div>
									</div>
								) : (
									<div
										className="ilbb-images grid"
										id="veGalleryScrollableDiv"
										style={{
											maxHeight: window.innerHeight - 200,
										}}
									>
										{/* <a className="grid-item uploadeImageContainer">
									<div className="uploadeLogo">
										<Upload />
									</div>
									<p>+ Upload New Image</p>
								</a> */}

										<InfiniteScroll
											dataLength={this.state?.libraryImages?.data?.length}
											next={this.fetchMoreData}
											hasMore={
												this.state?.libraryImages?.hasNextPage || false
											}
											scrollableTarget={'veGalleryScrollableDiv'}
											loader={<h4>Loading...</h4>}
										>
											{_.size(this.state.libraryImages?.data) > 0
												? _.map(
														this.state.libraryImages?.data,
														(image, k) => {
															let width = (609 - 12) / 3;
															let height =
																(width / image.originalWidth) *
																image.originalHeight;

															return (
																<a
																	className="grid-item"
																	style={{
																		width,
																		height,
																		cursor: 'pointer',
																	}}
																	key={k}
																>
																	<img
																		src={`${url}/${
																			image
																				?.s3_optimized_1920w
																				?.key ||
																			image
																				?.s3_optimized_1000w
																				?.key
																		}`}
																	/>
																	<div className="gi-overlay">
																		{/* <p className="delete">
																<Delete />
															</p> */}
																		<span
																			onClick={(e) => [
																				this.props.setLibraryImage(
																					`${url}/${
																						image
																							?.s3_optimized_1920w
																							?.key ||
																						image
																							?.s3_optimized_1000w
																							?.key
																					}`,
																					url.includes(
																						'optimized-500w',
																					)
																						? 1000
																						: 3840,
																				),
																				this.props.close(e),
																			]}
																		>
																			Select
																		</span>
																	</div>
																</a>
															);
														},
												  )
												: ''}
										</InfiniteScroll>
									</div>
								)}
							</>
						) : (
							<UnsplashImages
								setLibraryImage={(e) => this.props.setLibraryImage(e)}
								close={(e) => this.props.close(e)}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default LibraryPopup;
