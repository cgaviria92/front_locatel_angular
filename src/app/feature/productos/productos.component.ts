import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../core/services/productos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  productoForm: FormGroup;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      valor_venta: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      maneja_iva: [false],
      porcentaje_iva: [{ value: '', disabled: true }, [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.max(20), Validators.min(0.01)]]
    });

    this.productoForm.get('maneja_iva')?.valueChanges.subscribe((value) => {
      const porcentajeIvaControl = this.productoForm.get('porcentaje_iva');
      if (value) {
        porcentajeIvaControl?.enable();
        porcentajeIvaControl?.setValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.max(20), Validators.min(0.01)]);
      } else {
        porcentajeIvaControl?.disable();
        porcentajeIvaControl?.setValue('0');
        porcentajeIvaControl?.clearValidators();
      }
      porcentajeIvaControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error fetching productos', error);
      }
    });
  }

  createProducto() {
    if (this.productoForm.valid) {
      this.productoService.createProducto(this.productoForm.value).subscribe({
        next: (producto) => {
          this.productos.push(producto);
          this.productoForm.reset({ maneja_iva: false, porcentaje_iva: '0' });
        },
        error: (error) => {
          console.error('Error creating producto', error);
        }
      });
    } else {
      alert('Por favor complete correctamente todos los campos.');
    }
  }
}