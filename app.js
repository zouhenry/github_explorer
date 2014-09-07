window.Github = Ember.Application.create({
    rootElement: "#github-app",
    LOG_TRANSITIONS: true
});

Ember.Handlebars.registerBoundHelper('fromDate', function(theDate){
   var today = moment();
    var target = moment(theDate);
    return target.from(today);
});

Github.IndexRoute = Ember.Route.extend({
    model: function () {
        return [
            {login: 'zouhenry', name: "Henry Zou"} ,
            {login: 'robconery', name: "Rob Conery"},
            {login: 'TomDale', name: "Tom Dale"},
            {login: 'wycats', name: "Yehuda Katz"}
        ];
    }
});

Github.IndexController = Ember.ArrayController.extend({
    renderedOn: function () {
        return new Date();
    }.property(),
    actions: {
        clickMe: function () {
            console.log("clicked me");
        }
    }
});

Github.Router.map(function () {
    this.resource("user", {path: "/users/:login"}, function () {
        this.resource("repositories");
        this.resource("repository", {path: "repositories/:reponame"}, function(){
            this.resource("issues");
            this.resource("forks");
            this.resource("commits");
        });
    });
});

Github.UserRoute = Ember.Route.extend({
    model: function (params) {
        return Ember.$.getJSON("https://api.github.com/users/" + params.login);
    }
});

Github.UserIndexRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('user');
    }
});
Github.RepositoriesRoute = Ember.Route.extend({
    model: function () {
        var user = this.modelFor('user');
        return Ember.$.getJSON(user.repos_url);
    }
});
Github.RepositoriesController = Ember.ArrayController.extend({
    needs: ["user"],
    user: Ember.computed.alias("controllers.user")
});

Github.RepositoryRoute = Ember.Route.extend({
    model: function (params) {
        var user = this.modelFor('user');

        var url = "https://api.github.com/repos/" + user.login + "/" + params.reponame;
        return Ember.$.getJSON(url);
    }
});

Github.RepositoryController = Ember.ObjectController.extend({
    needs: ["user"],
    user: Ember.computed.alias("controllers.user"),
    forked: Ember.computed.alias('fork')
});

Github.IssuesRoute = Ember.Route.extend({
   model: function(){
       var repo = this.modelFor('repository');
       var url = repo.issues_url.replace("{/number}", "");
       return Ember.$.get(url);
   }
});
Github.ForksRoute = Ember.Route.extend({
   model: function(){
       var repo = this.modelFor('repository');
       var url = repo.forks_url;
       return Ember.$.get(url);
   }
});