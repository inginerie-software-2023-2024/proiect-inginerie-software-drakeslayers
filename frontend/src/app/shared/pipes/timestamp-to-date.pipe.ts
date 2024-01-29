import { Pipe, PipeTransform } from '@angular/core';
import { formatTimestampDate } from '../utils/date';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {

  transform(timestamp: string, ...args: unknown[]): string {
    return formatTimestampDate(timestamp);
  }
}
