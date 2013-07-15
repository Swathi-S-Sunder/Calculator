/**
 * Created with IntelliJ IDEA.
 * User: swathis
 * Date: 9/7/13
 * Time: 11:45 AM
 * To change this template use File | Settings | File Templates.
 */

Calculator.Views.ButtonView = Ember.View.extend({
    tagName: 'button',
    template: Ember.Handlebars.compile("{{unbound view.content.title}}"),
    click: function(event) {
        this.get('controller').buttonPressed(event.target.innerHTML);
    }
});

