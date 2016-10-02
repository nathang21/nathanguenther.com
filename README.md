# nathanguenther.com
Personal Website  

# Installation:
git clone  
docker build -t nathang21/nathanguenther.com .  
docker run -d -p 80:80  -v ~/dev/personal/docker-nginx/src:/www --name personal nathang21/nathanguenther.com  
npm install  
bower install  
gulp clean # not neccessary for first run
gulp serve # loads browswer-sync and watches files
