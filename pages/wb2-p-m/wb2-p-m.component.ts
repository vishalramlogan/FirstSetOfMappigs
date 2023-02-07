import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {WebBrowsinService} from 'src/app/web-browsin.service';
import { WebBrowsing } from '../../webbrowsing.model';

@Component({
  selector: 'app-wb2-p-m',
  templateUrl: './wb2-p-m.component.html',
  styleUrls: ['./wb2-p-m.component.scss']
})
export class WB2PMComponent implements OnInit {
  Message: string;

  constructor(public webbrowsingService:WebBrowsinService, private router: Router) { 
    this.webbrowsingService.Message.subscribe(MOS =>{
      let rounded = parseFloat(MOS).toFixed(2);
      this.Message =rounded;
    });
  } 

  private webbrowsingsSub: Subscription;

  webbrowsings: WebBrowsing[] = [];

  ngOnInit(): void {
    this.webbrowsingsSub = this.webbrowsingService.getUsersUpdateListner().subscribe((webbrowsings: WebBrowsing[])=>{
      this.webbrowsings = webbrowsings;
    })
    const username = localStorage.getItem('theUser');
    document.getElementById('username-value').innerHTML = username;
  }
 
  navigateToHomepage() {
    const username = localStorage.getItem('theUser');
    this.router.navigate(['', username]);
  } 

  navigateToWebBrowsing(){
    const username = localStorage.getItem('theUser');
    this.router.navigate(['web-browsing', username]);
  }

  navigateToUserProfile() {
    const username = localStorage.getItem('theUser');
    this.router.navigate(['usersinfo', username]);
  }

  calculate(event){
    event.preventDefault()
    const target = event.target
    const expectedSessionTime = target.querySelector('#expectedSessionTime').value
    const sessionTime = target.querySelector('#sessionTime').value

    this.webbrowsingService.addWB2PSMdb(expectedSessionTime,sessionTime)
  }

  ngOnDestroy(){
    this.webbrowsingsSub.unsubscribe();
  }


}
