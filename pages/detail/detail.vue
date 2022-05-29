<template>
	<view>
		<view class="banner">
			<u-lazy-load class="banner-img" :image="media.upload_local_file_path">
			</u-lazy-load>
			<view class="banner-title">{{media.title}}</view>
		</view>

		<uni-row>
			<uni-col :span="1">&nbsp;</uni-col>
			<uni-col :span="22">
				<uni-forms ref="baseForm" label-position="top" class="M-detailInfo">
					<uni-forms-item label="标题">
						<uni-easyinput :disabled="is_disabled" :inputBorder="false" class="M-inputtext"
							v-model="baseFormData.title" />
					</uni-forms-item>
					<uni-forms-item label="标签">
						<u-tag v-for="(tag, i) in baseFormData.tags" :key="i" :text="tag" shape="circle" mode="light" />
						&nbsp;
						<uni-easyinput v-show="is_show" :disabled="is_disabled" class="M-inputtext"
							v-model="tag_list" @input="modifyTags" />
					</uni-forms-item>
					<uni-forms-item label="拍摄时间">
						<uni-datetime-picker type="date" :clear-icon="false" v-model="baseFormData.pic_time"
							@maskClick="maskClick" :border="false" :disabled="is_disabled" />
					</uni-forms-item>
					<uni-forms-item label="描述">
						<uni-easyinput :disabled="is_disabled" :inputBorder="false" class="M-inputtext"
							v-model="baseFormData.description" />
					</uni-forms-item>
				</uni-forms>
				<button type="primary" v-show="is_show" @click="modifyMediaMeta">提交</button>
			</uni-col>
			<uni-col :span="1">&nbsp;</uni-col>
		</uni-row>
		<u-gap height="500" bg-color="white"></u-gap>
		<u-line color="red"></u-line>

	</view>
	<view class="action-bar" v-if="is_superuser">
		<uni-row>
			<uni-col :span="8">
				<button class="M-bottom-btn" open-type="share">
					<uni-icons type="pyq" color="white"></uni-icons>
					分享
				</button>
			</uni-col>
			<uni-col :span="8">
				<button class="M-bottom-btn-edit" @click="editMedia">
					<uni-icons type="settings-filled" color="white"></uni-icons>
					编辑
				</button>
			</uni-col>
			<uni-col :span="8">
				<button class="M-bottom-btn-del" @click="deleteMedia">
					<uni-icons type="trash-filled" color="white"></uni-icons>
					删除
				</button>
			</uni-col>
		</uni-row>
	</view>
	<view class="action-bar" v-else>
		<uni-row>
			<uni-col :span="24">
				<button class="M-bottom-btn" open-type="share">
					<uni-icons type="pyq" color="white"></uni-icons>
					分享
				</button>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser.js'
	import jwt_decode from "jwt-decode";
	import {
		dateUtils,
		refreshToken,
		getFileName
	} from '../../common/util.js';


	export default {
		data() {
			return {
				tag_list: [],
				is_show: false,
				is_disabled: true,
				baseFormData: {
					title: "",
					description: "",
					pic_time: "",
					tags: [],
				},
				title: '',
				banner: {},
				htmlNodes: [],

				media: {},

				media_id: 0,
				backend_url: getApp().globalData.backendUrl,
				backend_url_without_slash: getApp().globalData.backendUrlWithOutSlash,

				refresh_token: "",
				access_token: "",

				is_superuser: false,
			}
		},
		onLoad(params) {

			this.media_id = Number(params.media_id);
			try {
				this.access_token = uni.getStorageSync('access_token');
				this.refresh_token = uni.getStorageSync('refresh_token');
				if (this.refresh_token == "") {
					uni.navigateTo({
						url: '../login/login'
					})
				}
			} catch (e) {
				uni.navigateTo({
					url: '../login/login'
				})
			}
			var access_detail = jwt_decode(this.access_token)
			console.log(access_detail)
			this.user_id = access_detail.user_id
			this.is_superuser = access_detail.is_superuser

			this.getDetail();
		},
		onShareAppMessage() {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.media.title,
				path: '/pages/detail/detail?media_id' + this.media_id,
				content: '鱼丸同学的成长记录，一起来看看吧',
			}
		},
		methods: {
			modifyTags(e) {
				this.baseFormData.tags = e.trim().split(" ")
			},
			editMedia() {
				this.is_disabled = false
				this.is_show = true
			},
			deleteMedia() {
				var that = this
				uni.showModal({
					title: "提示！",
					content: "确认删除嘛?",
					success: function(res) {
						if (res.confirm) {
							refreshToken();
							uni.request({
								url: that.backend_url + "api/media/" + that.media_id,
								method: "DELETE",
								header: {
									"Authorization": "Bearer " + that.access_token
								},
								success: (res) => {
									uni.reLaunch({
										url: "../list/list?media_group_id=" + that.media
											.group,
									})
								},
								fail: () => {
									console.log('fail');
								}
							});
						} else {

						}
					}
				})

			},

			modifyMediaMeta() {
				refreshToken();
				var that = this;
				uni.request({

					url: this.backend_url + "api/media/" + this.media_id + "/",
					header: {
						"Authorization": "Bearer " + this.access_token
					},
					method: 'PUT',
					data: this.baseFormData,
					success: (res) => {
						uni.reLaunch({
							url: "../list/list",
						})
					}
				})
			},

			getDetail() {
				refreshToken();
				var that = this;
				uni.request({
					url: this.backend_url + "api/media/" + this.media_id,
					header: {
						"Authorization": "Bearer " + this.access_token
					},
					success: (res) => {
						if (res.statusCode == 200) {
							this.media = res.data
							this.media.upload_local_file_path = that.backend_url + "upload/" + res.data.upload_local_file_path
							this.baseFormData.title = this.media.title
							this.baseFormData.description = this.media.description
							this.baseFormData.pic_time = this.media.pic_time
							this.baseFormData.tags = this.media.tags
							this.tag_list = String(this.media.tags).replaceAll(","," ")
						}
					},
					fail: () => {
						console.log('fail');
					}
				});
			}
		}
	}
</script>

<style>
	.M-detailInfo {}

	.M-inputtext {
		color: #000;
		opacity: 1;
		-webkit-text-fill-color: #000;
	}

	.M-bottom-btn {
		border-radius: 0;
		background-color: steelblue;
		color: white;

	}

	.M-bottom-btn-edit {
		border-radius: 0;
		background-color: green;
		color: white;
	}

	.M-bottom-btn-del {
		border-radius: 0;
		background-color: red;
		color: white;

	}

	button::after {
		border: none;
	}

	.action-bar {
		align-items: baseline;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.banner {
		height: 100%;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {


		width: 100%;
	}

	.banner-title {
		max-height: 84rpx;
		overflow: hidden;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;
		width: 90%;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 42rpx;
		color: white;
		z-index: 11;
	}

	.article-meta {
		padding: 20rpx 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-text {
		font-size: 26rpx;
		line-height: 50rpx;
		margin: 0 20rpx;
	}

	.article-author,
	.article-time {
		font-size: 30rpx;
	}

	.article-content {
		padding: 0 30rpx;
		overflow: hidden;
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}
</style>
