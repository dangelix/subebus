package com.tikal.subebus.dao;

import java.util.List;

import com.tikal.subebus.modelo.login.Perfil;



public interface PerfilDAO {
	
	public boolean crearPerfil(Perfil perfil);
	public boolean eliminarPerfil(String perfil);
	public List<Perfil> consultarPerfiles();
	public Perfil consultarPerfil(String perfil);
	public boolean actulizaPerfil(Perfil perfil);
	public Perfil consultarPerfilPorId(long id);
	
}
