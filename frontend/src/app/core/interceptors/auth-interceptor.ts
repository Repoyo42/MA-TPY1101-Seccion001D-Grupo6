import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (typeof window === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('token');

  // URLs públicas exactas
  const publicUrls = [
    '/api/auth/login',
    '/api/usuarios'
  ];

  const isPublic = publicUrls.some(url =>
    req.url.includes(url)
  );

  // SOLO bloquear token si es público
  if (isPublic) {
    return next(req);
  }

  // DEBUG IMPORTANTE (te ayuda ahora)
  console.log('Interceptando request:', req.url);
  console.log('Token existe:', !!token);

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};