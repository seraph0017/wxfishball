<template>
	<view>
		<view class="banner" @click="goDetail(banner)">
			<u-lazy-load :image="banner_img_url">
			</u-lazy-load>
			<view class="banner-title">{{ banner_title }}</view>
		</view>


		<view class="wrap">
			<u-waterfall v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
						<u-lazy-load threshold="-450" border-radius="10" :image="item.upload_local_file_path"
							:index="index" @click="goDetail(item)">
						</u-lazy-load>
						<view class="demo-title">
							{{item.title}}
						</view>
						<view class="demo-tag">
							<u-tag v-for="(tag, i) in item.tags" :key="i" :text="tag" size='mini' shape="circle"
								mode="light" />&nbsp;
						</view>

						<view class="demo-shop">
							{{item.create_time}} 更新
						</view>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
						<u-lazy-load threshold="-450" border-radius="10" :image="item.upload_local_file_path"
							:index="index" @click="goDetail(item)">
						</u-lazy-load>
						<view class="demo-title">
							{{item.title}}
						</view>
						<view class="demo-tag">
							<u-tag v-for="(tag, i) in item.tags" :key="i" :text="tag" size="mini" shape="circle"
								mode="light" />&nbsp;
						</view>
						<view class="demo-shop">
							{{item.create_time}} 更新
						</view>
					</view>
				</template>
			</u-waterfall>
		</view>



		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />

		<view class="add-media" v-if="is_superuser">
			<uni-row>
				<uni-col :span="12">
					<button class="M-bottom-btn" type="primary" @click="onClick">
						<uni-icons type="settings" color="white"></uni-icons>筛选
					</button>
				</uni-col>
				<uni-col :span="12"><button class="M-bottom-btn" type="primary" @click="uploadMedia">
						<uni-icons type="cloud-upload" color="white"></uni-icons>上传照片
					</button></uni-col>
			</uni-row>
		</view>
		<view class="add-media" v-else>
			<uni-row>
				<uni-col :span="12">
					<button class="M-bottom-btn" type="primary" @click="onClick">
						<uni-icons type="settings" color="white"></uni-icons>筛选
					</button>
				</uni-col>
				<uni-col :span="12"><button class="M-bottom-btn" type="primary" @click="toLoginPage">
						<uni-icons type="person-filled" color="white"></uni-icons>登录
					</button></uni-col>
			</uni-row>
		</view>



		<uni-drawer ref="showRight" mode="right" :mask-click="true">
			<view class="scroll-view">
				<scroll-view class="scroll-view-box" scroll-y="true">
					<view class="info">
						<text class="info-text">筛选项目</text>
					</view>
					<view class="xiangce-list">
						<uni-forms-item label="相册列表" required>
							<uni-data-checkbox v-model="baseFormData.xiangce" :localdata="xiangce" />
						</uni-forms-item>
						<uni-forms-item label="标签">
							<uni-data-checkbox mode="tag" multiple :localdata="tag_list" v-model="tag_list_selected" />
						</uni-forms-item>
					</view>
					<view class="u-row">
						<button type="default" @click="filter">确定</button>
					</view>
				</scroll-view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
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
				tag_list_selected: [],
				flowList: [],
				is_superuser: false,
				user_id: 0,



				baseFormData: {
					xiangce: 1
				},
				xiangce: [{
					text: '默认相册',
					value: 1
				}, {
					text: '精选相册',
					value: 2
				}],
				banner_img_url: getApp().globalData.backendUrl + "static/image/banner.jpg",
				banner_title: "鱼丸札记",
				listData: [],
				last_id: '',
				reload: false,
				status: 'more',
				adpid: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				refresh_token: "",
				access_token: "",
				backend_url: getApp().globalData.backendUrl,
				backend_url_without_slash: getApp().globalData.backendUrlWithOutSlash,
				limit: 10,
				offset: 0,
				media_group_id: 1,
			};
		},

		onLoad(params) {
			if (params.media_group_id) {
				this.baseFormData.xiangce = Number(params.media_group_id)
			}
			if (params.tags_in) {
				this.tag_list_selected = JSON.parse(params.tags_in)
			}
			if (params.env) {
				console.log(params.env)
			}
			uni.authorize({
				scope: 'scope.camera',
				success(e) {
					console.log(e)
				}
			})
			// try {
			// 	this.access_token = uni.getStorageSync('access_token');
			// 	this.refresh_token = uni.getStorageSync('refresh_token');
			// 	if (this.refresh_token == "") {
			// 		uni.navigateTo({
			// 			url: '../login/login'
			// 		})
			// 	}
			// } catch (e) {
			// 	uni.navigateTo({
			// 		url: '../login/login'
			// 	})
			// }
			var access_detail = jwt_decode(this.access_token)
			this.user_id = access_detail.user_id
			this.is_superuser = access_detail.is_superuser

			this.adpid = this.$adpid;
			this.getList();
			this.getTags();



		},
		onPullDownRefresh() {
			refreshToken();
			var that = this
			setTimeout(function(e) {
				that.clear();
				that.reload = true;
				that.offset = 0;
				that.getList();
				that.getTags();
			}, 1000)


		},
		onReachBottom() {
			var that = this
			this.status = 'more';
			refreshToken();
			setTimeout(function(e) {
				that.getList();
			}, 1000)
		},
		onShareAppMessage() {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '鱼丸札记',
				path: '/pages/list/list',
				content: '鱼丸同学的成长记录，一起来看看吧',
			}
		},
		methods: {
			toLoginPage: () => {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			formatDate: (nowTimer) => {
				let formats = {
					'year': '几 年前',
					'month': '几 月前',
					'day': '几 天前',
					'hour': '几 小时前',
					'minute': '几 分钟前',
					'second': '几 秒前',
				};
				//获取当前时间戳
				let now = Date.now();
				let seconds = Math.floor((now - parseInt(nowTimer)) / 1000);
				let minutes = Math.floor(seconds / 60);
				let hours = Math.floor(minutes / 60);
				let days = Math.floor(hours / 24);
				let months = Math.floor(days / 30);
				let years = Math.floor(months / 12);
				let oldType = '';
				let oldValue = 0;
				if (years > 0) {
					//几年前
					oldType = 'year';
					oldValue = years;
				} else {
					if (months > 0) {
						//几个月前
						oldType = 'month';
						oldValue = months;
					} else {
						if (days > 0) {
							//几天前
							oldType = 'day';
							oldValue = days;
						} else {
							if (hours > 0) {
								//几小时前
								oldType = 'hour';
								oldValue = hours;
							} else {
								//这里  您可以处理一个  刚刚  比如时间小于30分钟
								if (minutes > 0) {
									//几分钟前   
									oldType = 'minute';
									oldValue = minutes;
								} else {
									//几秒前 
									oldType = 'second';
									oldValue = seconds === 0 ? (seconds = 1) : seconds;
								}
							}
						}
					}
				}
				return formats[oldType].replace('几', oldValue);
			},
			filter() {
				var media_group_id = this.baseFormData.xiangce
				var tags = this.tag_list_selected
				uni.reLaunch({
					url: 'list?media_group_id=' + media_group_id + "&tags_in=" + JSON.stringify(tags),
				})
			},
			addData() {
				const reverseListData = this.listData.reverse();
				for (let i = reverseListData.length - 1; i >= 0; i--) {
					let item = JSON.parse(JSON.stringify(reverseListData[i]))
					this.flowList.push(item)
					reverseListData.pop()
				}
			},
			remove(id) {
				this.$refs.uWaterfall.remove(id);
			},
			clear() {
				this.$refs.uWaterfall.clear();
			},
			// 瀑布流测试


			onClick(e) {
				this.$refs.showRight.open();
			},
			closeDrawer() {
				this.$refs.showRight.close();
			},
			uploadMedia(e) {
				refreshToken();
				var that = this;
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
				}).then(res => {
					res.tempFilePaths.forEach(function(filePath) {
						var sec_that = that;
						var fileName = getFileName(filePath)

						uni.uploadFile({
							url: that.backend_url + 'api/media/',
							filePath: filePath,
							name: "filePath",
							formData: {
								"upload_user_id": that.user_id,
								"group_id": that.baseFormData.xiangce
							},
							header: {
								"Authorization": "Bearer " + that.access_token
							}
						}).then(res => {
							uni.reLaunch({
								url: 'list?media_group_id=' + that.baseFormData.xiangce,
							})
						})
					})
				});
			},
			getTags() {
				refreshToken();
				this.access_token = uni.getStorageSync('access_token');
				var data = {
					format: 'json', //需要的字段名
					limit: 999999999999,
				};
				uni.request({
					url: this.backend_url + 'api/tag/',
					data: data,
					header: {
						"Authorization": "Bearer " + this.access_token
					},
					success: res => {
						let fin_tags = []
						let ori_tags = res.data.results
						ori_tags.forEach(e => {
							fin_tags.push({
								"text": e.slug,
								"value": e.slug,
							})
						})
						this.tag_list = fin_tags
					}
				});
			},
			getList() {
				refreshToken();
				this.access_token = uni.getStorageSync('access_token');

				var data = {
					format: 'json', //需要的字段名
					limit: this.limit,
					offset: this.offset,
					media_group_id: this.baseFormData.xiangce,
					tags: this.tag_list_selected,
				};
				if (this.offset) {
					//说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.limit = this.limit;
					data.offset = this.offset;
				}


				uni.request({
					url: this.backend_url + 'api/media/',
					data: data,
					header: {
						"Authorization": "Bearer " + this.access_token
					},
					success: res => {
						if (res.statusCode == 200) {

							let list = this.setTime(res.data);
							this.listData = this.reload ? list : this.listData.concat(list);

							this.offset = data.offset + data.limit;
							this.reload = false;
						}
						this.addData();
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				});
			},
			goDetail: function(e) {
				uni.navigateTo({
					url: '../detail/detail?media_id=' + e.id,
				});
			},
			setTime: function(items) {
				var newItems = [];
				items.forEach(e => {
					var tdate = new Date(e.update_time);
					var ttimestamp = Date.parse(tdate);
					newItems.push({
						image: this.backend_url_without_slash + e.upload_file,
						upload_local_file_path: this.backend_url_without_slash + "/upload/" + e
							.upload_local_file_path,
						id: e.id,
						post_id: e.post_id,
						title: e.title,
						is_pic: e.is_pic,
						description: e.description,
						pic_time: e.pic_time,
						create_time: this.formatDate(ttimestamp),
						tags: e.tags,
					});
				});
				return newItems;
			},
			aderror(e) {
				console.log("aderror: " + JSON.stringify(e.detail));
			}
		}
	};
