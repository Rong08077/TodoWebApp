
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/todos',
    'views/todos',
    'text!templates/stats.html',
    'text!templates/markalldone.html'],
    function ($, _, Backbone, Todos, TodoView, statsTemplate, markAllDoneTemplate) {

    'use strict';

    var AppView = Backbone.View.extend({

        el: $("#todoapp"),

        statsTemplate: _.template(statsTemplate),

        markAllDoneTemplate: _.template(markAllDoneTemplate),

        events: {
            "keypress #new-todo": "createOnEnter",
            "keyup #new-todo": "showTooltip",
            "click .todo-clear a": "clearCompleted",
            "click #mark-all-done": "toggleAllComplete"
        },

        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');

            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#mark-all-done");

            Todos.bind('add', this.addOne);
            Todos.bind('reset', this.addAll);
            Todos.bind('all', this.render);

            Todos.fetch();
        },

        render: function () {
            var done = Todos.done().length;
            var remaining = Todos.remaining().length;

            this.$('#todo-stats').html(this.statsTemplate({
                total: Todos.length,
                done: done,
                remaining: remaining
            }));

            this.allCheckbox.html(this.markAllDoneTemplate({
                label: '标记所有任务完成',
                checked: !remaining
            }));
        },

        addOne: function (todo) {
            var view = new TodoView({
                model: todo
            });
            this.$("#todo-list").append(view.render().el);
        },

        addAll: function () {
            Todos.each(this.addOne);
        },

        newAttributes: function () {
            return {
                content: this.input.val(),
                order: Todos.nextOrder(),
                done: false
            };
        },

        createOnEnter: function (e) {
            if(e.keyCode !== 13) {
                return;
            }
            Todos.create(this.newAttributes());
            this.input.val('');
        },

        clearCompleted: function () {
            _.each(Todos.done(), function (todo) {
                todo.clear();
            });
            return false;
        },

        showTooltip: function (e) {
            var tooltip = this.$(".ui-tooltip-top");
            var val = this.input.val();
            tooltip.fadeOut();
            if (this.tooltipTimeout) {
                window.clearTimeout(this.tooltipTimeout);
            }
            if (val === '' || val === this.input.attr('placeholder')) {
                return;
            }
            var show = function () {
                tooltip.show().fadeIn();
            };
            this.tooltipTimeout = _.delay(show, 1000);
        },

        toggleAllComplete: function () {
            var done = Todos.remaining().length;
            
            Todos.each(function (todo) {
                todo.save({
                    'done': done
                });
            });
        }

    });
    return AppView;
});