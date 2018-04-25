# rfb-demo


## Build

```
npm install
docker-compose up # starts kaixhin/vnc container
```


## Run

### Foreground

```
npm start # run foreground
```

Equivalent to `node ./src/execute.js -h 127.0.0.1 -p 5901 -w password -o output`


### Background

```
npm run start-bg
```

Runs in background and prints pid 

Equivalent to `node ./src/executeBackground.js -o test-bg`
