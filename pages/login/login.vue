<template>

	<uni-section title="鱼丸札记" type="line" class="M-logincard">
		<view class="M-login">
			<uni-forms ref="loginForm" :modelValue="baseFormData" :rules="rules">
				<uni-forms-item label="姓名" required>
					<uni-easyinput v-model="baseFormData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="密码" required>
					<uni-easyinput type="password" v-model="baseFormData.password" placeholder="请输入密码" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<view>
			<button type="primary" @click="submit()">提交</button>
		</view>
	</uni-section>
</template>

<script>
	export default {
		data() {
			return {
				baseFormData: {
					name: '',
					password: ''
				}
			}
		},
		onReady() {

		},
		methods: {

			getUserInfo(){
				uni.getUserProfile({
					lang: 'zh_CN',
					desc: '获取用户信息',
					success: userInfo => {
						console.log(userInfo, 'userInfo');
						uni.login({
							provider: 'weixin',
							success: loginInfo => {
								console.log(loginInfo, 'loginInfo');
							}
						});
					},
					fail: err => {
						console.log(err, 'err')
					}
				});
			},
			submit(loginForm) {
				uni.request({
					method: "POST",
					url: getApp().globalData.backendUrl + "api/token/",
					data: {
						username: this.baseFormData.name,
						password: this.baseFormData.password
					},
					success: (res) => {
						var access_token = res.data.access
						var refresh_token = res.data.refresh
						console.log(access_token)
						console.log(refresh_token)
						uni.setStorage({
							key: 'access_token',
							data: access_token,
						})
						uni.setStorage({
							key: 'refresh_token',
							data: refresh_token,
						})
						uni.navigateTo({
							url: '../list/list'
						})
					}
				})
			}
		}
	}
</script>

<style>
	.M-login {
		padding: 15px;
		background-color: #fff;
		padding-bottom: 30%;
	}

	.M-logincard {
		padding-top: 30%;
		padding-bottom: 10%;
	}
</style>
