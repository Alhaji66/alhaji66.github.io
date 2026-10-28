// DONE WELL moved from this GitHub address to https://done-well-mathematical-literacy.pages.dev.
//
// Phones that installed the app from here still run an old copy kept by its
// service worker, which checks this file for updates. This replacement
// clears that old copy, sends every open DONE WELL page to the same page at
// the new address, and removes itself.
var TARGET = 'https://done-well-mathematical-literacy.pages.dev'
var BASE = '/done-well-mathematical-literacy-'

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      var keys = await caches.keys()
      await Promise.all(keys.map(function (k) { return caches.delete(k) }))
      await self.clients.claim()
      var windows = await self.clients.matchAll({ type: 'window' })
      await Promise.all(
        windows.map(function (client) {
          var url = new URL(client.url)
          var path = url.pathname
          if (path.toLowerCase().indexOf(BASE) === 0) path = path.slice(BASE.length)
          return client.navigate(TARGET + (path || '/') + url.search + url.hash).catch(function () {})
        }),
      )
      await self.registration.unregister()
    })(),
  )
})
