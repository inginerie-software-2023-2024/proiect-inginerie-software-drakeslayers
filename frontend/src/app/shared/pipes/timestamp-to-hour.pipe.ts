import { Pipe, PipeTransform } from '@angular/core';
import { formatTimestampHour } from '../utils/date';

@Pipe({
  name: 'timestampToHour'
})
export class TimestampToHourPipe implements PipeTransform {
  transform(timestamp: string, ...args: unknown[]): string {
    return formatTimestampHour(timestamp);
  }
}
