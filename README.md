### Cerebro Demo

This repository contains a demo Meteor app focused on developing a user query engine. 

Users can be queried by passing a JSON like this to the queryTransform() function:

```
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
```

Now you don't have to remember that there's a user.profile object or think about Mongo queries!