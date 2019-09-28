const Post = require('../modules/post');

exports.GetPost  = (req,res)=>{
  Post.find({creator: req.userData.userid}, (err, documents)=>{
    if(err) res.json({msg: "Failed to fetch post"})
    res.json({msg: "Successfully fetched", posts: documents})
  })
}
exports.GetPostWithID = (req,res)=>{
  Post.findById(req.params.id, (err, documents)=>{
    if(err) res.json({success:false, message: "Failed to fetch post"})
    res.json({success: true, message: "Successfully fetched", post: documents})
  })
}

exports.AddPost = (req,res)=>{0
  const files = req.files;
  const url = req.protocol + '://' + req.get('host');
  const arr = new Array();
  for(var i=0; i<files.length; i++)
  {
    arr.push(url + '/uploads/' + req.files[i].filename)
  }
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePaths: arr,
    creator: req.userData.userid
  })
  post.save().then(result => {
    return res.json({
        success: true,
        message: "Post saved",
        post: {
          title: result.title,
          content: result.content,
          id: result._id,
          imagePaths: result.imagePaths
        }
    });
})
}
exports.DeletePost =  (req,res)=>{
  Post.deleteOne({_id:req.params.id, creator: req.userData.userid}).then(result => {
    return res.json({
        success: true,
        message: "Post deleted"
    });
})
}
exports.UpdatePost = (req,res)=>{
  const url = req.protocol + '://' + req.get('host');
  const files = req.files;
  const arr = new Array();
  const imagePaths = req.body.imgsrc;
  if(imagePaths)
  {
    if(typeof imagePaths ==='string')
    arr.push(imagePaths)
    else{
      for(var i=0; i<imagePaths.length; i++)
      {
        arr.push(imagePaths[i])
      }
    }
  }
  if(req.files){
    for(var i=0; i<files.length; i++)
    {
      arr.push(url + '/uploads/' + req.files[i].filename)
    }
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePaths: arr,
    creator: req.userData.userid
  })
  Post.updateOne({_id: req.params.id, creator: req.userData.userid}, post).then(result=>{
    res.json({message: "Post updated successfully",
              updatedpost: result })
  })
}
