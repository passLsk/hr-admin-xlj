<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imgerror :src="avatar" class="user-avatar" />
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <a>
            <router-link to="/">
              <el-dropdown-item> 首页 </el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://gitee.com/shuiruohanyu/hrsaas139">
              <el-dropdown-item>项目地址</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </a></el-dropdown-menu
        >
      </el-dropdown>
    </div>
    <div
      style="float: right; height: 100%; line-height: 50px; margin-right: 20px"
    >
    <ThemePicker style="vertical-align:bottom;margin-right:8px;line-height:46px"></ThemePicker>
    <FullScreen></FullScreen>
      <el-dropdown @command="handleCommand">
        <span
          ><svg-icon icon-class="language" style="color: #fff; font-size: 20px"
        /></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en">en</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import i18n from '@/lang'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      // 调用logout
      await this.$store.dispatch('user/logout')
      // 跳转路由到login
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleCommand (command) {
      i18n.locale = command
      console.log(command)
      Cookies.set('locale', command)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.navbar {
  background-color: #5283fd;
}
::v-deep .app-breadcrumb.el-breadcrumb .no-redirect {
  color: #fff;
}
.user-avatar {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  vertical-align: middle;
}
.name {
  color: #fff;
  vertical-align: middle;
  margin-left: 5px;
}
.user-dropdown {
  color: #fff;
}
</style>
