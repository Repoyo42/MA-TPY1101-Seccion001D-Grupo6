import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (typeof window === 'undefined') {
    return next(req);
  }

  const publicRoutes = [
    '/api/auth/login',
    '/api/usuarios'
  ];

  const isPublicRoute = publicRoutes.some(route =>
    req.url.includes(route)
  );

  if (isPublicRoute) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};