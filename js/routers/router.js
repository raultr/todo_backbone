//Los router de Backbone.js proporcionan un método para enlazar páginas del lado del cliente 
//con acciones y eventos en la aplicación.

var Workspace = Backbone.Router.extend({
	//La propiedad routes deﬁne las conexiones entre URLs y funciones de la apli-cación. 
	//Las routes pueden contener parámetros, 
	//como ocurre con filter, que deﬁne una relación con cualquier URL que acabe en filter.
	routes:{
	'*filter': 'setFilter' //filter toma la ruta de cualquier direccion depues del signo de  #
	},


	//Quita los espacios a la ruta pasada como parametro

	setFilter: function( param ) {
		// Set the current filter to be used
		if (param) {
			param = param.trim();
		}
		//Esta variable contiene la ruta
		app.TodoFilter = param || '';
		//Se lanza el evento filter de la coleccion que la vista esta escuchando tambien
		app.Todos.trigger('filter');
	}
});

//Una vez deﬁnido el sistema de routes, 
//se crea una instancia 
//y se inicializa el seguimiento de los cambios que se producen en la URL mediante 
app.TodoRouter = new Workspace();
Backbone.history.start();