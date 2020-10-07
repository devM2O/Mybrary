const express = require('express');
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
//All Authors routes
router.get('/', async (req,res) =>{
  let searchOptions = {}
  if(req.query.name != null && req.query.name != ''){
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try{
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  }catch{
    res.redirect('/')
  }
})

//new authors routes
router.get('/new', (req,res) =>{
  res.render('authors/new', {author: new Author()})
})

//create Authors
router.post('/', async (req,res) => {
  const author = new Author({
    name: req.body.name
  })
  try{
    const newAuthor = await author.save()
    res.redirect(`/authors/${newAuthor._id}`)
  }catch{
    res.render('authors/new', {
          author: author,
          errorMessage: "error creating author"
        })
  }
})

router.get('/:id', async (req, res)=>{
  try{
    const author = await Author.findById(req.params.id)
    const books = await Book.find({author: author._id}).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  }catch (e){
    console.log(e);
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res)=>{
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', {author: author})
  } catch{

  }

})

router.put('/:id',async (req, res)=>{
  let author
  try{
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author._id}`)
  }catch{
    if(author == null){
      res.redirect('/')
    }else {
      res.render('authors/edit', {
            author: author,
            errorMessage: "error updating author"
          })
    }
  }
})

router.delete('/:id', async (req, res)=>{
  let author
  try{
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  }catch{
    if(author == null){
      res.redirect('/')
    }else {
      res.redirect(`/authors/${author._id}`)
    }
  }
})

module.exports = router
