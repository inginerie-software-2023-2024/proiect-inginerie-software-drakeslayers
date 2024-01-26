import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginFormComponent } from './components/login/login-form.component';
import { RegisterFormComponent } from './components/register/register-form.component';
import { ApiTestsComponent } from './components/api-tests/api-tests.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material/material.module';
import { ErrorBoxComponent } from './components/error-box/error-box.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfilePicComponent } from './components/profile-pic/profile-pic.component';
import { PostMediaComponent } from './components/post/post-media/post-media.component';
import { MatButtonModule } from '@angular/material/button';
import { CommentSectionComponent } from './components/comment/comment-section/comment-section.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { CommentCreateComponent } from './components/comment/comment-create/comment-create.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FeedComponent } from './components/feed/feed.component';
import { ShowPostFeedComponent } from './components/post/show-post-feed/show-post-feed.component';
import { PostPageComponent } from './components/post-page/post-page.component';
import { FileUploadComponent } from './components/shared/file-upload/file-upload.component';
import { PostCommentComponent } from './components/post/comments/post-comment/post-comment.component';
import { PostCommentsComponent } from './components/post/comments/post-comments/post-comments.component';
import { InputSendComponent } from './components/shared/input-send/input-send.component';
import { UsernameComponent } from './components/shared/username/username.component';
import { PostActionsComponent } from './components/post/post-actions/post-actions.component';
import { CommentLikeComponent } from './components/post/comments/comment-like/comment-like.component';
import { FeedPostComponent } from './components/post/feed-post/feed-post.component';
import { ShowProfileComponent } from './components/show-profile/show-profile.component';
import { FollowersComponent } from './components/followers/followers.component';
import { NotificationsPageComponent } from './components/notifications/notifications-page/notifications-page.component';
import { Observable } from 'rxjs';
import { NotificationsService } from './core/services/notifications.service';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { PostComponent } from './components/shared/post/post.component';

function initializeAppFactory(notificationsService: NotificationsService): () => Observable<any> {
  return () => {
    return new Observable((observer) => {
      notificationsService.setupSocket();
      observer.next();
      observer.complete();
    });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ApiTestsComponent,
    LoginFormComponent,
    RegisterFormComponent,
    ErrorBoxComponent,
    NavbarComponent,
    ProfilePicComponent,
    PostMediaComponent,
    CommentSectionComponent,
    CreatePostComponent,
    CommentCreateComponent,
    CreateProfileComponent,
    EditProfileComponent,
    FeedComponent,
    ShowPostFeedComponent,
    PostPageComponent,
    FileUploadComponent,
    PostCommentComponent,
    PostCommentsComponent,
    InputSendComponent,
    UsernameComponent,
    PostComponent,
    PostActionsComponent,
    CommentLikeComponent,
    FeedPostComponent,
    ShowProfileComponent,
    FollowersComponent,
    NotificationsPageComponent,
    NotificationComponent
  ],
  imports: [BrowserModule, AppRoutingModule, SharedModule, MaterialModule, MatButtonModule],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeAppFactory,
    deps: [NotificationsService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
