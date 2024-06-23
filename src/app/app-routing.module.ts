import { Routes } from '@angular/router';
import { LoginComponent } from './feature/login/login.component';
import { HomeComponent } from './feature/home/home.component';
import { ClientesComponent } from './feature/clientes/clientes.component';
import { ProductosComponent } from './feature/productos/productos.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CabeceraVentasComponent } from './feature/cabecera-ventas/cabecera-ventas.component';
import { DetalleVentaComponent } from './feature/detalle-venta/detalle-venta.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] },
  { path: 'cabecera-ventas', component: CabeceraVentasComponent, canActivate: [AuthGuard] },
  { path: 'detalle-venta', component: DetalleVentaComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


// export const appRoutingProviders: any[] = [];

// export const routing = RouterModule.forRoot(routes);
