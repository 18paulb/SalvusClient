import {inject, Injectable} from '@angular/core';
import {UserService} from "./services/UserService";
import {CanActivateFn, Router} from "@angular/router";

export function routeGuards(): CanActivateFn {
  return () => {
    const oauthService: UserService = inject(UserService);
    const router = inject(Router)

    if (oauthService.isAuthenticated()) {
      console.log("You are authenticated")
      return true;
    }

    return router.parseUrl('')
  }
}
