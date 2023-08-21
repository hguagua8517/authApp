import {  CanActivateFn, Router} from '@angular/router';
import { inject} from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { tap } from 'rxjs';


export const validarTokenGuard: CanActivateFn = (route , state) => {
  console.log('CanActiveFn');
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.validarToken()
  .pipe(
    tap(valid => {
      if (!valid){
         router.navigateByUrl('/auth/login');
      }
    })
  );
};
