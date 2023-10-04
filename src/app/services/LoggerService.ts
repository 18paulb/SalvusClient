import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {

  constructor() { }

  log(message: string): void {
    console.log(`Log: ${message}`);
  }

  error(message: string, obj = {}): void {
    console.error(`Error: ${message}`, obj);
  }

  warn(message: string): void {
    console.warn(`Warning: ${message}`);
  }

  info(message: string): void {
    console.info(`Info: ${message}`);
  }

  debug(message: string, obj = {}): void {
    console.debug("Debug: " + message, obj);
  }
}
