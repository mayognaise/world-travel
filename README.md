# world-travel

A rotating globe with pinpoints showing up around the world. Very thanksful to [@jcipriano](https://github.com/jcipriano) for a very useful [post](https://blog.twitter.com/2014/creating-a-realtime-tweet-visualization-in-3-d) !!

## Demo

[Day mode](http://world-travel.s3-website-us-west-1.amazonaws.com/) and [night mode](http://world-travel.s3-website-us-west-1.amazonaws.com/?night=true) are available.

## Install

### gulp

[Gulp](http://gulpjs.com/) is a build system you can add any task.

```npm i gulp -g```

### webpack

[Webpack](http://webpack.github.io/) is a module bundler you can organize all static assets.

```npm i webpack -g```

### devDependencies

```npm i```

If you get error when installing, please add ```sudo``` before ```npm```

## Development

This application has been used the following library for MVC:

- Model: [RefluxJS](https://github.com/spoike/refluxjs)
- View: [React](https://facebook.github.io/react/)
- Controller: [React Router](https://github.com/rackt/react-router)

### Run server

Run ```gulp```.


We haven't added livereload this time so please reload by yourself after any changes. Sorry for the inconvenience.


## Deployment

### Setup AWS Security Credentials

Run ```gulp aws-config``` , open ```json/awsConfig.json``` and change ```AWSAccessKeyId```, ```AWSSecretKey``` and ```AWSBucketName```.


### Publish to S3


```gulp build```

And open the page of the bucket.
Example: [world-travel.s3-website-us-west-1.amazonaws.com](http://world-travel.s3-website-us-west-1.amazonaws.com)