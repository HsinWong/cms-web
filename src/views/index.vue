<style scoped>
    .header {
        position: fixed;
        z-index: 1000;
        width: 100%;
        padding: 0 25px;
    }

    .header-logo {
        float: left;
        padding: 0 20px;
    }

    .header-logo > a {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
    }

    .header-tool {
        float: right;
    }

    .header-tool /deep/ .ivu-btn-text {
        color: hsla(0, 0%, 100%, .7);
    }

    .header-tool /deep/ .ivu-btn-text:hover {
        color: #fff;
    }

    .header-tool .avatar {
        vertical-align: middle;
        border-radius: 50%;
    }

    .sider {
        position: fixed;
        z-index: 999;
        height: 100%;
        padding-top: 64px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .sider::-webkit-scrollbar {
        display: none;
    }

    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu /deep/ span, ivu-menu-submenu-title-icon {
        width: 0px;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    .content {
        margin-top: 64px;
        margin-left: 200px;
        padding: 16px;
        background: #e3e8ee;
    }

    .content > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
        margin-top: -16px;
        background: #fff;
        padding: 16px;
    }

    .ivu-dropdown-menu {
        min-width: auto;
    }
</style>
<template>
    <Layout class="fillPage">
        <Header class="header">
            <div class="header-logo">
                <router-link :to="{ name: 'index' }">内容管理系统</router-link>
            </div>
            <div class="header-tool">
                <full-screen v-model="isFullScreen"></full-screen>
                <Dropdown @on-click="handleUser">
                    <Button type="text">
                        {{ currentUser.nickname }}
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem>个人信息</DropdownItem>
                        <DropdownItem name="logout" divided>退出登录</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <img class="avatar" src="../images/avatar1.jpg" alt="avatar" width="32" height="32"/>
            </div>
        </Header>
        <Sider v-model="isCollapsed" :collapsed-width="78" class="sider" collapsible>
            <Menu ref="siderMenu" theme="dark" :open-names="openedMenus" width="auto" :class="menuitemClasses">
                <Submenu v-for="menu in menus" :key="menu.name" :name="menu.name">
                    <template slot="title">
                        <Icon :type="menu.icon"></Icon>
                        <span>{{ menu.name }}</span>
                    </template>
                    <MenuItem v-for="subMenu in menu.subMenus" :key="subMenu.name" :name="subMenu.name">
                        <Icon :type="subMenu.icon"></Icon>
                        <span>{{ subMenu.name }}</span>
                    </MenuItem>
                </Submenu>
            </Menu>
        </Sider>
        <Content class="content">
            <Tabs v-model="activeTab" type="card" closable :animated="false" @on-tab-remove="handleTabRemove">
                <TabPane v-for="tab in tabs" :key="tab.name" :label="tab.name" :icon="tab.icon"
                         v-if="tab.show"></TabPane>
                <Dropdown slot="extra" :transfer="true" @on-click="handleTabs">
                    <Button type="text">
                        标签操作
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="all">关闭所有</DropdownItem>
                        <DropdownItem name="others">关闭其它</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Tabs>
        </Content>
    </Layout>
</template>
<script>
    import Util from '../libs/util';
    import axios from 'axios';
    import Cookies from 'js-cookie';
    import fullScreen from './fullscreen.vue';

    export default {
        components: {
            fullScreen,
        },
        data() {
            return {
                isFullScreen: false,
                isCollapsed: false,
                openedMenus: [],
                menus: [],
                activeTab: 1,
                tabs: [
                    {
                        name: '测试1',
                        icon: '',
                        show: true,
                    },
                    {
                        name: '测试2',
                        icon: '',
                        show: true,
                    },
                    {
                        name: '测试3',
                        icon: '',
                        show: true,
                    },
                ],
            };
        },
        computed: {
            currentUser() {
                return this.$store.state.currentUser;
            },
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ];
            },
        },
        methods: {
            handleUser(action) {
                if (action === 'logout') {
                    Cookies.remove('token');
                    localStorage.clear();
                    this.$router.replace({name: 'login'});
                }
            },
            handleTabRemove(name) {
                this.tabs[name].show = false;
            },
            handleTabs(action) {
                if (action === 'all') {
                    this.tabs.forEach(tab => {
                        tab.show = false;
                    });
                } else if (action === 'others') {
                    this.tabs.forEach((tab, index) => {
                        if (this.activeTab !== index) {
                            tab.show = false;
                        }
                    });
                }
            },
        },
        beforeRouteEnter(to, from, next) {
            axios.all([
                Util.ajax.get('/users/' + Util.getTokenInfo().userId),
                Util.ajax.get('/fullMenus/'),
            ])
                .then(axios.spread(function (usersResponse, menusResponse) {
                    next(vm => {
                        vm.$store.commit('updateCurrentUser', usersResponse.data);
                        menusResponse.data.forEach(menu => {
                            vm.menus.push(menu);
                        });
                        vm.openedMenus.push(vm.menus[0].name);
                        vm.$nextTick(() => {
                            vm.$refs.siderMenu.updateOpened();
                        });
                    });
                }));
        },
    };
</script>
