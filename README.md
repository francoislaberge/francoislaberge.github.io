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
This runs ```harp compile``` and then checkouts the ```gh-pages``` branch and sets it's contents to the contents of the ```www``` folder where the static website was built.

```bash
./bin/deploy.sh
```

## Writing Articles

  1. Add a folder to ```public/blog```.
  2. Create file named ```index.md``` in that folder and write your article in there.
  2. The article will be served up at ```francoislaberge.com/blog/<article-folder-name>/ ( <- Notice the trailing slash. We assume that most static hosting services automatically look for a index.html)
  3. Put any related content in that folder. This is useful for demos and such to be cleanly isolated.
  4. Submit a pull request.
  5. Thanks!

# Project Organization

```
francoislaberge.com
  |- harp.json
  +- public
     |- _layout.jade (Master template that wraps each page)
     |- index.jade (Home page)
     +- blog
        |- _data.json
        +- *.md (All articles are written as a MarkDown file inside it's own folder so that we get nice URLs without .html extensions. Example  )
  +- www (Where the static website is generated. Use ```npm compile``` to generate it.)
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
