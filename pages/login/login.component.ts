import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string;

  constructor(public usersService: UsersService) { 
    this.usersService.errorMessage.subscribe(message => {
      this.errorMessage = message;
      alert(message)
    });
  }

  login(event){
    event.preventDefault()
    const target = event.target
    const username = target.querySelector('#username').value
    const password = target.querySelector('#password').value

    this.usersService.logindb(username,password)
  }

ngOnInit(): void {
}
}

