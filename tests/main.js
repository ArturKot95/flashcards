if (Meteor.isServer) {
  import './server.js';
} else if (Meteor.isClient) {
  import './client.js';
}