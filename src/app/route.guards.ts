import {inject} from '@angular/core';
import {UserService} from "./services/UserService";
import {CanActivateFn, Router} from "@angular/router";
import {map} from "rxjs";

export function routeGuards(): CanActivateFn {
  return () => {
    const oauthService: UserService = inject(UserService);
    const router = inject(Router);

    return oauthService.isAuthenticated().pipe(
      map(response => {
        if (response.status !== 200) {
          console.log("Invalid authtoken, routing to login and logging out");
          oauthService.logout();
          router.navigate(['/']);
          return false;
        }
        console.log("You are authenticated");
        return true;
      })
    );
  }
}
