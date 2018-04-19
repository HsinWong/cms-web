<style scoped>
    .sider-layout {
        height: 100%;
    }

    .sider-logo {
        padding: 0;
        text-align: center;
        z-index: 2;
    }

    .sider-logo a {
        color: #fff;
        font-size: 18px;
        font-weight: bold;
    }

    .sider-menu {
        background: #495060;
        overflow-x: hidden;
        overflow-y: auto;
        box-shadow: 1px 0 1px rgba(0, 0, 0, .5);
    }

    .sider-menu::-webkit-scrollbar {
        display: none;
    }

    .header {
        padding: 0 25px;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .5);
        z-index: 1;
    }

    .header-tool {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .header-tool /deep/ .ivu-btn-text {
        color: hsla(0, 0%, 100%, .7);
    }

    .header-tool /deep/ .ivu-btn-text:hover {
        color: #fff;
    }

    .header-tool .avatar {
        border-radius: 50%;
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

    .menu-item /deep/ .ivu-menu-submenu-title-icon {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s ease .2s;
    }

    .collapsed-menu span {
        width: 0;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    .collapsed-menu /deep/ .ivu-menu-submenu-title-icon {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s;
    }

    .collapsed-menu /deep/ .ivu-menu-item {
        padding-left: 24px !important;
    }

    .content {
        overflow-y: auto;
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
<style>
    .ivu-layout-sider {
        display: flex;
        flex-direction: column;
    }

    .ivu-layout-sider-children {
        flex: 1 1 auto;
    }
</style>
<template>
    <Layout class="fillPage">
        <Sider v-model="isCollapsed" :collapsed-width="78" collapsible>
            <Layout class="sider-layout">
                <Header class="sider-logo">
                    <router-link :to="{ name: 'index' }">{{title}}</router-link>
                </Header>
                <Content class="sider-menu">
                    <Menu ref="siderMenu" theme="dark" :open-names="openedMenus" width="auto" :class="menuitemClasses">
                        <Submenu v-for="menu in menus" :key="menu.name" :name="menu.name">
                            <template slot="title">
                                <Tooltip :content="menu.name" placement="right" :disabled="!isCollapsed"
                                         :transfer="true">
                                    <Icon :type="menu.icon"></Icon>
                                </Tooltip>
                                <span>{{ menu.name }}</span>
                            </template>
                            <MenuItem v-for="subMenu in menu.subMenus" :key="subMenu.name" :name="subMenu.name">
                                <Tooltip :content="subMenu.name" placement="right" :disabled="!isCollapsed"
                                         :transfer="true">
                                    <Icon :type="subMenu.icon"></Icon>
                                </Tooltip>
                                <span>{{ subMenu.name }}</span>
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </Content>
            </Layout>
        </Sider>
        <Layout>
            <Header class="header">
                <div class="header-tool">
                    <full-screen v-model="isFullScreen"></full-screen>
                    <Dropdown @on-click="handleUser">
                        <Button type="text">
                            {{ currentUser.nickname }}
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="profile">个人信息</DropdownItem>
                            <DropdownItem name="logout" divided>退出登录</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <img class="avatar" src="../images/avatar1.jpg" alt="avatar" width="32" height="32"/>
                </div>
            </Header>
            <Content class="content">
                <Tabs v-model="activeTab" type="card" closable :animated="false" @on-tab-remove="handleTabRemove">
                    <TabPane v-for="tab in tabs" :key="tab.name" :label="tab.name" :icon="tab.icon"
                             v-if="tab.show">
                        <router-view :name="tab.view"></router-view>
                    </TabPane>
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
                activeTab: -1,
                tabs: [],
            };
        },
        computed: {
            currentUser() {
                return this.$store.state.currentUser;
            },
            title() {
                return this.isCollapsed ? 'CMS' : '内容管理系统';
            },
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ];
            },
        },
        watch: {
            activeTab: function (n, o) {
                if (n >= 0) {
                    this.$router.push({name: this.tabs[n].view});
                } else {
                    this.$router.push({name: 'index'});
                }
            },
            $route: function (n, o) {
                this.init();
            }
        },
        methods: {
            init() {
                if (this.$route.name !== 'index') {
                    let opened = false;
                    this.tabs.forEach((tab, index) => {
                        if (tab.view === this.$route.name) {
                            opened = true;
                            this.tabs[index].show = true;
                            this.activeTab = index;
                        }
                    });
                    if (!opened) {
                        let tab = {
                            name: this.$route.meta.title,
                            icon: this.$route.meta.icon,
                            view: this.$route.name,
                            show: true,
                        };
                        this.tabs.push(tab);
                        this.activeTab = this.tabs.lastIndexOf(tab);
                    }
                } else {
                    this.activeTab = -1;
                }
            },
            handleUser(action) {
                if (action === 'logout') {
                    Cookies.remove('token');
                    localStorage.clear();
                    this.$router.replace({name: 'login'});
                } else if (action === 'profile') {
                    let opened = false;
                    this.tabs.forEach((tab, index) => {
                        if (tab.view === 'profile') {
                            opened = true;
                            this.tabs[index].show = true;
                            this.activeTab = index;
                        }
                    });
                    if (!opened) {
                        let profile = {
                            name: '测试1',
                            icon: '',
                            view: 'profile',
                            show: true,
                        };
                        this.tabs.push(profile);
                        this.activeTab = this.tabs.lastIndexOf(profile);
                    }
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
                    this.activeTab = -1;
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
                            vm.init();
                        });
                    });
                }));
        },
    };
</script>
