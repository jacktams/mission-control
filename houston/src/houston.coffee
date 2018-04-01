# Description
#   Controller Plugin for Mission Control.
#
# Configuration:
#   LIST_OF_ENV_VARS_TO_SET
#
# Commands:
#   hubot houston hi - Debug check.
#   hubot houston register <IP> <Alias> - Adds a new mission control screen with houston. 
#   hubot houston deregister <Alias> - Removes a registered screen.
#   hubot houston list - Lists currently registered screens.
#   
# Notes:
#   <optional notes required for the script>
#
# Author:
#   Jack Tams <dev@jack.sh>
HOUSTON_NS_SCREENS='houston.screens'

module.exports = (robot) ->  
  robot.respond /houston hi/, (res) ->
    res.reply "hello!"

  robot.respond /houston register (.*) (.*)/i, (res) -> 
    ip = res.match[1]
    alias = res.match[2]
    registeredScreens = robot.brain.get(HOUSTON_NS_SCREENS) || []
    registeredScreens.push({ ip, alias })
    robot.brain.set(HOUSTON_NS_SCREENS, registeredScreens);
    res.reply "Registering screen with IP: #{ip} and Alias: #{alias}"

  robot.respond /houston list/, (res) -> 
    registeredScreens = robot.brain.get(HOUSTON_NS_SCREENS)
    res.reply "Registered Screens: #{registeredScreens}" 