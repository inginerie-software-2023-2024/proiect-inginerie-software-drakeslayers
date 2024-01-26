import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postLink'
})
export class PostLinkPipe implements PipeTransform {
  transform(value: string | undefined, ...args: unknown[]): string {
    return !!value ? '/posts/' + value : '/';
  }
}
