# nathanguenther.com
Personal Website  

# Installation:
git clone  
docker build -t nathang21/nathanguenther.com .  
docker run -d -p 80:80  -v ~/dev/personal/docker-nginx/src:/www --name personal nathang21/nathanguenther.com  
npm install  
bower install  
gulp  

# Browser Sync:
browser-sync start --server src --files "*.html, css/*.css" --plugins browser-sync-logger  