</script>
<style>
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style scoped lang="scss">
	.M-bottom-btn {
		border-radius: 0;
		background-color: steelblue;

	}

	button::after {
		border: none;
	}

	.demo-warter {
		border-radius: 8px;
		margin: 5px;
		background-color: #ffffff;
		padding: 8px;
		position: relative;
	}

	.u-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}

	.demo-image {
		width: 100%;
		border-radius: 4px;
	}

	.demo-title {
		font-size: 30rpx;
		margin-top: 5px;
		color: $u-main-color;
	}

	.demo-tag {
		display: flex;
		margin-top: 5px;
	}

	.demo-tag-owner {
		background-color: $u-type-error;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}

	.demo-tag-text {
		border: 1px solid $u-type-primary;
		color: $u-type-primary;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}

	.demo-price {
		font-size: 30rpx;
		color: $u-type-error;
		margin-top: 5px;
	}

	.demo-shop {
		font-size: 22rpx;
		color: $u-tips-color;
		margin-top: 5px;
		text-align: right;
	}

	// 瀑布流测试





	.xiangce-list {
		padding-left: 10px;
	}

	.scroll-view {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		flex: 1
	}

	.scroll-view-box {
		flex: 1;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.info {
		padding: 15px;
		color: #666;
	}

	.info-text {
		font-size: 14px;
		color: #666;
	}

	.info-content {
		padding: 5px 15px;
	}

	.close {
		padding: 10px;
	}

	.cover-content {
		padding-bottom: 10px;
	}

	.add-media {
		// flex-direction: column;
		align-items: baseline;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.banner {
		height: 280upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
		height: 100%;
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

	.uni-media-list-logo {
		width: 180rpx;
		height: 140rpx;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 74rpx;
		font-size: 28rpx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.card-actions {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 45px;
		border-top: 1px #eee solid;
	}

	.card-actions-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.card-actions-item-text {
		font-size: 12px;
		color: #666;
		margin-left: 5px;
	}

	.cover-image {
		flex: 1;
		height: 400px;
		width: 100%;
	}

	.cover-video {
		width: 100%
	}
</style>
