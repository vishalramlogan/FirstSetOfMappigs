import { Component, OnInit } from '@angular/core';
import {User} from '../../user.model'
import { Router } from '@angular/router'; 
import { UsersService } from 'src/app/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errorMessage: string;

  constructor(public usersService: UsersService, private router: Router) { 
    this.usersService.errorMessage.subscribe(message => {
      this.errorMessage = message;
      alert(message)
    });
  }
  private usersSub: Subscription;

  users: User[] = [];

  addUser(event){
    event.preventDefault()
    const target = event.target
    const username = target.querySelector('#username').value
    const password = target.querySelector('#password').value
    const passwordConfirmation = target.querySelector('#passwordConfirmation').value
    const securityQuestion = target.querySelector('#securityQuestion').value
    const securityQuestionAnswer = target.querySelector('#securityQuestionAnswer').value

    this.usersService.addUserdb(username,password,passwordConfirmation,securityQuestion,securityQuestionAnswer)
  }

  ngOnInit(): void {
    this.usersSub = this.usersService.getUsersUpdateListner().subscribe((users: User[])=>{
      this.users = users;
    })
  }

  ngOnDestroy(){
    this.usersSub.unsubscribe();
  }
}
