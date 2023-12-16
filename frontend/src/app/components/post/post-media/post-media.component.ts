import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mds-post-media',
  templateUrl: './post-media.component.html',
  styleUrls: ['./post-media.component.scss']
})
export class PostMediaComponent implements OnChanges {
  @Input() public picturesURLs: string[] | undefined;

  public numberOfPictures: number = 0;
  public currentIndex: number = 0;
  public prevIndex: number = -1;
  public nextIndex: number = 1;

  constructor() {}

  // get next or previous index, without going out of bounds
  private getIndex(currentIndex: number, direction: 'prev' | 'next', numberOfPictures: number): number {
    if (direction === 'prev') {
      return Math.max(currentIndex - 1, 0);
    }
    return Math.min(currentIndex + 1, numberOfPictures - 1);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['picturesURLs']) {
      const picturesURLs = changes['picturesURLs'].currentValue as string[];
      this.numberOfPictures = picturesURLs.length;
    }
  }

  public ngOnInit() {}

  showPreviousImage() {
    this.currentIndex = this.getIndex(this.currentIndex, 'prev', this.numberOfPictures);
    this.prevIndex = this.currentIndex - 1;
    this.nextIndex = this.currentIndex + 1;
  }

  showNextImage() {
    this.currentIndex = this.getIndex(this.currentIndex, 'next', this.numberOfPictures);
    this.prevIndex = this.currentIndex - 1;
    this.nextIndex = this.currentIndex + 1;
  }
}
