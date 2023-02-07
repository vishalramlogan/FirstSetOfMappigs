import { Component, OnInit, Output , EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})

export class PasswordResetComponent implements OnInit {

  MessageSQ: string;
  errorMessage: string;
  constructor(public usersService: UsersService, private router: Router) { 
    this.usersService.errorMessage.subscribe(message => {
      this.errorMessage = message;
      alert(message)
    });
    this.usersService.MessageSQ.subscribe(messageSQD =>{
      this.MessageSQ = messageSQD;
    })
  } 
 
  passwordReset(event){
    event.preventDefault()
    const target = event.target
    const username = target.querySelector('#username').value
    const password = target.querySelector('#newPassword').value
    const passwordConfirmation = target.querySelector('#passwordConfirmation').value
    const securityQuestionAnswer = target.querySelector('#securityQuestionAnswer').value
    
    this.usersService.passwordResetdb(username,password,passwordConfirmation,securityQuestionAnswer)
    this.usersService.passwordResetdbSQ(username)
    
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
  }
}