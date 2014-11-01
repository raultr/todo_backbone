 //'use strict'
//Antes de realizar la deﬁnición de un nuevo objeto, 
//comprobamos si ya existe; en este caso,
//utilizamos la instancia ya creada en vez de crear una nueva
var app = app || {};

// Modelo Todo
app.Todo = Backbone.Model.extend({
	defaults: {
		title: '',
		completed: false
	},

	// Este metodo pone la tarea como completada
	toggle: function() {
		this.save({
		completed: !this.get('completed')
	});
	}
});