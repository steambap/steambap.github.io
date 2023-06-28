---
title: "Koa Tree Router"
pubDate: "2018-01-01T18:44:23+08:00"
updateDate: "2023-06-28"
description: "Koa Tree Router"
---

## Update 2023-06-28
If I start a new koa project today, I would not use a restful api. [trpc](https://github.com/trpc/trpc) will be my choice if I can use TypeScript. It's like graphQL and ts having a child and make you move really fast for your full stack TypeScript app.

## koa-tree-router

Recently there is a new framework [Fastify](https://github.com/fastify/fastify). It is advertise as _fast_ and says it has its own high performance router [find-my-way](https://github.com/delvedor/find-my-way). It's fast because it uses a Radix Tree instead of regexp based router.

I look at their code, some of the implementations were taken from echo, a Golang framework. However, in Golang ecosystem, [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter) is the fastest, about 3 ~ 5 times faster than echo. I played around with their code and try to add httprouter's implementation to it, but the result was only about 2 times faster:

```
  koa-router  x   399,951 ops/sec ±0.41% (93 runs sampled)
  find-my-way x 1,854,722 ops/sec ±0.50% (96 runs sampled)
  tree-router x 4,875,122 ops/sec ±0.68% (95 runs sampled)
```

Also their code will fallback to regexp based router to make it work with some advanced router definition. This part of code can slow down their implementation.

In the end, since there is no official router for koa, I decided to put my JavaScript version of httprouter into a koa router. This implementation is about 11x faster than regexp based router for koa.

Here is the project link:
[GitHub](https://github.com/steambap/koa-tree-router)
