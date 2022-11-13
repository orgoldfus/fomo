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

## User-defined RSS sources (New!)
You can define your own RSS sources using simple configuration files.

In order to configure a new RSS source you'll need:

1. Create a new folder to hold your source configuration files.
2. Create a configuration file for your desired source.
3. Tell fomo where to find your config files: 
  * Open fomo's config menu (run `fomo -c`)
  * Choose "Configure external rss feeds directory"
  * Enter the path to the folder you created. Make sure to use an absolute path

### Source configuration file
Source configuration file should be a valid JSON file with the following structure:
```json
{
  "details": {
    "name": "The source name",
    "id": "The source ID"
  },
  "baseUrl": "base URL of the RSS feeds",
  "fetchTypes": {
    "key1": "First RSS feed name",
    "key2": "Second RSS feed name",
    "keyN": "Nth RSS feed name"
  },
  "defaultFetchType": "Key name of the default RSS feed (should be one the keys defined above)",
  "fieldsMapping": {
    "title": "title field name",
    "link": "link field name",
    "summary": "summary field name (optional)",
    "date": "date field name (optional)",
    "author": "author field name (optional)"
  },
  "defaultCacheTTL": "Number of minutes to cache result from this source (optional. default is 10 minutes)"
}
```

The final RSS feed URL is built in the following way: `${baseUrl}/${selectedFetchTypeValue}`, so make sure `baseUrl` doesn't end with a comma and that non of the fetchTypes keys' values doesn't start with a comma. 

For your convenience, here's an example source config file:
```json
{
  "details": {
    "name": "MIT News",
    "id": "mit"
  },
  "baseUrl": "https://news.mit.edu/topic",
  "fetchTypes": {
    "astronauts": "mitastronauts-rss.xml",
    "ai": "mitartificial-intelligence2-rss.xml"
  },
  "defaultFetchType": "ai",
  "fieldsMapping": {
    "title": "title",
    "link": "link",
    "summary": "summary",
    "date": "isoDate",
    "author": "author"
  },
  "defaultCacheTTL": 10
}
```

## License
[MIT](LICENSE)