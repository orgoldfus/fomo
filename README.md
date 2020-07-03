<p align="center"><img src="https://user-images.githubusercontent.com/4867932/85957355-4bba7d00-b995-11ea-96ec-9c9ce00a5f85.png" height="300" alt="fomo logo"></p>
<p align="center">Got FOMO? read the latest Tech news right from your Terminal</p>
<p align="center"><img src="https://user-images.githubusercontent.com/4867932/85957302-ee263080-b994-11ea-912f-6ecfa2230942.gif" width="562" alt="fomo example"></p>

![npm](https://img.shields.io/npm/v/fomoapp)

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

List all available sources (and their types) using the `-p` flag:
```sh
$ fomo -p # prints all available sources
```

Get help using the `-h` flag:
```sh
$ fomo -h
```

## Sources
| Source       	| Source ID 	| Available types                                                                                           	|
|--------------	|-----------	|-----------------------------------------------------------------------------------------------------------	|
| Hacker News  	| hn        	| ask (Ask HN)<br>best<br>jobs<br>new<br>show (Show HN)<br>top                                              	|
| Product Hunt 	| ph        	| featured<br>new<br>top_ranking<br>top_votes                                                               	|
| TechCrunch   	| tc        	| euro<br>funding<br>gear<br>mobile<br>social<br>startups<br>top                                            	|
| The Verge    	| verge     	| breaking<br>culture<br>full<br>mobile<br>sw (Software and Apps)<br>web                                    	|
| Reddit       	| reddit    	| fed (r/Frontend)<br>js (r/javascript)<br>prog (r/programming)<br>tech (r/technology)<br>webdev (r/webdev) 	|
| Wired        	| wired     	| business<br>gear<br>science<br>top                                                                        	|

## License
[MIT](LICENSE)