import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleVentaService } from '../../core/services/detalle-venta.service';
import { ProductoService } from '../../core/services/productos.service';
import { VentaService } from '../../core/services/venta.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class DetalleVentaComponent implements OnInit {
  detalleVentaForm: FormGroup;
  productos: any[] = [];
  cabecerasVentas: any[] = [];
  detallesVentas: any[] = [];

  constructor(
    private detalleVentaService: DetalleVentaService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private fb: FormBuilder
  ) {
    this.detalleVentaForm = this.fb.group({
      producto: ['', Validators.required],
      valor_producto: [{ value: '', disabled: true }, Validators.required],
      iva_calculado: [{ value: '', disabled: true }, Validators.required],
      cabecera_venta: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (data: any) => {
        this.productos = data;
      },
      error: (error: any) => {
        console.error('Error fetching productos', error);
      }
    });

    this.ventaService.getCabecerasVentas().subscribe({
      next: (data: any) => {
        this.cabecerasVentas = data;
      },
      error: (error: any) => {
        console.error('Error fetching cabeceras ventas', error);
      }
    });

    this.loadDetallesVentas();

    
    this.detalleVentaForm.get('producto')?.valueChanges.subscribe(productoId => {
      this.updateProductoValues(parseInt(productoId, 10));  
    });
  }

  loadDetallesVentas() {
    this.detalleVentaService.getDetallesVentas().subscribe({
      next: (data: any) => {
        this.detallesVentas = data.map((detalle: any) => {
          const producto = this.productos.find(p => p.id === detalle.producto);
          return { ...detalle, productoNombre: producto ? producto.nombre : 'Desconocido' };
        });
      },
      error: (error: any) => {
        console.error('Error fetching detalles ventas', error);
      }
    });
  }

  updateProductoValues(productoId: number) {
    const producto = this.productos.find(p => p.id === productoId);
    if (producto) {
      const valorProducto = parseFloat(producto.valor_venta);
      const porcentajeIVA = producto.maneja_iva ? parseFloat(producto.porcentaje_iva) : 0;
      const ivaCalculado = valorProducto * (porcentajeIVA / 100);

      this.detalleVentaForm.patchValue({
        valor_producto: valorProducto.toFixed(2),
        iva_calculado: ivaCalculado.toFixed(2)
      });
    }
  }

  createDetalleVenta() {
    console.log("Form Value Before Submit:", this.detalleVentaForm.value);
    if (this.detalleVentaForm.valid) {
      const detalleData = this.detalleVentaForm.getRawValue(); 
      console.log("Detalle Data Before Parsing:", detalleData); 
      detalleData.producto = parseInt(detalleData.producto, 10);
      // detalleData.cabecera_venta se mantiene como string
      detalleData.valor_producto = detalleData.valor_producto.toString();
      detalleData.iva_calculado = detalleData.iva_calculado.toString();

      console.log("Detalle Data After Parsing:", detalleData); 

      this.detalleVentaService.createDetalleVenta(detalleData).subscribe({
        next: (detalleVenta: any) => {
          const producto = this.productos.find(p => p.id === detalleVenta.producto);
          this.detallesVentas.push({ ...detalleVenta, productoNombre: producto ? producto.nombre : 'Desconocido' });
          alert('Detalle de venta creado exitosamente');
          this.detalleVentaForm.reset();
          this.detalleVentaForm.get('valor_producto')?.disable();
          this.detalleVentaForm.get('iva_calculado')?.disable();
        },
        error: (error: any) => {
          console.error('Error creating detalle venta', error);
        }
      });
    } else {
      alert('Por favor complete correctamente todos los campos.');
    }
  }
}
