import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { filter } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginator: any;

  constructor(private clienteService: ClienteService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      params=>{
        console.log("imprimiendo paginacion ....")
        console.log(params)
        let page:number = +params.get('page');
        if(!page){
          page=0
        }
        this.clienteService.getClientes(page).pipe(tap(response=>console.log(response))).subscribe(
           (response:any) =>{
            console.log("enviando el paginador")
            console.log(response);
            this.clientes = response.content as Cliente[];
            this.paginator = response;
           }
        );
      }
    );
    
  }

  delete(cliente: Cliente):void{
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })
    
    swalWithBootstrapButtons({
      title: 'Esta seguro?',
      text: `Seguro que quiere eliminar a ${cliente.nombre} ${cliente.apellido}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response =>{
            this.clientes = this.clientes.filter(cli => cli !=cliente)
            swalWithBootstrapButtons(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        )
        
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

}
