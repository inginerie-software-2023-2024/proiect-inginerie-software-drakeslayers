import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToHour'
})
export class TimestampToHourPipe implements PipeTransform {
  transform(timestamp: string, ...args: unknown[]): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}
