app.service("usuarioservice", [
		'$http',
		'$q',
		'$window',
		function($http, $q, $window) {
			this.crearUsuario = function(usuario) {
				var d = $q.defer();
				$http.post("usuario/registro", usuario).then(
						function(response) {
							console.log(response);
							d.resolve(response.data);
						},
						function(response) {
							if (response.status == 400) {
								alert("No se puede crear " + usuario.usuario
										+ " usuario o correo no disponibles");
							}
							if (response.status == 403) {
								// alert("No tiene permiso de realizar esta
								// acción");
								// $location.path("/login");
							}
							d.reject(response);
							$window.location.reload;
						});
				return d.promise;
			}
			this.update = function(usuario,userData) {
				var d = $q.defer();
				$http.post("usuario/update/"+usuario, userData).then(
						function(response) {
							console.log(response);
							d.resolve(response.data);
						},
						function(response) {
						
							if (response.status == 403) {
								// alert("No tiene permiso de realizar esta
								// acción");
								// $location.path("/login");
							}
							d.reject(response);
							$window.location.reload;
						});
				return d.promise;
			}
			this.getUsuario = function() {
				var d = $q.defer();
				$http.get("usuario/getAll").then(function(response) {
					d.resolve(response.data);
				}, function(response) {
					if (response.status == 403) {
						// alert("No tiene permiso de realizar esta acción");
						// $location.path("/login");
					}
					d.reject(response);
					$window.location.reload;
				});
				return d.promise;
			}

			this.consultarUsuariosTodos = function() {
				var d = $q.defer();
				$http.get("/usuario/consultarTodos").then(function(response) {
					d.resolve(response.data);
				}, function(response) {
					if (response.status == 403) {
						// alert("No tiene permiso de realizar esta acción");
						// $location.path("/login");
					}
				});
				return d.promise;
			}
			this.consultarUsuariosAll = function() {
				var d = $q.defer();
				$http.get("/usuario/consultarTodos").then(function(response) {
					d.resolve(response.data);
				}, function(response) {
					if (response.status == 403) {
						// alert("No tiene permiso de realizar esta acción");
						// $location.path("/login");
					}
				});
				return d.promise;
			}
			this.eliminaUsuario = function(usuario) {
				var d = $q.defer();
				$http.post("/usuario/elimina", usuario).then(
						function(response) {
							console.log(response);
							d.resolve(response.data);
						}, function(response) {
						});
				return d.promise;
			};
			this.actualizarUsuario = function(usuario) {
				var d = $q.defer();
				$http.post("/usuario/actualiza", usuario).then(
						function(response) {
							console.log(response);
							d.resolve(response.data);
						}, function(response) {
						});
				return d.promise;
			};

		} ]);

app.service("perfilservice", [ '$http', '$q', function($http, $q) {

} ]);
app.controller("userController", [
		'$scope',
		'$window',
		'$location',
		'$cookieStore',
		'usuarioservice',
		'sessionService',
		'sucursalService',
		function($scope, $window, $location, $cookieStore, usuarioservice,
				sessionService, sucursalService) {
			sessionService.isAuthenticated();
			if ($cookieStore.get('perfil') == 'Cajero') {
				$location.path("/error");
				// window.location.reload;
			}

			sucursalService.getAllSucursal().then(function(data) {
				$scope.listSuc = data;
			})

			$scope.validate = function() {
				if ($scope.usuario.email != $scope.usuario.emailconfirm) {
					$scope.IsMatch = true;
					return false;
				}
				$scope.IsMatch = false;
			}

			$scope.validatePass = function() {
				if ($scope.usuario.password != $scope.usuario.passconfirm) {
					$scope.IsMatchP = true;
					return false;
				}
				$scope.IsMatchP = false;
			}

			$scope.acceptSubmit = function() {
				if (!$scope.IsMatch && $scope.form.pass.$valid
						&& $scope.form.passconfirm.$valid && !$scope.IsMatchP) {
					return true;
				}
				return false;

			}
			$scope.EnviarFormulario = function() {
				// console.log($scope.form.pass.$valid);
				$scope.validate();
				if ($scope.usuario.password != $scope.usuario.passconfirm) {
					alert("Email o contraseña no coinciden")
					// $window.location.reload();
				} else {
					if ($scope.form.pass.$valid) {
						usuarioservice.crearUsuario($scope.usuario).then(
								function(data) {
									var x = document.getElementById("snackbar")
									x.className = "show";
									setTimeout(function() {
										x.className = x.className.replace(
												"show", "");
									}, 3000);
									setTimeout(function() {
										if ($scope.usuario) {
											window.location = "#/AltaUsuario";
											$window.location.reload();
										}
									}, 3000);
									//						
								})
					} else {
						alert("Contraseña no valida, intente de nuevo");
					}
				}
			}
		} ]);

// $scope.cargarPagina(1);

app.controller("controladorListaUsuarios", [ '$scope', 'usuarioservice',
		'perfilservice', '$location', '$window',
		function($scope, usuarioservice, perfilservice, $location, $window) {

			usuarioservice.consultarUsuariosTodos().then(function(data) {
				$scope.usuariosLista = data;
			})

			$scope.actualizarUsuario = function(usuario) {
				console.log(usuario);
				usuarioservice.actualizarUsuario(usuario).then(function(data) {
					alert("Usuario modificado correctamente");
					$window.location.reload();
				});
			}

			$scope.eliminarUsuario = function(usuario) {
				console.log(usuario);
				usuarioservice.eliminaUsuario(usuario).then(function(data) {
					alert("Usuario eliminado correctamente");
					$window.location.reload();
				})
			}

		} ]);

app.controller("modUserController", [
		'$scope',
		'$window',
		'$location',
		'$cookieStore',
		'usuarioservice',
		'sessionService',
		'sucursalService',
		function($scope, $window, $location, $cookieStore, usuarioservice,
				sessionService, sucursalService) {
			sessionService.isAuthenticated();
			if ($cookieStore.get('perfil') == 'Cajero') {
				$location.path("/error");
			}
			$scope.sucursal=[];
			
			
				usuarioservice.getUsuario().then(function(data) {
					$scope.usuariosLista = data;
					console.log("Usuario ", data);
					sucursalService.getAllSucursal().then(function(data) {
						$scope.sucursal = data;
						console.log("Datos de Sucursal ", data);
						
					});
				})
				  $scope.sucFunc = function ciudadFunc(id){
			        for (var i = 0; i < $scope.sucursal.length; i++){
			        if ($scope.sucursal[i].id == id){
			          return $scope.sucursal[i].nombre;
			        } 
			      }
			    }
				$scope.hide=false;
				$scope.showSelect = function(valor){
					$scope.hide=valor;
				}
				$scope.newPsw=function(user){
					
					$("#modalnewPsw").modal();
				}
			$scope.updateUser = function(user){
				var usuario = user;
				console.log(usuario);
				usuarioservice.update(user.usuario, user).then(function(data) {
					alert("Usuario Modificado Correctamente");
					$window.location.reload();
				});
			}
			$scope.validatePass = function() {
				if ($scope.user.password != $scope.user.passconfirm) {
					$scope.IsMatchP = false;
				}else{
					$scope.IsMatchP = true;
				}
			}

		} ]);