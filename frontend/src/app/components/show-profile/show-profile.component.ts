import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from 'app/core/services/comment.service';
import { FollowerService } from 'app/core/services/follower.service';
import { PostLikeService } from 'app/core/services/post-like.service';
import { PostService } from 'app/core/services/post.service';
import { ProfileService } from 'app/core/services/profile.service';
import { UserService } from 'app/core/services/user.service';
import { ProfilePost } from 'app/models/profile-post.model';
import { Profile } from 'app/models/profile.model';
import { SessionUser } from 'app/models/session-user.model';
import { ErrorResponse, handleError } from 'app/shared/utils/error';
import { SubscriptionCleanup } from 'app/shared/utils/subscription-cleanup';
import { Observable, catchError, map, of, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent extends SubscriptionCleanup implements OnInit, OnDestroy {
  public readonly currentUser$: Observable<SessionUser | null | undefined> = this.userService.currentUser$;
  public isCurrentUserProfile$!: Observable<boolean>;
  public isFollowing$!: Observable<boolean>;
  public isRequested$!: Observable<boolean>;
  public profile: Profile | undefined;
  public profilePictureUrl: string | undefined;
  public posts: ProfilePost[] = [];

  constructor(
    private readonly profileService: ProfileService,
    private readonly postService: PostService,
    private readonly userService: UserService,
    private readonly postLikeService: PostLikeService,
    private readonly commentService: CommentService,
    private readonly followerService: FollowerService,
    private activatedRoute: ActivatedRoute,
    public readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.getProfile(params['userId']);
    });
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.getPosts(params['userId']);
    });
  }

  private getProfile(userId: string): void {
    this.profileService
      .getProfile(userId)
      .pipe(takeUntil(this.destroy$), handleError())
      .subscribe((response) => {
        this.profile = response.content;
        this.getProfilePicture();

        // Verificăm dacă profilul este profilul utilizatorului curent
        this.isCurrentUserProfile$ = this.isCurrentUser(userId);

        this.isFollowing(userId);
      });
  }

  private getPosts(userId: string): void {
    this.postService
      .getPostsByUser(userId)
      .pipe(takeUntil(this.destroy$), handleError())
      .subscribe((response) => {
        this.posts = response.content;

        // Add urls to pictures
        this.posts.forEach((post) => {
          this.postService
            .getPostMedia(post.id)
            .pipe(takeUntil(this.destroy$), handleError())
            .subscribe((response) => (post.picturesURLs = response.content?.picturesURLs));
        });

        // Get the number of likes and comments for each post
        this.posts.forEach((post) => {
          this.postLikeService
            .getPostLikesCount(post.id)
            .pipe(takeUntil(this.destroy$), handleError())
            .subscribe((response) => (post.likesCount = response.content?.count));

          this.commentService
            .getPostCommentsCount(post.id)
            .pipe(takeUntil(this.destroy$), handleError())
            .subscribe((response) => (post.commentsCount = response.content?.count));
        });
      });
  }

  private getProfilePicture(): void {
    if (!this.profile) {
      return;
    }
    const profileId = this.profile.id;
    this.profileService
      .getProfilePicture(profileId)
      .pipe(takeUntil(this.destroy$), handleError())
      .subscribe((response) => (this.profilePictureUrl = response.content?.profilePictureURL));
  }

  private isCurrentUser(userId: string): Observable<boolean> {
    return this.userService.whoAmI().pipe(
      map((response) => response.content?.id === userId),
      catchError((err: ErrorResponse) => {
        console.error(err);
        return of(false);
      })
    );
  }

  private isFollowing(userId: string): void {
    this.currentUser$
      .pipe(
        switchMap((user) => {
          if (user) {
            const currentUserId = user.id;
            return this.followerService.getFollowers(userId).pipe(
              map((response) => {
                const followers = response.content;
                const isFollowing = followers.some(follower => follower.followedBy === currentUserId && follower.accepted);
                const isRequested = followers.some(follower => follower.followedBy === currentUserId && !follower.accepted);

                this.isFollowing$ = of(isFollowing);
                this.isRequested$ = of(isRequested);
              }),
              catchError((error: any) => {
                console.error(error);
                this.isFollowing$ = of(false);
                this.isRequested$ = of(false);
                return of(false);
              })
            );
          } else {
            this.isFollowing$ = of(false);
            this.isRequested$ = of(false);
            return of(false);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }


  public follow() {
    if (!this.profile) {
      return;
    }
    this.followerService
      .follow(this.profile.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.content.accepted) {
          this.isFollowing$ = of(true);
        } else {
          this.isRequested$ = of(true);
        }
      });
  }

  public unfollow() {
    if (!this.profile) {
      return;
    }
    this.followerService
      .unfollow(this.profile.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.isFollowing$ = of(false);
        this.isRequested$ = of(false);
      });
  }

  public openPost(postId: String): void {
    this.router.navigate(['posts', postId]);
  }
}
