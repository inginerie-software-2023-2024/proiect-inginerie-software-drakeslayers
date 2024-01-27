import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ProfileService } from 'app/core/services/profile.service';
import { Profile } from 'app/models/profile.model';
import { Observable, catchError, debounceTime, filter, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'mds-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss']
})
export class CreateChatComponent implements OnInit {
  constructor(private readonly fb: FormBuilder, private readonly profileService: ProfileService) {}

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
    tap(() => (this.loading = true)),
    switchMap((name) =>
      this.profileService.getProfilesByNameOrUsername(name).pipe(
        catchError((err) => {
          console.error(err);
          return of({ content: [] });
        })
      )
    ),
    map((res) => res.content),
    tap(() => (this.loading = false))
  );
  public profiles: Profile[] = [];
  public loading: boolean = false;

  public addedProfiles: Profile[] = [];
  public addedProfilesIds: string[] = [];

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
}
