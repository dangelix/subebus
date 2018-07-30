var app=angular.module("app",['ngRoute', 'ngCookies',]);
app.config([ '$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {
	$httpProvider.defaults.headers.common = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Method': 'GET'};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
	$routeProvider.when('/login', {
		templateUrl : "pages/login.html",
		controller : "navigation"
	});
	$routeProvider.when('/welcome', {
		templateUrl : "pages/welcome.html",
		controller : "welcomeController"
	});
	$routeProvider.when('/dhl', {
		templateUrl : "pages/dhl.html",
		controller : "DHLController"
	});
	$routeProvider.when('/fedex', {
		templateUrl : "pages/fedex.html",
		controller : "DHLController"
	});
	$routeProvider.when('/Sucursal', {
		templateUrl : "pages/sucursal/navbar.html",
		controller : "navigation"
	});
	$routeProvider.when('/AltaUsuario', {
		templateUrl : "pages/AltaUsuario.html",
		controller : "userController"
	});
	$routeProvider.when('/ModUsuario', {
		templateUrl : "pages/modUsuario.html",
		controller : "modUserController"
	});
	$routeProvider.when('/AltaSucursal', {
		templateUrl : "pages/AltaSucursal.html",
		controller : "sucursalController"
	});
	$routeProvider.when('/altaPaquete', {
		templateUrl : "pages/AltaPaquete.html",
		controller : "paqueteriaController"
	});
	$routeProvider.when('/Ventas', {
		templateUrl : "pages/Ventas.html",
		controller : "EnvioController"
	});
	$routeProvider.when('/altaGuia', {
		templateUrl : "pages/AltaGuia.html",
		controller : "guiaController"
	});
	$routeProvider.when('/guia', {
		templateUrl : "pages/Guia.html",
		controller : "guiaController"
	});
	$routeProvider.when('/error', {
		templateUrl : "pages/error.html"
	});
	$routeProvider.when('/', {
		templateUrl : "pages/welcome.html",
		controller : "DHLController"
	});
//	$routeProvider.otherwise({
//		redirectTo : '/NoFound',
//		templateUrl : "pages/noPage.html",
//		controller : "OTsListController"
//	});
}]);

app.factory("userFactory", function(){
	var usuarioFirmado={usuario:"", pass:"",perfil:""};
	
	    var respuesta={
	    	getUsuarioFirmado: function(){
	            return usuarioFirmado;
	        },
	        setUsuarioFirmado: function(user){
	        	usuarioFirmado = user;
//	        	console.log("EL Usuario",usuarioFirmado)
	        },
	        getUsuarioPerfil: function(){
	            return usuarioFirmado.perfil;
	        },
	    }
	return respuesta;
});

app.service('sessionService', [
	'$rootScope',
	'$http',
	'$window',
	'$location',
	'$q',
	'userFactory',
	'$cookieStore',
	'sucursalService',
	function($rootScope,$http, $window,$location, $q,userFactory,$cookieStore,sucursalService) {
		this.authenticate = function(credentials, callback) {

			var headers = credentials ? {
				authorization : "Basic"
						+ btoa(credentials.username + ":"
								+ credentials.password)
			} : {};
			$http.get('/user', {
				headers : headers
			}).success(function(data) {
				userFactory.setUsuarioFirmado(data);
				if (data.usuario) {
					$rootScope.authenticated = true;
					$rootScope.variable = true;
//					$http.get("/notificacion/numAlertas/"+ data.id).then(function(response){
//						$rootScope.numNotificaciones=response.data;
//					})
					$location.path("/welcome");
					$window.location.reload();
				} else {
					$rootScope.authenticated = false;
				}
			}).error(function(data) {
				alert("Usuario o Contraseña incorrectos");
				$location.path("/login");
			});
		}
		this.reset=function(data){
			var d = $q.defer();
			$http.post("/usuario/reset/",data).then(
				function(response) {
					d.resolve(response.data);
				});
			return d.promise;
		}
		this.isAuthenticated = function() {
			var d = $q.defer();
			$http.get("currentSession").success(function(data) {
				$rootScope.UserData=data;
				$cookieStore.put("usuario", data.usuario);
				$cookieStore.put("perfil", data.perfil);
//				console.log("Solo el Usuario a cookie",data.usuario);
				$cookieStore.put("idSucursal", data.idSucursal);
				$rootScope.authenticated = true;
				
				sucursalService.getSucursal(data.idSucursal).then(function(data) {
					$rootScope.sucursalData=data;
					$rootScope.SucursalName=data.nombre;
					$cookieStore.put("sucursal_name", data.nombre);
					$cookieStore.put("sucursal_dirs", data.ubicacion);
				
//					console.log("La Sucursal",$rootScope.sucursalData);
				})
				d.resolve(data);
			}).error(function(data) {
				$location.path("/login");
			});
			
			return d.promise;
		}

} ]);

app.controller('navigation', [ 'sessionService','$window', '$rootScope', '$scope','$http', '$location','userFactory',
	function(sessionService, $rootScope, $scope, $http, $location,userFactory) {
		$scope.credentials = {};
		$scope.login = function() {
			sessionService.authenticate($scope.credentials, function() {
				if ($rootScope.authenticated) {
					$scope.error = false;
					$location.path("/welcome");
				} else {
					$location.path("/login");
					$scope.error = true;
				}
			});
		};
		$('html, body').animate({scrollTop:0}, 'slow');
		$scope.restablecer=function(email){
			sessionService.reset(email).then(function(data){
			
					alert("Correo enviado correctamenta para restablecer su contrase\u00f1a");
					location.reload();
					
		//			setTimeout(window.location.reload.bind(window.location), 1000);
				
			
		});}
} ]);

app.run(['$rootScope','$http','sessionService','userFactory',function ($rootScope,$http,sessionService,userFactory) {
	sessionService.isAuthenticated().then(function(data){
		var us= data;
		$rootScope.UserData=data;
		userFactory.setUsuarioFirmado(us);
		$rootScope.perfilUsuario=userFactory.getUsuarioPerfil();
//		$http.get("/notificacion/numAlertas/"+ us.id).then(function(response){
//			$rootScope.numNotificaciones=response.data;
//		})
	});
}]);