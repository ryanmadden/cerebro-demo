notifications = new Meteor.Collection('notifications');

if (Meteor.isClient) {

  Session.set('userFilter', {
    "$any": {
      "company": ["Google", "IndieGoGo"],
      "age": {"$gt": 20}
    },
    "$all": {
      "hasCamera": true,
      "hasDog": true
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.demo.helpers({
    filteredUsers: function() {
      Meteor.call('filterUsers', Session.get('userFilter'), function(error, result) {
        if (error) { console.log(error);}
        Session.set('filteredUsers', result);
      });
      return Session.get('filteredUsers');
    },
    notifications: function() {
      if (Meteor.user()) {
        return notifications.find({"users._id": Meteor.user()._id}).fetch();
      }
      else {
        return notifications.find({}).fetch();
      }
    },
    users: function() {
      return Meteor.users.find({}).fetch();
    }
  });

  Template.demo.events({
    "click #filter-camera": function(event) {
      // Session.set('userFilter', {"profile.attributes": {$in: ['camera']}});
      var filterObj = {"$all": {"hasCamera": true}};
      Session.set('userFilter', filterObj);
      Meteor.call('createNotification', "Take a picture with your camera!", filterObj);
    },
    "click #filter-tech": function(event) {
      // Session.set('userFilter', {"profile.company": {$in: ['Google', 'IndieGoGo']}});
      var filterObj = {"$all": {"company": ["Google", "IndieGoGo"]}}
      Session.set('userFilter', filterObj);
      Meteor.call('createNotification', "You work at a tech company!", filterObj);
    },
    "click #filter-beer": function(event) {
      // Session.set('userFilter', {"profile.age": {$gte: 21}});
      var filterObj = {"$all": {"age": {"$gt": 20}}};
      Session.set('userFilter', filterObj);
      Meteor.call('createNotification', "Go to the nearest bar and buy a drink!", filterObj);
    },
    "click #filter-dog": function(event) {
      var filterObj = {"$all": {"hasDog": true}};
      Session.set('userFilter', filterObj);
      Meteor.call('createNotification', "Pet your dog!", filterObj);
    },
    "click #filter-master": function(event) {
      var specialUserProfile = {
        "$any": {
          "company": ["Google", "IndieGoGo"],
          "age": {"$gt": 20}
        },
        "$all": {
          "hasCamera": true,
          "hasDog": true
        }
      };
      Session.set('userFilter', specialUserProfile);
      Meteor.call('createNotification', "You're older than 20, work at a tech company, and have a camera and a dog.", filterObj);
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
    Meteor.users.remove({});
    if (Meteor.users.find().count() === 0) {
      Accounts.createUser({
        username: 'ryanmadden',
        email: 'ryan@gmail.com',
        password: 'password',
        profile: {
          first_name: 'Ryan',
          last_name: 'Madden',
          age: 20,
          company: 'Google',
          attributes: [],
        }
      });
      Accounts.createUser({
        username: 'johnnybravo',
        email: 'jbravo@yahoo.com',
        password: 'password',
        profile: {
          first_name: 'Johnny',
          last_name: 'Bravo',
          age: 22,
          company: 'Google',
          hasCamera: true,
          hasDog: true,
          attributes: ['camera'],
        }
      });
      Accounts.createUser({
        username: 'kevinchen',
        email: 'kevin@yahoo.com',
        password: 'password',
        profile: {
          first_name: 'Kevin',
          last_name: 'Chen',
          age: 22,
          company: 'IndieGoGo',
          attributes: ['camera'],
        }
      });
      Accounts.createUser({
        username: 'haoqizhang',
        email: 'haoqi@gmail.com',
        password: 'password',
        profile: {
          first_name: 'Haoqi',
          last_name: 'Zhang',
          age: 30,
          company: 'Northwestern',
          hasDog: true,
          attributes: ['dog', 'camera'],
        }
      });
    }
  });
}

Meteor.methods({
  createNotification: function(message, obj) {
    Meteor.call('filterUsers', obj, function(e,r) {
      notifications.insert({
        text: message,
        users: r
      });
    });
  },
  clearNotifications: function() {
    notifications.remove({});
  }
});