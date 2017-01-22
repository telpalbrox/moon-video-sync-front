import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  constructor(private authService: AuthService) { }

  onSubmit() {
    const { email, password, firstName, lastName } = this;
    this.authService.register({ email, password, lastName, firstName });
  }
}
