import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'mds-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  constructor(private readonly fb: FormBuilder) {}

  public searchUsersForm = this.fb.nonNullable.group({
    username: ''
  });

  public get username(): string {
    return this.searchUsersForm.get('username')?.value || '';
  }

  public ngOnInit(): void {
    this.searchUsersForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
}
