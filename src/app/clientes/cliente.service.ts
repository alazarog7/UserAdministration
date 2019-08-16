import { Injectable } from '@angular/core';
import {formatDate, DatePipe, registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es-BO';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable,throwError } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError,tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';



@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8089/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  constructor(private http: HttpClient,private router:Router,private activatedRoute : ActivatedRoute) { }
  
  getClientes(page:number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      tap(
        (response:any) =>{
          console.log("TAP 1");
          console.log(response);
        }
      ),
      map((response:any) =>{
        (response.content as Cliente[]).map(
          cliente =>{
            cliente.nombre = cliente.nombre[0].toLocaleUpperCase()+cliente.nombre.substring(1,cliente.nombre.length);
            cliente.apellido = cliente.apellido[0].toLocaleUpperCase()+cliente.apellido.substring(1,cliente.apellido.length);
            registerLocaleData(localeES,'es')
            //let datePipe = new DatePipe('es');
            //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy','en-US');
            //cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');
            return cliente;
          }
        )
        return response;
      }),
      tap(
        (response:any) =>{
          console.log("TAP 2");
          console.log(response);
        }
      ),
      catchError((e)=>{
        swal("Error al listar los usuarios");
        return throwError(e);
      })
    );
  }
  createCliente(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers: this.httpHeaders}).pipe(
      map(
        (response:any)=>response.cliente as Cliente
      ),
      catchError((e)=>{
        if(e.status==400){
          return throwError(e);
        }
        console.error("Error al crear al usuario");
        swal(e.error.mensaje,e.error.error,"error");
        return throwError(e);
      })
    )
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal("El cliente no existe", e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  updateCliente( cliente: Cliente):Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
      map(
        (response: any) => response.cliente as Cliente 
      ),
      catchError(e=>{
        if(e.status==400){
          return throwError(e);
        }
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal(e.error.mensaje,e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError(e=>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal(e.error.mensaje,e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
