## Mission Control: Screen 

Provides a simple web interface to control a kiosk instance of chrome. 

### GET /screen/urls
Return a list of current active URLS. 

### POST /screen/urls
Accepts `application/json` containing the URL's to load, this replaces any existing URLs. 
```
{
  urls: [
    "https://jack.sh",
    "https://google.com"
  ]
}
```

### GET /screen/cycle/on
Enables tab cycling.

### GET /screen/cycle/off
Disables tab cycling.

### GET /screen/debug
Returns current config, can be requested with `application/json` for JSON version otherwise html served.

### GET /screen/identify
Triggers an overlay on the currently load page displaying IP/Hostname information for 10secs.

### POST /screen/controller/register
TBD

### POST /screen/controller/deregister
TBD

