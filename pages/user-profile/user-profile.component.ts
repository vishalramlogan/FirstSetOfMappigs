import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { Router } from '@angular/router';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{

  Response: Array<any>;
  audioStreamingHRArray: Array<any>;

  constructor(public usersService: UsersService, private router: Router) { 
    this.usersService.Response.subscribe(response =>{
      this.Response = response;
      //console.log(this.Response)
    });
  } 

  ngOnInit(): void {
    this.usersService.getUserInfo();
    const username = localStorage.getItem('theUser');
    document.getElementById('username-value').innerHTML = username;
  }

  navigateToHomepage() {
    const username = localStorage.getItem('theUser');
    this.router.navigate(['', username]);
  }

  ngOnDestroy(){
  }

}
