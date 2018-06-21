package com.tikal.mensajeria.dao;

import java.util.List;

import com.tikal.mensajeria.modelo.entity.Envio;

public interface EnvioDao {
	
	public void save(Envio e);

	public void delete(Envio e);

	public void update(Envio e);
	
	public Envio consult(Long id);
	
	//public static AeronaveEntity consult(String numeroSerie);
	
    
	public List<Envio> findAll();	

}
