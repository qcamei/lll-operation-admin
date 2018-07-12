import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
    // () => require('module')
    // transformed by babel-plugin-dynamic-import-node-sync
    if (component.toString().indexOf('.then(') < 0) {
        models.forEach((model) => {
            if (modelNotExisted(app, model)) {
                // eslint-disable-next-line
                app.model(require(`../models/${model}`).default);
            }
        });
        return (props) => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return createElement(component().default, {
                ...props,
                routerData: routerDataCache,
            });
        };
    }
    // () => import('module')
    return dynamic({
        app,
        models: () =>
            models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
        // add routerData prop
        component: () => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return component().then((raw) => {
                const Component = raw.default || raw;
                return props =>
                    createElement(Component, {
                        ...props,
                        routerData: routerDataCache,
                    });
            });
        },
    });
};

function getFlatMenuData(menus) {
    let keys = {};
    menus.forEach((item) => {
        if (item.children) {
            keys[item.path] = { ...item };
            keys = { ...keys, ...getFlatMenuData(item.children) };
        } else {
            keys[item.path] = { ...item };
        }
    });
    return keys;
}

export const getRouterData = (app) => {
    const routerConfig = {
        '/': {
            component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
        },
        '/exception/403': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
        },
        '/exception/404': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
        },
        '/exception/500': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
        },
        '/exception/trigger': {
            component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
        },
        '/user': {
            component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        },
        '/goods/list': {
            component: dynamicWrapper(app, ['good', 'catalog'], () => import('../routes/GoodsManager')),
        },
        '/goods/:list/detail': {
            component: dynamicWrapper(app, ['user', 'good', 'logs'], () => import('../routes/GoodDetail/GoodDetail')),
            name: '商品详情页',
        },
        '/product/list': {
            component: dynamicWrapper(app, ['product', 'testApi','catalog'], () => import('../routes/ProductManager')),
        },
        '/product/model': {
            component: dynamicWrapper(app, ['brand', 'product', 'good', 'productModel', 'catalog'], () => import('../routes/ProductModel/ProductModelList')),
        },
        '/product/:model/add': {
            component: dynamicWrapper(app, ['catalog', 'upload', 'brand', 'product', 'productModel'], () => import('../routes/ProductModel/ProductModelNew')),
        },
        '/product/:model/edit': {
            component: dynamicWrapper(app, ['brand', 'upload', 'productModel', 'logs'], () => import('../routes/ProductModel/ProductModelModify')),
        },
        '/product/:model/view': {
            component: dynamicWrapper(app, ['brand', 'productModel', 'logs'], () => import('../routes/ProductModel/ProductModelDetail')),
            name: '查看产品型号',
        },
        '/product/:list/new': {
            component: dynamicWrapper(app, ['product', 'catalog', 'brand', 'upload'], () => import('../routes/NewProduct/NewProduct')),
            name: '新建产品信息',
        },
        '/product/:list/detail': {
            component: dynamicWrapper(app, ['product', 'catalog', 'upload', 'logs'], () => import('../routes/ProductDetail/ProductDetail')),
            name: '产品详情',
        },
        '/product/:list/modify': {
            component: dynamicWrapper(app, ['product', 'catalog', 'upload', 'logs'], () => import('../routes/NewProduct/ModifyProduct')),
            name: '产品信息',
        },
        '/product/menu': {
            component: dynamicWrapper(app, ['catalog'], () => import('../routes/Menu/MenuManager')),
        },
        '/orders/list': {
            component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/OrderList')),
        },
        '/orders/exception-list': {
            component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/ExceptionOrderList')),
        },
        '/orders/:list/detail': {
            component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/OrderDetail')),
            name: '订单详情',
        },
        '/orders/:exception-list/sold-out-order': {
            component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/SoldOutOrderDetail')),
            name: '订单详情',
        },
        '/orders/:exception-list/delay-order': {
            component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/DelayOrderDetail')),
            name: '订单详情',
        },
        '/returns/list': {
            component: dynamicWrapper(app, ['order', 'catalog', 'returns'], () => import('../routes/Returns/ReturnsList')),
        },
        '/returns/:list/detail': {
            component: dynamicWrapper(app, ['order', 'catalog', 'returns'], () => import('../routes/Returns/ReturnsDetail')),
            name: '退货单详情',
        },
        '/brand/list': {
            component: dynamicWrapper(app, ['brand'], () => import('../routes/Brand/BrandList')),
        },
        '/brand/:list/new': {
            component: dynamicWrapper(app, ['brand', 'upload', 'catalog'], () => import('../routes/Brand/BrandNew')),
            name: '新增品牌',
        },
        '/brand/:list/modify': {
            component: dynamicWrapper(app, ['brand', 'upload'], () => import('../routes/Brand/BrandModify')),
            name: '编辑品牌',
        },
        '/brand/:list/detail': {
            component: dynamicWrapper(app, ['brand', 'upload', 'product', 'logs'], () => import('../routes/Brand/BrandDetail')),
            name: '品牌详情',
        },
        '/solution/priceQuotation': {
            component: dynamicWrapper(app, ['solution'], () => import('../routes/SolutionManagement')),
            name: '方案询价列表',
        },
        '/solution/:priceQuotation/solutionDetail': {
            component: dynamicWrapper(app, ['solution'], () => import('../routes/SolutionManagement/SolutionDetail')),
            name: '方案详情',
        },
        '/solution/orders': {
            component: dynamicWrapper(app, ['solutionOrders'], () => import('../routes/SolutionOrdersManagement')),
            name: '方案订单列表',
        },
        '/solution/:orders/detail': {
            component: dynamicWrapper(app, ['solutionOrders'], () => import('../routes/SolutionOrdersManagement/SolutionOrderDetail')),
            name: '方案订单详情',
        },
        '/stockManagement/goodsStockList': {
            component: dynamicWrapper(app, ['stock'], () => import('../routes/StockManagement/GoodsStockList'))
        },
        '/stockManagement/goodsStockRecordList':{
            component: dynamicWrapper(app,['stock'],()=>import('../routes/StockManagement/GoodsStockRecordList'))
        },
        '/stockManagement/stockConfigList':{
            component: dynamicWrapper(app,['stock'],()=>import('../routes/StockManagement/StockConfigList'))
        }
    };

    // Get name from ./menu.js or just set it in the router data.
    const menuData = getFlatMenuData(getMenuData());

    // Route configuration data
    // eg. {name,authority ...routerConfig }
    const routerData = {};
    // The route matches the menu
    Object.keys(routerConfig).forEach((path) => {
        // Regular match item name
        // eg.  router /user/:id === /user/chen
        const pathRegexp = pathToRegexp(path);
        const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
        let menuItem = {};
        // If menuKey is not empty
        if (menuKey) {
            menuItem = menuData[menuKey];
        }
        let router = routerConfig[path];
        // If you need to configure complex parameter routing,
        // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
        // eg . /list/:type/user/info/:id
        router = {
            ...router,
            name: router.name || menuItem.name,
            authority: router.authority || menuItem.authority,
            hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
        };
        routerData[path] = router;
    });
    return routerData;
};
