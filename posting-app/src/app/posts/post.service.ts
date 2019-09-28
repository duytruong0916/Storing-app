import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from './post.model'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { environment } from "../../environments/environment.prod";
const Backend_URL = environment.apiURL + '/post';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private updatedPosts = new Subject<Post[]>();
  private posts: Post[] = [];
  constructor(private http: HttpClient,
    private router: Router) { }
  getPost() {
    this.http.get<{ message: string, posts: any }>(Backend_URL)
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePaths: post.imagePaths,
            creator: post.creator
          }
        })
      }))
      .subscribe(posts => {
        this.posts = posts;
        this.updatedPosts.next([...this.posts]);
      })
  }
  getPostID(postid: string) {
    const params = new HttpParams();
    params.append('id', postid);
    return this.http.get<{ message: string, post: any, success:boolean }>(Backend_URL + `${postid}`, { params: params })
  }
  getupdatedPostListener() {
    return this.updatedPosts.asObservable();
  }
  addPost(title: string, content: string, images: File[]) {
    const formdata = new FormData();
    for (let i = 0; i < images.length; i++) {
      formdata.append("images[]", images[i], images[i]['name']);
    }
    formdata.append('title', title);
    formdata.append('content', content);
    this.http.post<{ message: string, success: boolean, post: any }>(Backend_URL, formdata)
      .subscribe(response => {
        const post: Post = {
          id: response.post.id,
          title: response.post.title,
          content: response.post.content,
          imagePaths: response.post.imagePaths,
          creator: response.post.creator
        }
        this.posts.push(post);
        this.updatedPosts.next([...this.posts]);
        this.router.navigate(['posts/view-post'])
      })
  }
  deletePost(id: string) {
    const params = new HttpParams();
    params.append('id', id);
    this.http.delete<{ message: string, success: boolean }>(Backend_URL + `/delete${id}`, { params: params })
      .subscribe(response => {
        const postsAfterDeleted = this.posts.filter(post => post.id !== id);
        this.posts = postsAfterDeleted;
        this.updatedPosts.next([...this.posts]);
      })
  }
  updatePost(id: string, title: string, content: string, imagefiles: File[], imgsrc: string[]) {
    let postdata: FormData;
    postdata = new FormData();
    postdata.append('id', id);
    postdata.append('title', title);
    postdata.append('content', content);
    for (let i = 0; i < imgsrc.length; i++) {
      postdata.append("imgsrc", imgsrc[i]);
    }
    if (imagefiles) {
      for (let i = 0; i < imagefiles.length; i++) {
        postdata.append("images[]", imagefiles[i], imagefiles[i]['name']);
      }
    }
    const params = new HttpParams();
    params.append('id', id);
    this.http.put<{ message: string, updatedpost: any }>(Backend_URL + `/update${id}`, postdata, { params: params })
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = { id: id, title: title, content: content, imagePaths: response.updatedpost.imagePaths, creator: response.updatedpost.creator }
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.updatedPosts.next([...this.posts]);
        this.router.navigate(['posts/view-post'])
      })
  }
}
