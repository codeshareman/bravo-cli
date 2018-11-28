const menu = [
    {
        id: 1,
        sort: 1,
        path: '/user',
        name: '用户登录',
        isShow: true,
        authority: ['user', 'admin'],
        children: [
            { path: '/user', redirect: '/user/login' },
            { path: '/user/login', component: '/user/Login' },
            { path: '/user/register', component: '/user/Register' },
            { path: '/user/register/result', component: '/user/register/result' },
        ]
    },
    {
        id: 2,
        sort: 2,
        path: '/',
        name: '侧边栏菜单',
        component: '',
        isShow: true,
        authority: ['user', 'admin'],
        children: [{
            id: 1002,
            title: '用户管理',
            path: '/userManage',
            iconClass: 'dashboard',
            sort: 1,
            children: [
                { path: '/user/authority', component: '../containers/User/AuthManage' },
                { path: '/user/manage', component: '../containers/User/UserManage' }
            ]
        }, {
            id: 1002,
            title: 'DashBoard',
            path: '/dashboard',
            component: '',
            iconClass: 'dashboard',
            sort: 2,
            hidden: false,
            children: [
                { path: '/dashboard/workbench', component: '../containers/DashBoard/Workbench' },
                { path: '/dashboard/data-analyse', component: '../containers/DashBoard/DataAnalyse' },
                { path: '/dashboard/realtime-watch', component: '../containers/DashBoard/RealtimeWatch' },
            ]
        }, {
            id: 1003,
            title: '表单页',
            path: '/dashboard',
            component: '',
            iconClass: 'dashboard',
            sort: 2,
            hidden: false,
            children: [{
                id: 1003,
                title: 'Form表单',
                path: '/dashboard',
                component: '',
                iconClass: 'dashboard',
                sort: 2,
                hidden: false,      
            }]       
        }]
    }
]
export default menu;