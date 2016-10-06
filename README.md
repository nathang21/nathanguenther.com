# nathanguenther.com
Personal Website  

# Installation:
git clone  
npm install  
bower install  
gulp  

# Hosting:
docker build -t nathang21/nathanguenther.com .  
docker run -d -p 80:80 -v ~/dev/personal/docker-nginx/public:/www --name personal nathang21/nathanguenther.com  
