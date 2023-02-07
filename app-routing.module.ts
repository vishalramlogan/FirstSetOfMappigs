import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { VoiceTelHPComponent } from './pages/voice-tel-hp/voice-tel-hp.component';
import { VideoTelHPComponent } from './pages/video-tel-hp/video-tel-hp.component';
import { WebBrowsingHPComponent } from './pages/web-browsing-hp/web-browsing-hp.component';
import { AudioStrHPComponent } from './pages/audio-str-hp/audio-str-hp.component';
import { VideoStrHPComponent } from './pages/video-str-hp/video-str-hp.component';
import { GamingHPComponent } from './pages/gaming-hp/gaming-hp.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { IntroductionUserComponent } from './pages/introduction-user/introduction-user.component';
import { HomepageUserComponent } from './pages/homepage-user/homepage-user.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { WBSTEMComponent } from './pages/wbste-m/wbste-m.component';
import { WB2PMComponent } from './pages/wb2-p-m/wb2-p-m.component';
import { WB1PMComponent } from './pages/wb1-p-m/wb1-p-m.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  {path:'', component: HomepageComponent},
      {path: 'users', component: PasswordResetComponent},
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'admin', component: AdminComponent},
      {path:'introduction', component: IntroductionComponent},
      {path:':username', component: HomepageUserComponent},
      {path:'introduction/:username', component: IntroductionUserComponent},
      {path: 'voiceTelephony/:username', component: VoiceTelHPComponent},
      {path: 'videoTelephony/:username', component: VideoTelHPComponent},
      {path: 'web-browsing/:username', component: WebBrowsingHPComponent},
      {path: 'audioStreaming/:username', component: AudioStrHPComponent},
      {path: 'videoStreaming/:username', component: VideoStrHPComponent},
      {path: 'gaming/:username', component: GamingHPComponent},
      {path: 'usersinfo/:username', component: UserProfileComponent},
      {path: 'users/:username/web1PageSession', component: WB1PMComponent},
      {path: 'users/:username/web2PageSession', component: WB2PMComponent},
      {path: 'users/:username/webSingleTimingEvent', component: WBSTEMComponent},
      {path:'**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
