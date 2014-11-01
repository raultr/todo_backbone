//En la vista se asigna un elemento del DOM a cada una de las tareas

var app = app || {};

//Esta vista envuelve la plantilla de cada una de las tareas del modelo en un elemento de una lista.
app.TodoView = Backbone.View.extend({
	tagName: 'li', //El elemento li del documento

	//Deﬁnir la plantilla que se utiliza para mostrar los datos del modelo en el documento HTML.
	//Mediante la utilidad template de Underscore.js se extrae la plantilla del documento HTML y se guarda una copia en la propiedad template de la vista
	template: _.template( $('#item-template').html() ),
	
	// Lista de eventos a los que reaccionara la vista
	events: {
		'dblclick label': 'edit',
		'keypress .edit': 'updateOnEnter', //Evento keypress sobre un elemento con la clase edit
		'blur .edit': 'close', //Cuando pierde el foco el elemento

		'click .toggle': 'togglecompleted', // toggle es el checkbox
		'click .destroy': 'clear',  //destroy es la cruz de elminar en cada elemento
	},

	//Esta funcion es llamada al crearse la vista
	initialize: function() {
		//Asociamos los cambios que se hagan en los datos del modelo
		//Cuando cambia el modelo se redibuja la vista
		this.listenTo(this.model, 'change', this.render); //Cuando cambia una tarea

		this.listenTo(this.model, 'destroy', this.remove); //Cuando se elimina una tarea
		this.listenTo(this.model, 'visible', this.toggleVisible);  //Cuando se muestra u oculta una tarea
	},

	//Redibuja la vista con los datos del modelo
	render: function() {
		this.$el.html( this.template( this.model.attributes ) );
		
		//toggleClass es una funcion de jquery que agrega o quita una clase segun su estado
		//completed indica que hace cando termina el efecto
		this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
		
		this.toggleVisible()
		
		this.$input = this.$('.edit'); //Guardamos una referencia al elemento seleccionado
		return this; //es una buena práctica devolver this al ﬁnal para habilitar la concatenación de llamadas.
	},

	// Pone a la vista en modo de edicion y pone el foco en el input
	edit: function() {
		this.$el.addClass('editing');
		this.$input.focus();
	},


	// Cierra el modo edicion y guarda el valor del input en el modelo
	close: function() {
		var value = this.$input.val().trim();
		if ( value ) {
			this.model.save({ title: value });
		}else {
			//Si el campo esta en blanco, elminamos el elemento actual
			this.clear(); 
		}
		this.$el.removeClass('editing');
	},

	// Si se da enter en el input de edicion, llama al metodo close:
	updateOnEnter: function( e ) {
		if ( e.which === ENTER_KEY ) {
			this.close();
		}
	},

	
	//Muestra u oculta 
	toggleVisible : function () {
		this.$el.toggleClass( 'hidden', this.isHidden());
	},

	//Indica si el modelo se ha completado o esta 
	//app.TodoFilter se establece en el router
	isHidden : function () {
		var isCompleted = this.model.get('completed');
		return ( // hidden cases only
		(!isCompleted && app.TodoFilter === 'completed')
		|| (isCompleted && app.TodoFilter === 'active')
		);
	},

	//lama a la funcion toggle del modelo
	//es la encargada de poner la tarea como completa
	//y guardar los datos en el localstorage
	togglecompleted: function() {
		this.model.toggle();
	},

	//destruy el modelo actual
	clear: function() {
		this.model.destroy();	
	}

});