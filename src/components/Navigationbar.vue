<template>
  <div class="navigation-bar">
		<div class="navigation-box">
			<div class="navigation-icon">
					<router-link :to="{ name: 'Index' }">
						<i class="fa fa-home"></i>
						<div class="navigation-label">ホーム</div>
					</router-link>
			</div>
			<div class="navigation-icon">
					<router-link :to="{ name: 'History' }">
						<i class="fa fa-calendar-alt"></i>
						<div class="navigation-label">履歴</div>
					</router-link>
			</div>
			<div class="navigation-icon">
					<router-link :to="{ name: 'Setting' }">
						<i class="fa fa-cog"></i>
						<div class="navigation-label">設定</div>
					</router-link>
			</div>
		</div>
  </div>
</template>

<script>
export default {
	name: 'NavigationBar',
	data(){
		return {

		}
	}
}
</script>

<style>
.navigation-bar {
	width: 100%;
	height: 70px;
	position: fixed;
	bottom: 0;
	background-color: #e4ad6d;
}

.navigation-box {
	margin-top: 15px;
	display: flex;
	text-align: center;
	justify-content: space-around;
}
.navigation-icon i {
	font-size: 2.5em;
	color: #fff;
}
.navigation-icon a {
	font-size: 0.5em;
	color: #fff;
	text-decoration: none;
}
</style>


