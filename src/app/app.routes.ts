import { Routes } from '@angular/router';
import { AuthCallbackComponent, authGuard } from './A-Auth';
import { CategoriesComponent, ChartWhComponent, HomeComponent, OrderComponent, ProductComponent, ProductsComponent, WarehouseManageComponent } from './A-Page';

export const routes: Routes = [
    // Route per il callback OAuth
    { path: 'auth-callback', component: AuthCallbackComponent },

    // rotta pubblica che reindirizza a home
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // queste due rotte sono dentro la guard
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'warehouse', component: WarehouseManageComponent, canActivate: [authGuard] },
    { path: 'warehouse/:idWarehouse/products', component: ProductsComponent, canActivate: [authGuard] },
    { path: 'warehouse/:idWarehouse/products/:idProduct/order/:idOrder', component: OrderComponent, canActivate: [authGuard] },
    { path: 'warehouse/:idWarehouse/product/:idProduct', component: ProductComponent, canActivate: [authGuard] },
    { path: 'warehouse/:idWarehouse/categories', component: CategoriesComponent, canActivate: [authGuard] },
    { path: 'chart-wh', component: ChartWhComponent, canActivate: [authGuard] },

    // Route wildcard per gestire 404
    { path: '**', redirectTo: 'home' }
];
    