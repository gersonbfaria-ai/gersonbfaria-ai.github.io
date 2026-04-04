var CACHE = "estac-pro-v8";
var FILES = [
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  var url = e.request.url;
  // Nao interceptar chamadas Firebase/Google
  if(url.indexOf("firestore.googleapis.com") >= 0 ||
     url.indexOf("firebase") >= 0 ||
     url.indexOf("gstatic.com") >= 0 ||
     url.indexOf("googleapis.com") >= 0){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request).catch(function(){
        return caches.match("./index.html");
      });
    })
  );
});
