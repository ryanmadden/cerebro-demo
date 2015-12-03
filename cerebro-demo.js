if (Meteor.isClient) {

  Session.set('userFilter', {});

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.helpers({
    filteredUsers: function() {
      // var userFilter = {username: {$in: ["kevinchen", "ryanmadden"]}}; //Match any item in a list
      // userFilter = {"profile.first_name": 'Ryan'}; //Find by profile field
      // userFilter = {"profile.attributes": {$elemMatch: {$in: ['camera']}}};
      // userFilter = {"profile.age": {$gte: 21}};
      Meteor.call('filterUsers', Session.get('userFilter'), function(error, result) {
        if (error) { console.log(error);}
        Session.set('filteredUsers', result);
      });
      return Session.get('filteredUsers');
    },
    users: function() {
      return Meteor.users.find({}).fetch();
    }
  });

  Template.body.events({
    "click #filter-camera": function(event) {
      Session.set('userFilter', {"profile.attributes": {$in: ['camera']}});
    },
    "click #filter-tech": function(event) {
      Session.set('userFilter', {"profile.company": {$in: ['Google', 'IndieGoGo']}});
    },
    "click #filter-beer": function(event) {
      Session.set('userFilter', {"profile.age": {$gte: 21}});
    },
    "click #filter-dog": function(event) {
      Session.set('userFilter', {"profile.attributes": {$in: ['dog']}});
    },
    "click #filter-master": function(event) {
      Session.set('userFilter', {  
        $or:[  
        {  
          "profile.company": {  
            $in:[  
            "Google",
            "IndieGoGo"
            ]
          }
        },
        {  
          "profile.age": {  
            $gt:20
          }
        }
        ],
        $and:[  
        {  
          "profile.hasCamera":true
        },
        {  
          "profile.hasDog":true
        }
        ]
      });
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
          attributes: ['dog', 'camera'],
        }
      });
    }
  });
}

Meteor.methods({
  filterUsers: function(filter) {
    var users = Meteor.users.find(filter).fetch();
    return users;
  }
});