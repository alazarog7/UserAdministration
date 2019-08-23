import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'detalle-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  cliente: Cliente;
  titulo:string="Detalle Cliente";
  private fotoSeleccionada: File;

  progreso:number = 0;
  constructor(private clienteService: ClienteService,private activateRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(params=>{
      let id:number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente=>{
          this.cliente = cliente;
          console.log(this.cliente);
        });
      }
    })
  }
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image'))//con indexof buscamos la posicion en el array que contenga el texto ima
    {
      swal('Error seleccionar imagen: ','El archivo debe ser del tipo imagen','error');
      this.fotoSeleccionada = null;
    }
  }
  subirFoto(){
    if(!this.fotoSeleccionada){
      swal('Error Upload: ','Debe seleccionar una foto','error')
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(
        event=>{
          //this.cliente=cliente;
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100)
          }else if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            swal('La foto se ha subido completamente',`La foto se ha subido con exito: ${response.mensaje}`,'success')
          }
      
  
        }
      );
    }
  }
}
