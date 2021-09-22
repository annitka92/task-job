import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {first} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  // @ts-ignore
  loginForm: FormGroup;
  submitted = false;
  errorMessages = {
    username: '',
    password: ''
  }

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const data = {
      username: this.form.username.value,
      password: this.form.password.value
    }
    this.authService.login(data)
      .pipe(first())
      .subscribe(
        resp => {
          if (resp.status === 'ok') {
            this.router.navigate(['/']);
            this.errorMessages.username = ''
            this.errorMessages.password = ''
          } else {
            this.errorMessages = resp.message
          }
        });
  }

  validateField(field: string) {
    return `${this.form}.${field}.errors?.${field}` || `${this.form}.${field}.dirty` || `${this.form}.${field}.touched`
  }
}
