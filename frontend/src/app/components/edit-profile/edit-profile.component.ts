import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { openClosedAnimation } from 'app/shared/utils/animations';
import { CustomError, handleError } from 'app/shared/utils/error';
import { Router } from '@angular/router';
import { ProfileService } from 'app/core/services/profile.service';
import { ProfileCreate } from 'app/models/profile-create.model';
import { EditProfileFormType } from './edit-profile.type';
import { Profile } from 'app/models/profile.model';
import { GenericResponse } from 'app/models/generic-response.model';
import { UserService } from 'app/core/services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'mds-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  animations: [openClosedAnimation]
})
export class EditProfileComponent implements OnInit {
  selectedPhotoUrl = '';
  selectedPhotoName = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    public router: Router
  ) {}

  public editProfileError: CustomError | undefined;

  public profilePicture?: File = undefined;

  public readonly profileForm: FormGroup<Partial<EditProfileFormType>> = this.fb.group({
    username: ['', [Validators.minLength(5), Validators.maxLength(15)]],
    name: ['', [Validators.minLength(5), Validators.maxLength(15)]],
    bio: ['', Validators.maxLength(50)],
    isPrivate: ['false']
  }) as FormGroup<Partial<EditProfileFormType>>;

  onSubmit(): void {
    if (this.profileForm.valid) {
      const data: ProfileCreate = {
        metadata: {
          username: this.username.value,
          name: this.name.value,
          bio: this.bio.value,
          isPrivate: this.isPrivate.value
        },
        media: this.profilePicture
      };

      this.profileService
        .patch(data)
        .pipe(handleError())
        .subscribe((res: GenericResponse<Partial<Profile>>) => {
          this.profileForm.reset();
          if (!res.content?.userId) console.error('No user id');
          else this.router.navigate(['/profile/', res.content?.userId]);
        });
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const file = target.files[0];
      this.profilePicture = file;
      this.selectedPhotoName = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedPhotoUrl = reader.result as string;
      };
    }
  }

  get username(): FormControl {
    return this.profileForm.get('username') as FormControl;
  }

  get name(): FormControl {
    return this.profileForm.get('name') as FormControl;
  }

  get bio(): FormControl {
    return this.profileForm.get('bio') as FormControl;
  }

  get isPrivate(): FormControl {
    return this.profileForm.get('isPrivate') as FormControl;
  }

  ngOnInit(): void {}

  public deleteAccount(): void {
    this.userService
      .delete()
      .pipe(
        switchMap(() => this.userService.logout()),
        handleError()
      )
      .subscribe(() => this.router.navigate(['/']));
  }
}
