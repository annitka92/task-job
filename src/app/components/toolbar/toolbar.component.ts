import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  isAuth: Boolean = false
  authSubscription;

  constructor(public authService: AuthService,
              private router: Router) {
    this.authSubscription = this.authService.currentTokenSubject.subscribe(resp => (this.isAuth = resp));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  login(): void {
    this.router.navigate(['login']);
  }

  logout(): void {
    this.authService.logout();
  }
}
