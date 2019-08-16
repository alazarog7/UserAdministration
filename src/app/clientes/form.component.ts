import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatNativeDateModule} from '@angular/material';
import swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  
  private titulo:string="Crear Cliente";
  private cliente:Cliente = new Cliente();
  private errores:string[];
  constructor(private clienteService:ClienteService,private router:Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  public create():void{
    //console.log("Clicked");
    //console.log(this.cliente);
    this.clienteService.createCliente(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal('Nuevo Cliente', `Cliente ${cliente.nombre} creado con exito`,'success');
      },
      err=>{
      this.errores = err.error.errors as string[];
      console.error("Codigo del error desde el backend:"+err.error.status);
      console.error(err.error.errors);
      }
    )
  }

  public cargarCliente():void{
    //Activated route nos permite obtener el id de la ruta
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        )
      }
    })
  }
  public update():void{
    this.clienteService.updateCliente(this.cliente).subscribe(
      (cliente)=>{
        this.router.navigate(['/clientes']);
        swal('Cliente Actualizado',`Cliente ${cliente.nombre} actualizado con exito`,'success')
      },
      err=>{
        this.errores = err.error.errors as string[];
        console.error("Codigo del error desde el backend:"+err.error.status);
        console.error(err.error.errors);
        }
    )
  }

}
