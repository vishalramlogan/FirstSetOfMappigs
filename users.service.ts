import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  errorMessage = new EventEmitter<string>();
  MessageSQ = new EventEmitter<string>();  
  Response = new EventEmitter<[]>();  

  private users: User[] = [];
  private usersAdd = new Subject<User[]>();
  

  constructor(private http: HttpClient,private router: Router) { 
  }

  addUserdb(username: string, password: string, passwordConfirmation: string, securityQuestion: string, securityQuestionAnswer: string){
    const user: User = {username: username, password: password, passwordConfirmation: passwordConfirmation,
       securityQuestion: securityQuestion, securityQuestionAnswer: securityQuestionAnswer};

       this.http.post<{message: string,token: string}>("http://localhost:3000/api/signup", user).subscribe(
         (response) => {
           this.users.push(user);
           this.usersAdd.next([...this.users]);
           localStorage.setItem('token', response.token);
           localStorage.setItem('theUser', username);
           this.router.navigate(['usersinfo', username]);
         },
         error => {
           if (error.status === 409) {
             this.errorMessage.emit(error.error.message);
           }
         } 
       );
  }

  logindb(username: string, password: string,){
    const passon = {username: username, password: password};

    this.http.post<{token: string}>("http://localhost:3000/api/login", passon).subscribe(
         (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('theUser', username);
          this.router.navigate(['usersinfo', username]);
         },
         error => {
           if (error.status === 401) {
             this.errorMessage.emit(error.error.message);
           }
         }
       );
  }

  passwordResetdb(username: string, password: string, passwordConfirmation: string, securityQuestionAnswer: string){
    const passon = {username: username, password: password, passwordConfirmation: passwordConfirmation,
       securityQuestionAnswer: securityQuestionAnswer};

       this.http.put<{message: string}>("http://localhost:3000/api/users", passon).subscribe(
         () => {
          this.errorMessage.emit("Success");
         },
         error => {
           if (error.status === 401) {
             this.errorMessage.emit(error.error.message);
           }
         }
       );
  }

  passwordResetdbSQ(username: string){
       this.http.get<{messageSQD: string}>("http://localhost:3000/api/users?username="+username)
       .subscribe(messageData => {
        this.MessageSQ.emit(messageData.messageSQD);
      });
  }

  getUserInfo(){
    const username = localStorage.getItem('theUser');
    this.http.get<{response: []}>("http://localhost:3000/api/usersinfo?username="+username)
    .subscribe(messageData => {
      this.Response.emit(messageData.response);
    });
}

  getUsersUpdateListner(){
    return this.usersAdd.asObservable();
  }

}
