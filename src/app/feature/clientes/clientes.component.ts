import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../core/services/cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  clienteForm: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error fetching clientes', error);
      }
    });
  }

  createCliente() {
    if (this.clienteForm.valid) {
      this.clienteService.createCliente(this.clienteForm.value).subscribe({
        next: (cliente) => {
          this.clientes.push(cliente);
          this.clienteForm.reset();
        },
        error: (error) => {
          console.error('Error creating cliente', error);
        }
      });
    } else {
      
      alert('Por favor complete correctamente todos los campos.');
    }
  }
}
