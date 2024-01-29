import { Pipe, PipeTransform } from '@angular/core';
import { formatTimestampWhatsapp } from '../utils/date';

@Pipe({
  name: 'timestampToWhatsapp'
})
export class TimestampToWhatsappPipe implements PipeTransform {

  transform(timestamp: string, ...args: unknown[]): string {
    return formatTimestampWhatsapp(timestamp);
  }
}
