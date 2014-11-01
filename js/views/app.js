//En la vista app.TodoView se han incluido todas aquellas funciones que actúan sobre uno de los elementos del modelo. 
//En la vista de aplicación se encuentran las que afectan al conjunto de tareas (la colección), 
//que en TodoMVC caso coinciden con la aplicación completa.

var app = app || {};

// The Application
// ---------------
// La clase abstracta de la vista
app.AppView = Backbone.View.extend({
	
	//Para la vista de la aplicación no se crea un nuevo elemento, 
	//sino que se utiliza la section id="todoapp" del documento HTML que corresponde al body de la pagina
	el: '#todoapp',

	//copia de la plantilla para la línea bajo la lista de tareas en la que se muestra información 
	//sobre el número de tareas que se han completado, las que se tienen pendientes, etc. . .
	statsTemplate: _.template( $('#stats-template').html() ),

	//Eventos asociados a la vista general de la aplicacion
	events: {
		'keypress #new-todo': 'createOnEnter',  //Crear nuevas tareas
		'click #clear-completed': 'clearCompleted', //Eliminar las tareas completadas
		'click #toggle-all': 'toggleAllComplete' //Marcar todas las tareas como completadas
	},
	
	//iniciacilizacion de la vista
	initialize: function() {
		//Elementos del DOM que se utilizaran
		this.allCheckbox = this.$('#toggle-all')[0]; //El checkbox para marcar todas la tareas
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');
		
		//Eventos de que se escuchara para la coleccion app.Todos 
		this.listenTo(app.Todos, 'add', this.addOne);
		this.listenTo(app.Todos, 'reset', this.addAll); //Cuando se limpia la coleccion

		// Cuando el cambio se completa verifica se filtran de nuevo los datos
		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		//Cuando se filtra la coleccion
		this.listenTo(app.Todos,'filter', this.filterAll);

		//Asocia todos los eventos a la funcion render 
		//para que siempre que haya un cambio se actualice la aplicacion
		this.listenTo(app.Todos, 'all', this.render);

		//Aqui obtenemos la lista de tareas guardas en el localstorage
		app.Todos.fetch();
		return this;
	},

	//Actualiza las estadisticas de la aplicacion
	render: function() {

		var completed = app.Todos.completed().length; //Todos las tareas completadas
		var remaining = app.Todos.remaining().length; //Todas la tareas que no han sido completadas

		//Si hay elementos en la coleccion
		if ( app.Todos.length ){

			this.$main.show(); //Se muestra el main de la pagina
			this.$footer.show(); //Se muestra el footer de la pagina

			//Se le pasan los datos al statsTemplate para que se muestren actualizados			
			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			//Si hay datos se muestran los enlaces de  All, Active  Completed
			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
				.addClass('selected');
	
		} else {
			this.$main.hide();
			this.$footer.hide();
		}
		this.allCheckbox.checked = !remaining; //Si no hay tareas no completadas se selccionan todas
	},

	//Se utiliza para añadir un elemento a la vista
	//todo-list es el id de una etiqueta ul
	addOne: function(todo) {

		var view = new app.TodoView({ model: todo });
		this.$('#todo-list').append( view.render().el );
	},
	
	// Agrega todos los elementos de la coleccion a la vista
	//todo-list es el id de una etiqueta ul
	addAll: function() {
		//#todo-list es el ul
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this);
	},

	// Filtra uno, Lanza el evento visible del modelo
	filterOne : function (todo) {
		todo.trigger('visible');
	},

	// Itera sobre todos los elementos de la coleccion
	// y lanza el evento visible para cada uno de ellos
	filterAll : function () {
		app.Todos.each(this.filterOne, this);
	},

	//Genera nuevos atributos para cada nuevo elemento de la lista
	newAttributes: function() {
		return {
			title: this.$input.val().trim(),
			order: app.Todos.nextOrder(),
			completed: false
		};
	},

	//Cuando se pulsa la tecla enter y hay un valor en el input
	//se crea unanueva tarea
	createOnEnter: function( event ) {
		if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
		return;
		}
		//Crea un nuevo elelento dentro de la coleccion
		app.Todos.create( this.newAttributes() );
		this.$input.val('');
	},

	
	// elimina los modelos de las tareas completadas
	clearCompleted: function() {
		_.invoke(app.Todos.completed(), 'destroy');
		return false;
	},
	
	// Se cambia la propiedad completed a todos los elementos de la coleccion
	toggleAllComplete: function() {
		var completed = this.allCheckbox.checked;
		app.Todos.each(function( todo ) {
			todo.save({
			'completed': completed
			});
		});
	}
	});