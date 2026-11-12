# Eli Home for Samsung Tizen

A no-clutter, remote-first home screen for the Samsung UN55MU7100. It runs as a TizenBrew module and launches only the apps Eli chose.

## Included

- Prime Video — `evKhCgZelL.AmazonIgnitionLauncher2`
- Plex — `kIciSQlYEM.plex`
- Netflix — `org.tizen.netflix-app`
- Spotify — `rJeHak5zRg.Spotify`
- SiriusXM — visible as unavailable until an installable TV package exists

## Install

Publish the directory as an npm package, then add `npm/eli-tv-home` in TizenBrew's Module Manager and select it as the auto-launch module. For private testing, serve/package it using the same TizenBrew module layout (`package.json`, `service.js`, `app/`).

TizenBrew should keep Developer Mode host `127.0.0.1`. On this 2017 TV, enable **Autorun Last App** and disable **Autorun Smart Hub** so Eli Home returns after power-on when it was the last open app.

## Controls

- Left / Right — select an app
- OK — launch
- Red — show the kept-app summary
- Green — refresh
- Back — remain in the launcher
- Home / Smart Hub — Eli Home reclaims focus if the Samsung overlay opens

## Performance profile

The launcher is intentionally self-contained for the 2017 Tizen 3 browser: no
remote assets, web fonts, frameworks, blur filters, animated focus transitions,
or repeated textures. Focus is visible immediately, the clock updates once per
minute, and the app-launch service accepts only local origins and the four
allowlisted installed app IDs.
