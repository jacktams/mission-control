Helper = require('hubot-test-helper')
chai = require 'chai'

expect = chai.expect

helper = new Helper('../src/houston.coffee')

describe 'houston', ->
  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

  it 'responds to hi', ->
    @room.user.say('alice', '@hubot houston hi').then =>
      expect(@room.messages).to.eql [
        ['alice', '@hubot houston hi']
        ['hubot', '@alice hello!']
      ]
  
  context 'correct handles registration requests', -> 
    beforeEach -> 
      @room.user.say('alice', "@hubot houston register 127.0.0.1 home")
    
    it 'responds to register successfully', -> 
      expect(@room.messages).to.eql [
        ['alice', '@hubot houston register 127.0.0.1 home'],
        ['hubot', '@alice Registering screen with IP: 127.0.0.1 and Alias: home']
      ]
    
    it 'correctly updates the brain', -> 
      expect(@room.robot.brain.get('houston.screens')).to.eql [
        { ip: '127.0.0.1', alias: 'home' }
      ]
    
    it 'correctly lists current screens', -> 
      @room.user.say('alice', '@hubot houston list').then => 
        console.log(@room.messages)