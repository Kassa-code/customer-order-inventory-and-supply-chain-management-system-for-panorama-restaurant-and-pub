package com.panaromarestaurant.controller; 

import java.util.List; 
import org.springframework.web.servlet.ModelAndView; 

// This is a generic interface for common controller operations for generating methods for loadui,alldata,save,update and delete methods easily
// The type <T> makes it flexible to use with any data model (e.g., Ingredient, Employee)
public interface CommonController <T> {

    // This method is meant to return the UI page (like a form)
    public ModelAndView loadUI ();

    // This method should return all data records of type T
    public List<T> findAllData();

    // This method should save a new record of type T
    public String saveData(T t);

    // This method should update an existing record of type T
    public String updateData(T t);

    // This method should delete a record of type T
    public String deleteData(T t);
}
