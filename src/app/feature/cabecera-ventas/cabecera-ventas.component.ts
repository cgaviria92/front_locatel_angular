import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { VentaService } from '../../core/services/venta.service';
import { ClienteService } from '../../core/services/cliente.service';
import { ProductoService } from '../../core/services/productos.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cabecera-ventas',
  templateUrl: './cabecera-ventas.component.html',
  styleUrls: ['./cabecera-ventas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CabeceraVentasComponent implements OnInit {
  cabecerasVentas: any[] = [];
  filteredCabeceras: any[] = [];
  clientes: any[] = [];
  productos: any[] = [];
  cabeceraVentaForm: FormGroup;
  filtroForm: FormGroup;

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {
    this.cabeceraVentaForm = this.fb.group({
      consecutivo: [''],
      fecha: [this.getCurrentDate(), Validators.required],
      cliente: ['', Validators.required],
      total_venta: [{ value: '', disabled: true }, Validators.required],
      detalles: this.fb.array([this.createDetalleFormGroup()])
    });

    this.filtroForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  ngOnInit() {
    this.ventaService.getCabecerasVentas().subscribe({
      next: (data) => {
        this.cabecerasVentas = data;
        this.filteredCabeceras = data;
        this.mapClientNames();
      },
      error: (error) => {
        console.error('Error fetching cabeceras ventas', error);
      }
    });

    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.mapClientNames();
      },
      error: (error) => {
        console.error('Error fetching clientes', error);
      }
    });

    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error fetching productos', error);
      }
    });
  }
  // Fecha actual fijada.
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get detalles(): FormArray {
    return this.cabeceraVentaForm.get('detalles') as FormArray;
  }

  createDetalleFormGroup(): FormGroup {
    const detalleFormGroup = this.fb.group({
      producto: ['', Validators.required],
      valor_producto: [{ value: '', disabled: true }, Validators.required],
      iva_calculado: [{ value: '', disabled: true }, Validators.required]
    });

    detalleFormGroup.get('producto')?.valueChanges.subscribe(value => {
      if (value) {
        this.updateProducto(detalleFormGroup, +value); // Convertimos el valor a número por que llega como str
      }
    });

    return detalleFormGroup;
  }

  addDetalle() {
    this.detalles.push(this.createDetalleFormGroup());
  }

  removeDetalle(index: number) {
    this.detalles.removeAt(index);
    this.updateTotalVenta();
  }

  updateProducto(detalle: FormGroup, productoId: number) {
    const producto = this.productos.find(p => p.id === productoId);

    if (producto) {
      console.log("imprimo el producto", producto);
      const valorProducto = parseFloat(producto.valor_venta); // Aseguramos que sea un número
      const porcentajeIva = parseFloat(producto.porcentaje_iva) / 100; //se convierte a porcentaje
      const ivaCalculado = valorProducto * porcentajeIva; // Usamos el porcentaje_iva del producto para multiplicarlo y sacar el %
      console.log("ivaCalculado", ivaCalculado);
      console.log("valorProducto", valorProducto);

      detalle.patchValue({
        valor_producto: valorProducto.toFixed(2), // Formateamos a 2 decimales
        iva_calculado: ivaCalculado.toFixed(2) // Formateamos a 2 decimales
      });

      this.updateTotalVenta();
    }
  }

  updateTotalVenta() {
    let total = 0;
    this.detalles.controls.forEach(detalle => {
      const valorProducto = parseFloat(detalle.get('valor_producto')?.value) || 0;
      const ivaCalculado = parseFloat(detalle.get('iva_calculado')?.value) || 0;
      total += valorProducto + ivaCalculado;
    });
    this.cabeceraVentaForm.get('total_venta')?.setValue(total.toFixed(2));
  }

  createCabeceraVenta() {
    if (this.cabeceraVentaForm.valid) {
      const ventaData = this.cabeceraVentaForm.getRawValue();
      ventaData.detalles.forEach((detalle: any) => {
        detalle.producto = parseInt(detalle.producto, 10);
        detalle.valor_producto = detalle.valor_producto.toString();
        detalle.iva_calculado = detalle.iva_calculado.toString();
      });
      ventaData.cliente = parseInt(ventaData.cliente, 10);
      ventaData.total_venta = ventaData.total_venta.toString();

      this.ventaService.createCabeceraVenta(ventaData).subscribe({
        next: (cabeceraVenta) => {
          this.cabecerasVentas.push(cabeceraVenta);
          this.mapClientNames();
          this.cabeceraVentaForm.reset({ fecha: this.getCurrentDate(), total_venta: '' });
          this.detalles.clear();
          this.addDetalle();
          this.filtrarCabeceras();
        },
        error: (error) => {
          console.error('Error creating cabecera venta', error);
        }
      });
    } else {
      alert('Por favor complete correctamente todos los campos.');
    }
  }

  mapClientNames() {
    if (this.cabecerasVentas.length && this.clientes.length) {
      this.cabecerasVentas.forEach(cabecera => {
        const cliente = this.clientes.find(c => c.id === cabecera.cliente);
        if (cliente) {
          cabecera.clienteNombre = cliente.nombre;
        }
      });
    }
  }

  filtrarCabeceras() {
    const { fechaInicio, fechaFin } = this.filtroForm.value;
    this.filteredCabeceras = this.cabecerasVentas.filter(cabecera => {
      const fecha = new Date(cabecera.fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;
      return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    });
    this.ordenarPorFecha();
  }

  ordenarPorFecha() {
    this.filteredCabeceras.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }
}
