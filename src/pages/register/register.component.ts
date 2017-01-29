import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async onSubmit() {
    const { email, password, firstName, lastName } = this;
    try {
      await this.authService.register({ email, password, lastName, firstName });
      await this.router.navigate(['/rooms']);
    } catch (err) {

    }
  }
}
