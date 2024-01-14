import { Component, Input } from '@angular/core';

@Component({
  selector: 'mds-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() postId?: string;
  @Input() type?: string;

  constructor() {}
}
