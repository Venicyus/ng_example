import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  isHidePassword = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onclickEntrar(): void {
    if (this.email.valid && this.password.valid) {
      this.authService
        .login(this.email.value, this.password.value)
        .toPromise()
        .catch((error) => {
          console.log(error);
        });

      console.log(this.authService.teste);
    }
  }
}
