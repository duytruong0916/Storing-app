import { Component, OnInit, OnDestroy, HostListener, ElementRef, Inject } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public userid: string;
  private postSub: Subscription;
  public isLoading = false;
  public posts: Post[] = [];
  constructor( @Inject(DOCUMENT) private document: Document,
    private postservice: PostService,
    private authservice: AuthService,
    private router: Router) { }

  onDelete(id: string) {
    this.postservice.deletePost(id);

  }
  ngOnInit() {
    this.isLoading = true;
    this.userid = this.authservice.getUserId();
    this.postservice.getPost();
    this.postSub = this.postservice.getupdatedPostListener().subscribe(posts => {
      this.isLoading = false;
      this.posts = posts.reverse();
      this.userid = this.authservice.getUserId();
    })
  }
  onClick(postid:string){
    console.log(postid)
    //this.router.navigate(['posts/edit-post', postid])
    this.router.navigate(['../posts/edit-post/', postid])
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
