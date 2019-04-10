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

### GET /screen/urls/reload
reload the urls

### POST /screen/controller/register
TBD

### POST /screen/controller/deregister
TBD

## INSTALLATION

Use a physically connected mouse to enable SSH in the configuration settings
1. Launch Raspberry Pi Configuration from the Preferences menu
2. Navigate to the Interfaces tab
3. Select Enabled next to SSH
4. Click OK

Before starting make sure you have the correct password for the 'pi' user (default user). By default this is set to `raspberry` but can also have been changed upon first boot and changed subsequently in the system preferences [https://www.maketecheasier.com/change-raspberry-pi-password/](https://www.maketecheasier.com/change-raspberry-pi-password/)

You can test this by running this command from your terminal:
```
ssh pi@<ip of the box>
```
input the password for the user and it should log you in (command line start will look like `pi@raspberrypi:~ $`)
type `exit` and hit `enter` key to exit.

Edit the `install-screen.template` from this repo replacing the `< >` enclosed values with appropriate ones.
These are the items to edit:
- \<IDENTITY\> (on line 2)
- \<PASSWORD\> (on line 2)
- \<PEM CERT\> (on line 15)
- \<CERT NAME\> (on line 20)

Copy the template to your remote Pi box as an executable shell script (location `/home/pi` is important!):

```
scp -r ${PWD}/install-screen.sh pi@<IP of the Box>:/home/pi/missionControl.sh
```
(when queried use your password you've checked earlier for the pi user)

Next run the copy script remotely:

```
ssh -t pi@<IP of the box> 'bash missionControl.sh'
```

once it's rebooted (last line of the script will reboot the box) test it from your terminal:

```
curl -v -H 'Content-Type: application/json' -X POST http://<IP of the Box:3000/screen/urls -d '{ "urls": [ "http://www.fullhdwpp.com/wp-content/uploads/Kitten.jpg", "https://images.wallpaperscraft.com/image/puppy_kitten_grass_flowers_couple_friendship_29330_1920x1080.jpg" ]}'
```

this should return http 200 code with body containing `[ "http://www.fullhdwpp.com/wp-content/uploads/Kitten.jpg", "https://images.wallpaperscraft.com/image/puppy_kitten_grass_flowers_couple_friendship_29330_1920x1080.jpg" ]`

turn on cycle with:

```
curl http://<ip of the box>:3000/screen/cycle/on
```