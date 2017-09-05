The source for [francoislaberge.com](http://francoislaberge.com). Uses [Harp](http://harpjs.com/) to statically generate a website, currently hosted as a Github Page.

# Contributing
To contribute to this project (as say a guest author), please submit pull requests. See [Write Articles](#writing-articles) if you want to be a guest writer.

# Installation

 1. Install Requirements
  - [Node](http://nodejs.org/download/).
 2. *Note*: You do not need to install Harp globally, as it is a devDependency and we call it's project local binary
 3. Clone the project

```bash
git clone git@github.com:francoislaberge/francoislaberge.github.io.git francoislaberge.com
```

 4. Install Node Dependencies

```bash
cd francoislaberge.com
npm install
```

# Workflow

## Serve files and edit/add content

```bash
npm start
```

## Deploy


 1. Generate static version of site

```bash
npm run build
```

 2. Now add/commit/push (to master) your files if they look good
```bash
git add .
git commit -m "Write comment"
git push
```
 3. They are served via Github's Github Pages system: http://francoislaberge.com/


## Writing Articles

  1. Create a new blog article by duplicating the `public/blog/template` folder. It should live in ```public/blog```.
  1. Put the blog content in the article's ```index.ejs```
  1. Make sure to change the image/template-article-icon.png, the article's title, snippet, and etc.
  1. The article will be served up at `francoislaberge.com/blog/<article-folder-name>/` ( <- Notice the trailing slash. We assume that most static hosting services automatically look for a index.html)
  1. Put any related content in that folder. This is useful for demos and such to be cleanly isolated.
  1. Add a `_data.json` meta-data file to the new blog article folder. See another article for reference.
  1. Add an entry in `public/blog/_data.json` for the newly created article.

# Project Organization

```
francoislaberge.com
  |- harp.json
  |- blog (Statically generated from public/blog files)
  |- projects (Statically generated from public/projects files)
  +- public
     |- _layout.jade (Master template that wraps each page)
     |- index.jade (Home page)
     +- blog
        |- _data.json
        +- *.ejs (Most articles are written as a EJS based files inside it's own folder)
  |- resume (Statically generated from public/resume files)
  |- scripts (Statically generated from public/scripts files)
  |- styles (Statically generated from public/styles files)
```

## TODO


 - Port over all old content
 - Add more
 - Link to github source.
 - Switch hosting over https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/

Read:
http://blog.bmannconsulting.com/node-static-site-generators
http://wintersmith.io/
http://assemble.io/
