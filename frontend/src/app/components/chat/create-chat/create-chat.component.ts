import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MyChatsService } from 'app/core/services/my-chats.service';
import { ProfileService } from 'app/core/services/profile.service';
import { UserService } from 'app/core/services/user.service';
import { ChatCreate } from 'app/models/chat/chat-create.model';
import { Profile } from 'app/models/profile.model';
import { Observable, catchError, debounceTime, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'mds-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  constructor(
    private readonly dialogRef: MatDialogRef<CreateChatComponent>,
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly myChatsService: MyChatsService
  ) {}

  public searchUsersForm = this.fb.nonNullable.group({
    name: ''
  });

  public get nameControl(): FormControl<string> | null {
    return this.searchUsersForm.get(['name'] as const) as FormControl<string> | null;
  }

  public get name(): string {
    return this.nameControl?.value || '';
  }

  public name$: Observable<string> = this.nameControl?.valueChanges || new Observable<string>();
  public profiles$: Observable<Profile[]> = this.name$.pipe(
    debounceTime(300),
    filter((name) => name.length >= 3),
    tap(() => (this.loadingSearch = true)),
    switchMap((name) =>
      this.profileService.getProfilesByNameOrUsername(name).pipe(
        catchError((err) => {
          console.error(err);
          return of({ content: [] });
        })
      )
    ),
    // remove current user from the list
    withLatestFrom(this.userService.currentUser$),
    map(([res, currentUser]) => res.content.filter((profile) => profile.userId !== currentUser?.id)),
    tap(() => (this.loadingSearch = false))
  );
  public profiles: Profile[] = [];
  public loadingSearch: boolean = false;

  public addedProfiles: Profile[] = [];
  public addedProfilesIds: string[] = [];

  public loadingCreateChat: boolean = false;

  public ngOnInit(): void {
    this.profiles$.subscribe((profiles) => (this.profiles = profiles));
  }

  public toggleUser(profile: Profile): void {
    if (this.addedProfilesIds.includes(profile.id)) {
      this.removeUser(profile);
    } else {
      this.addedProfilesIds.push(profile.id);
      this.addedProfiles.push(profile);
    }
  }

  public removeUser(profile: Profile): void {
    this.addedProfilesIds = this.addedProfilesIds.filter((id) => id !== profile.id);
    this.addedProfiles = this.addedProfiles.filter((p) => p.id !== profile.id);
  }

  public createChat(): void {
    const data: ChatCreate = {
      name: 'Chat',
      isGroup: this.addedProfiles.length > 1,
      pictureUrl: undefined,
      memberIds: this.addedProfiles.map((profile) => profile.userId)
    };
    this.loadingCreateChat = true;
    this.myChatsService
      .createChat(data)
      .pipe(
        catchError((err) => {
          this.loadingCreateChat = false;
          throw err;
        })
      )
      .subscribe(() => {
        this.loadingCreateChat = false;
        this.dialogRef.close();
      });
  }
}
