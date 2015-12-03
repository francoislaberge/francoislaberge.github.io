./node_modules/.bin/harp compile
rm -r -f ../afj2ad2/
mv www ../afj2ad2
# git checkout master
rm -r -f blog index.html projects about resume scripts styles 404.html
mv -f ../afj2ad2/* .
# git add --all
# git commit -m "Deploying to Github Pages"
# git push origin -u master
# git checkout dev
