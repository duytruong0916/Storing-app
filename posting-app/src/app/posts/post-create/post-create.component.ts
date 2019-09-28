import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { PostService } from '../post.service';
import { Post } from '../post.model'
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mine-type.validator';
import { ImageService } from '../image.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  public files: File[] = new Array();
  public imagePreview: any[] = new Array();
  public imageSrc: any[] = new Array();
  public form: FormGroup;
  public isSelected: boolean = true;
  public orientation;
  uploadedImage: File;
  public mode: string = 'create';
  public isLoading = false;
  public postid: string;
  public post: Post;
  public isvalid:boolean = true;
  constructor(private postservice: PostService,
    private activateroute: ActivatedRoute,
    private imageservice: ImageService,
  ) { }
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      //images: new FormArray([])
    })
    this.isLoading = true;
    this.activateroute.paramMap.subscribe((paramap) => {
      this.isLoading = false;
      if (paramap.has('postid')) {
        this.mode = "edit";
        this.postid = paramap.get('postid');
        console.log(paramap.get('postid'))
        this.postservice.getPostID(this.postid).subscribe(response => {
          if(response.success){
            console.log(response.post._id)
            this.post = {
              id: response.post._id,
              title: response.post.title,
              content: response.post.content,
              imagePaths: response.post.imagePaths,
              creator: response.post.creator
            };
            this.form.patchValue({ title: this.post.title, content: this.post.content })
            this.imageSrc.push(...this.post.imagePaths);
            this.imagePreview.push(...this.post.imagePaths);
          }
          else {
            console.log(response.message)
            return;
          }
        })
      } else {
        this.mode = "create";
        this.postid = null;
      }
    })
  }
  onImageHandler(e) {
    const files: File[] = e.target.files;
    /* Images review */
    for (var i = 0, len = files.length; i < len; i++) {
      //(<FormArray>this.form.get('images')).push(new FormControl(files[i], { validators: [Validators.required], asyncValidators:[mimeType]}))
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (ev) => {
      this.imagePreview.push((ev.target as any).result)
      }
      /* Transform the input files */
      this.imageservice.getOrientation(files[i], (orientation, file) => {
        this.orientation = orientation
        const filename = file.name;
        var reader_1 = new FileReader();
        reader_1.readAsDataURL(file);
        reader_1.onload = (ev) => {
          const img = new Image();
          img.src = (ev.target as any).result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            const width = 350;
            const scaleFactor = width / img.width;
            const height = img.height * scaleFactor;
            // set proper canvas dimensions before transform & export
            if (4 < this.orientation && this.orientation < 9) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }
            // transform context before drawing image
            switch (this.orientation) {
              case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
              case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
              case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
              case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
              case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
              case 7: ctx.transform(0, -1, -1, 0, height, width); break;
              case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
              default: break;
            }
            ctx.drawImage(img, 0, 0, width, img.height * scaleFactor)
            ctx.canvas.toBlob((blob) => {
              const file = new File([blob], filename, { type: 'image/jpeg', lastModified: Date.now() });
              this.files.push(file);
            }, 'image/jpeg', 1);
          }
        };
      });
    }
  }
  onAddPost() {
    console.log(this.form)
    console.log(this.form.valid)
    if (this.form.valid) {
      if (this.imagePreview.length<=0) {
        this.isSelected = false;
        let myVar = setTimeout(() => {
          this.isSelected = true;
          clearTimeout(myVar);
        }, 1500);
        return;
      }
      this.isLoading = true;
      if (this.mode == "create") {
        this.postservice.addPost(this.form.get('title').value, this.form.get('content').value, this.files);
      }
      else {

        this.postservice.updatePost(this.postid, this.form.get('title').value, this.form.get('content').value, this.files, this.imageSrc);

      }
    }
    else return this.form.reset();
  }
  onRemove(index: number) {
    const filtered_file = this.files.slice(0, index).concat(this.files.slice(index + 1, this.files.length));
    const filtered_image = this.imagePreview.slice(0, index).concat(this.imagePreview.slice(index + 1, this.imagePreview.length));
    const filtered_imagesrc = this.imageSrc.slice(0, index).concat(this.imageSrc.slice(index + 1, this.imageSrc.length));
    this.files = [...filtered_file];
    this.imagePreview = [...filtered_image];
    this.imageSrc = [...filtered_imagesrc];
  }
}
