<p align="center"><img src="https://user-images.githubusercontent.com/4867932/85957355-4bba7d00-b995-11ea-96ec-9c9ce00a5f85.png" height="300" alt="fomo logo"></p>
<p align="center">Got FOMO? read the latest Tech news right from your Terminal</p>
<p align="center"><img src="https://user-images.githubusercontent.com/4867932/85957302-ee263080-b994-11ea-912f-6ecfa2230942.gif" width="562" alt="fomo example"></p>


## Install
```sh
npm install -g fomoapp
```

## Usage
```sh
$ fomo
```

Select a specific source using the `-s` flag:
```sh
$ fomo -s hn # Hacker News
```

You can also select a specific ordering/sub-group using the `-t` flag:
```sh
$ fomo -s hn -t ask # ask HN
```

Limit the number of responses (for each source) using the `-l` flag:
```sh
$ fomo -l 3 # showes 3 entries for each source
```

Configure fomo using the `-c` flag:
```sh
$ fomo -c # openes the configuration menu
```

Get help using the `-h` flag:
```sh
$ fomo -h
```

## License
[MIT](LICENSE)