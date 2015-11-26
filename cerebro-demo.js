if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function() {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function() {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.helpers({
    users: function() {
      return Meteor.users.find({}).fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
    if (Meteor.users.find().count() === 0) {
      Accounts.createUser({
        username: 'username',
        email: 'email',
        password: 'asdfasdf',
        profile: {
          first_name: 'fname',
          last_name: 'lname',
          company: 'company',
        }
      });
    }
  });
}