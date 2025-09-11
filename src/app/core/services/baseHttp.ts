import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export abstract class BaseHttpService {
  protected readonly http = inject(HttpClient);
  get<T>(url: string, filters?: Params, headers?: {}) {
    return this.http.get<T>(url, { params: filters, headers: headers });
  }

  post<T>(url: string, data: {}, headers?: {}) {
    return this.http.post<T>(url, data, {
        headers: headers
    });
  }
  delete<T>(url: string, data?: {}, headers?: {}) {
    return this.http.delete<T>(url, {
        body: data,
        headers: headers
    });
  }
  put<T>(url: string, data: {},headers?: {}) {
    return this.http.put<T>(url, data, {
        headers: headers
    });
  }
}
