
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/todos.html'],
    function ($, _, Backbone, todosTemplate) {

    'use strict';

    var TodoView = Backbone.View.extend({

        tagName: "tr",

        template: _.template(todosTemplate),

        events: {
            "click .todo-content": "toggleDone",
            "click .todo-indicator": "toggleDone",
            "click .todo-edit": "edit",
            "click .todo-destroy": "clear",
            "keypress .todo-input": "updateOnEnter",
            "blur .todo-input": "close"
        },

        initialize: function () {
            _.bindAll(this, 'render', 'close', 'remove');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove);
        },

        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            this.input = this.$('.todo-input');
            return this;
        },

        toggleDone: function () {
            this.model.toggle();
        },

        switchMode: function (mode) {
            switch (mode) {
            case 'edit':
                this.$('.edit-item').removeClass('hidden');
                this.$('.show-item').addClass('hidden');
                break;
                    
            case 'show':
            default:
                this.$('.edit-item').addClass('hidden');
                this.$('.show-item').removeClass('hidden');
                break;
            }
        },

        edit: function (event) {
            this.switchMode('edit');
            this.input.focus();
        },

        close: function () {
            this.model.save({
                content: this.input.val()
            });
            this.switchMode('show');
        },

        updateOnEnter: function (e) {
            if (e.keyCode === 13) {
                this.close();
            }
        },

        clear: function () {
            this.model.clear();
        }

    });
    return TodoView;
});