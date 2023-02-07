import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { WebBrowsing,WebBrowsing2,WebBrowsingSTE } from './webbrowsing.model'; 
import  axios  from 'axios';

@Injectable({
  providedIn: 'root'
})
export class WebBrowsinService {

  private webbrowsings: WebBrowsing[] = [];
  private webbrowsingsAdd = new Subject<WebBrowsing[]>();

  private webbrowsings2: WebBrowsing2[] = [];
  private webbrowsingsAdd2 = new Subject<WebBrowsing2[]>();

  private webbrowsingsSTE: WebBrowsingSTE[] = [];
  private webbrowsingsAddSTE = new Subject<WebBrowsingSTE[]>();

  private token: string;
  Message = new EventEmitter<string>();  

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
  }

  addWB1PSMdb(expectedSessionTime: number, sessionTime: number){
    const username = localStorage.getItem('theUser');
    const webbrowsing: WebBrowsing = {expectedSessionTime1PS: expectedSessionTime,sessionTime1PS: sessionTime};
    const headers = {'Authorization': `Bearer ${this.token}`};

       this.http.post<{MOS: string}>(("http://localhost:3000/api/users/"+username+"/web1PageSession"), webbrowsing ,
       { headers }).subscribe(
         (messageData) => {
           this.webbrowsings.push(webbrowsing);
           this.webbrowsingsAdd.next([...this.webbrowsings]);
           this.Message.emit(messageData.MOS);
         },
         error => {
           if (error.status != 200) {
             alert(error.error.message);
           }
         }
       );
  }

  addWB2PSMdb(expectedSessionTime: number, sessionTime: number){
    const username = localStorage.getItem('theUser');
    const webbrowsing2: WebBrowsing2 = {expectedSessionTime2PS: expectedSessionTime,sessionTime2PS: sessionTime};
    const headers = {'Authorization': `Bearer ${this.token}`};

       this.http.post<{MOS: string}>(("http://localhost:3000/api/users/"+username+"/web2PageSession"), webbrowsing2 ,
       { headers }).subscribe(
         (messageData) => {
           this.webbrowsings2.push(webbrowsing2);
           this.webbrowsingsAdd2.next([...this.webbrowsings2]);
           this.Message.emit(messageData.MOS);
         },
         error => {
           if (error.status != 200) {
             alert(error.error.message);
           }
         }
       );
  }

  addWBSTEMdb(expectedSessionTime: number, sessionTime: number){
    const username = localStorage.getItem('theUser');
    const webbrowsingSTE: WebBrowsingSTE = {expectedSessionTimeSTE: expectedSessionTime,sessionTimeSTE: sessionTime};
    const headers = {'Authorization': `Bearer ${this.token}`};

       this.http.post<{MOS: string}>(("http://localhost:3000/api/users/"+username+"/webSingleTimingEvent"), webbrowsingSTE ,
       { headers }).subscribe(
         (messageData) => {
           this.webbrowsingsSTE.push(webbrowsingSTE);
           this.webbrowsingsAddSTE.next([...this.webbrowsingsSTE]);
           this.Message.emit(messageData.MOS);
         },
         error => {
           if (error.status != 200) {
             alert(error.error.message);
           }
         }
       );
  }

  getUsersUpdateListner(){
    return this.webbrowsingsAdd.asObservable();
  }
}
