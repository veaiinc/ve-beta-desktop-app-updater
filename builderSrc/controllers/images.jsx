// import React, { Component } from 'react';
import * as Action from './actions';
// import _ from 'lodash';
import axios from 'axios';
// import moment from 'moment';
import Proposals from './proposals';

class Images extends Proposals {
	uploadImage = async (json, image, activaModuleId = null) => {
		let userToken = localStorage.getItem('usertoken');
		let workspaceId = localStorage.getItem('workspaceId');
		let response = await Action.uploadImage(
			json,
			userToken,
			workspaceId,
			this.state.activeModuleId ? this.state.activeModuleId : activaModuleId,
		);
		if (response[0] == true) {
			let res = await this.axiosPutCallToS3Bucket(
				image,
				response[1]['signedUrl'],
				response[1]['insertedId'],
				json.uploadBatchId,
			);
			if (res === true) {
				return [response[1]['insertedId'], response[1]['imageURL']];
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	uploadImageWorkflow = async (json, image, indivisualState) => {
		let userToken = localStorage.getItem('usertoken');
		let workspaceId = localStorage.getItem('workspaceId');

		let response = await Action.uploadImageWorkflow(
			json,
			userToken,
			workspaceId,
			indivisualState?.module,
			indivisualState?.activeWorkflowModuleId,
		);
		if (response[0] == true) {
			let res = await this.axiosPutCallToS3Bucket(
				image,
				response[1]['signedUrl'],
				response[1]['insertedId'],
				json.uploadBatchId,
			);
			if (res === true) {
				return [response[1]['insertedId'], response[1]['imageURL']];
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	axiosPutCallToS3Bucket = async (image, uploadUrl, imageID, batchID) => {
		let options = {
			headers: {
				'Content-Type': image.type,
			},
		};

		let response = await axios.put(uploadUrl, image, options);
		if (response.status === 200) {
			let json = {
				uploadBatchId: batchID,
				uploadedOn: Date.now(),
			};

			return true;
		} else {
			return false;
		}
	};

	getImageUploadStatus = async (batchID) => {
		let userToken = localStorage.getItem('usertoken');
		let response = await Action.getUploadStatus(userToken, batchID);
		if (response[0] === true) {
			return response[1];
		} else {
			return false;
		}
	};
	getAllImages = async (limit = 10, page = 1, reset = true) => {
		let userToken = localStorage.getItem('usertoken');
		let workspaceId = localStorage.getItem('workspaceId');
		const query = `limit=${limit}&page=${page}`;
		let response = await Action.getAllImages(userToken, workspaceId, query);
		if (response[0] === true) {
			let updateData = reset
				? response[1]
				: {
						...this.state.libraryImages,
						...response[1],
						data: [...this.state.libraryImages.data, ...response[1]?.data],
				  };

			this.setState({
				libraryImages: updateData,
				images: response[1]?.data,
				isLoading: false,
			});
		} else {
			return false;
		}
	};
}
export default Images;
