<template>
	<view>
		<camera mode="normal" device-position="back" flash="off" class="M-camera"></camera>
	</view>
	<view class="M-photo-btn">
		<uni-icons type="camera-filled" size='100' @click="TakePhoto"></uni-icons>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			TakePhoto() {
				var camera = uni.createCameraContext();
				camera.takePhoto({
					quality: 'high',
					success: (e) => {
						console.log('拍照成功')
					},
					fail: (e) => {
						console.log(e)
					},
					complete(e) {
						console.log('结束')
					}
				})
			}
		}
	}
</script>

<style>
.M-camera{
	width: 100%;
	height: 1200upx;
}
.M-photo-btn{
	text-align: center;
	color: white;
	background-color: black;
}
</style>
