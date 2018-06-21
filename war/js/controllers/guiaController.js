app.service("guiaService",['$http', '$q','$window', function($http, $q,$window){
	this.addGuia = function(number1,number2) {
		var d = $q.defer();
		$http.get("guia/addM/"+number1+"/"+number2).then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				},
				function(response) {
					if(response.status==400){
					alert("No se puede crear "
							+ usuario.usuario + " usuario o correo no disponibles");
					}if(response.status==403){
						//alert("No tiene permiso de realizar esta acción");
//						$location.path("/login");
					}
					d.reject(response);
					$window.location.reload;
				});
		return d.promise;
	}
	
	this.getGuia = function() {
		var d = $q.defer();
		$http.get("guia/findAll/").then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				},
				function(response) {
					if(response.status==400){
					alert("No se puede crear "
							+ usuario.usuario + " usuario o correo no disponibles");
					}if(response.status==403){
						//alert("No tiene permiso de realizar esta acción");
//						$location.path("/login");
					}
					d.reject(response);
					$window.location.reload;
				});
		return d.promise;
	}
	
	this.cancelarGuia = function(id) {
		var d = $q.defer();
		$http.get("guia/cancelar/"+id).then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				},
				function(response) {
					if(response.status==400){
					alert("No se puede crear "
							+ usuario.usuario + " usuario o correo no disponibles");
					}if(response.status==403){
						//alert("No tiene permiso de realizar esta acción");
//						$location.path("/login");
					}
					d.reject(response);
					$window.location.reload;
				});
		return d.promise;
	}
	
	this.asignarGuia = function(idSuc,idGuia) {
		var d = $q.defer();
		$http.get("guia/asignar/"+idSuc+"/"+idGuia).then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				},
				function(response) {
					if(response.status==400){
					alert("No se puede crear "
							+ usuario.usuario + " usuario o correo no disponibles");
					}if(response.status==403){
						//alert("No tiene permiso de realizar esta acción");
//						$location.path("/login");
					}
					d.reject(response);
					$window.location.reload;
				});
		return d.promise;
	}

	this.getSucursal = function() {
		var d = $q.defer();
		$http.get("sucursal/findAll/").then(
				function(response) {
					console.log(response);
					d.resolve(response.data);
				},
				function(response) {
					if(response.status==400){
					alert("No se puede crear "
							+ usuario.usuario + " usuario o correo no disponibles");
					}if(response.status==403){
						//alert("No tiene permiso de realizar esta acción");
//						$location.path("/login");
					}
					d.reject(response);
					$window.location.reload;
				});
		return d.promise;
	}
	
	
	
}]);


app.controller("guiaController",['$scope','$rootScope','$window', '$location', '$cookieStore','$cookies','guiaService','sessionService',function($scope,$rootScope, $window, $location, $cookieStore,$cookies, guiaService,sessionService){
	sessionService.isAuthenticated();
//	$cookieStore.get('usuario');
	guiaService.getSucursal().then(function(data) {
		$scope.sucursal=data;
		console.log("Sucursal", $scope.sucursal);
	});
	guiaService.getGuia().then(function(data) {
		$scope.guias=data;
		for (var o = 0; o < $scope.guias.length; o+=1) {
			
			for (var i = 0; i < $scope.sucursal.length; i+=1) {
				  if($scope.guias[o].idSucursal==$scope.sucursal[i].id){
					  $scope.guias[o].sucursal=$scope.sucursal[i].nombre;
					  
				  }
				}
			
		}
		
	});
	
$scope.getSucursal=function(){
		
		for (var i = 0; i < $scope.guias.length; i+=1) {
			  if($scope.cliente[0].idBrocker==$scope.bk[i].id){
				  $scope.namebk=$scope.bk[i].nickname;
				  $scope.idbk=$scope.bk[i].id
				  console.log("Match",  $scope.namebk);
			  }
			}
	}

	$scope.addguias = function(dato1,dato2) {
		
		guiaService.addGuia(dato1,dato2).then(function(data) {
			alert("Guias Agregadas correctamente");
			$window.location.reload();
		});
	}
	
	$scope.ver = function (data){
		$scope.guia=data;
		console.log("Guia tomada",$scope.guia);
		
	}
	$scope.cancelar = function (g){
		 var r = confirm("¿Desea Continuar con la Cancelacion?");
		    if (r == true) {
		    	guiaService.cancelarGuia(g.id).then(function(data) {
		    		alert("Se ha Cancelado la Guia: ", g.numero);
		    		$window.location.reload();
		    	});
		    }
		
	}
	
	$scope.asignar = function (idSuc,idGuia){
		guiaService.asignarGuia(idSuc,idGuia).then(function(data) {
			alert("Guias Asignada correctamente");
			$window.location.reload();
		});
	}
} ]);
