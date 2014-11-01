//Las colecciones son conjuntos ordenados de modelos.

var app = app || {};


//Esta clase es el molde que se utiliza para crear tantas instancias de la clase TodoList como se requiera.
var TodoList = Backbone.Collection.extend({
		// Tipo de modelo que compone la coleccion
		model: app.Todo,
		// las llamadas se realizaran sobre el almacenamiento local y no sobre un almacenamiento remoto.
		localStorage: new Backbone.LocalStorage('todos-backbone'),


		// Esta propiedad permite filtrar las tareas que se han completado 
		completed: function() {
			// filter() es un método de Underscore.js que comprueba si los elementos de una lista verifican un test de verdadero/falso.
			return this.filter(function( todo ) {
				//Para cada elemento de la lista se obtienen solos las tareas completadas
			return todo.get('completed');
			});
		},
		
			//Filtra las tareas que no han sido completadas
		remaining: function() {
			//without() que devuelve todos los elementos de un array a los que se han eliminado los valores pasados como segundo parámetro.
			return this.without.apply( this, this.completed() );
		},
		
		//Obtiene el siguiente numero consecutivo para la proxima tarea que se genere
		nextOrder: function() {
			if ( !this.length ) {
			return 1;
			}
			return this.last().get('order') + 1;
		},

		// La propiedad compartor permite ordenar la coleccion por el campo indicado
		comparator: function( todo ) {
			return todo.get('order');
		}
	});

//Se crea una instancia de la coleccion dentro del app
app.Todos = new TodoList();