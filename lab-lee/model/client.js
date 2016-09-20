'use strict';

const uuid = require('uuid');

module.exports = function(socket){
  this.socket = socket;
  this.nickname = `user_${Math.round((Math.random() + 1)*(100))}`;
  this.id = uuid.v4().substring(0, 5);
};
