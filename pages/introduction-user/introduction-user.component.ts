import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-introduction-user',
  templateUrl: './introduction-user.component.html',
  styleUrls: ['./introduction-user.component.scss']
})

export class IntroductionUserComponent implements OnInit{
  constructor( private router: Router) { 
  } 

  ngOnInit(): void {
  }

  navigateToHomepage() {
    const username = localStorage.getItem('theUser');
    this.router.navigate(['', username]);
  }

  ngOnDestroy(){
  }
}
