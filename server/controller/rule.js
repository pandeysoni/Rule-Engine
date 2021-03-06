'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    Rule = require('../model/rule').Rule,
    mongoose = require('mongoose');


exports.getAll = {
  handler: function (request, reply) {
    Rule.findRule(function (err, result) {
      if (!err) {
        return reply(result);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  }
};

exports.getOne = {
  handler: function (request, reply) {
    Rule.findOneRule(request.params.id, function (err, result) {
      if (!err) {
        return reply(result);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  }
};

exports.create = {
  handler: function (request, reply) {
    request.payload.condition = JSON.stringify(request.payload.condition);
    Rule.createRule(request.payload, function (err, result) {
      if (!err) {
        return reply(result).created('/result/' + result._id); // HTTP 201
      }
      if (11000 === err.code || 11001 === err.code) {
        return reply(Boom.forbidden("please provide another rule id, it already exist"));
      }
      return reply(Boom.forbidden(err)); // HTTP 403
    });
  }
};

exports.update = {
  handler: function (request, reply) {
    Rule.findOneRule(request.params.id, function (err, result) {
      if (!err) {
        updateHelper(request.payload, ruleData);
        Rule.updateRule(ruleData, function (err, saveData) {
          if (!err) {
            return reply(saveData); // HTTP 201
          }
          if (11000 === err.code || 11001 === err.code) {
            return reply(Boom.forbidden("please provide another rule id, it already exist"));
          }
          return reply(Boom.forbidden(err)); // HTTP 403
        });
      }
      else{ 
        return reply(Boom.badImplementation(err)); // 500 error
      }
    });
  }
};

exports.remove = {
  handler: function (request, reply) {
    Rule.findOneRule(request.params.id, function (err, result) {
      if (!err && user) {
        Rule.removeUser(result, function(err, res){
          return reply({ message: "Rule deleted successfully"});
        })
      }
      if (!err) {
        return reply(Boom.notFound());
      }
      return reply(Boom.badRequest("Could not delete rule"));
    });
  }
};

exports.removeAll = {
  handler: function (request, reply) {
    mongoose.connection.db.dropCollection('rules', function (err, result) {
      if (!err) {
        return reply({ message: "Rule database successfully deleted"});
      }
      return reply(Boom.badRequest("Could not delete rule"));
    });
  }
};

var updateHelper = function(requestData, originalData) {       
  for(var req in requestData){
    if(requestData[req] === " "){
      originalData[req] = " ";
    }
    else{
      originalData[req] = requestData[req];
    }
  }       
}
