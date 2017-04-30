import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    showError = false;

    constructor(
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
    ) { }

    async onSubmit() {
      if (!this.email || !this.password) {
        this.showError = true;
        return;
      }

      try {
        await this.authService.login(this.email, this.password);
        this.showError = false;
        const redirectRoute = this.route.snapshot.queryParamMap.get('redirectTo');
        this.router.navigateByUrl(redirectRoute ? redirectRoute : '/rooms');
      } catch(err) {
        this.showError = true;
      }
    }
}
