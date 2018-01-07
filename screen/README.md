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

### GET /screen/cycle/off

### GET /screen/debug

### POST /screen/controller/register

### POST /screen/controller/deregister
