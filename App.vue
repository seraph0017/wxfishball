<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			backendUrl: "http://localhost:8000/",	
			backendUrlWithOutSlash: "http://localhost:8000",
			// backendUrl: "https://xujiaze.com/",
			// backendUrlWithOutSlash: "https://xujiaze.com",
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./uni_modules/vk-uview-ui/index.scss";
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
