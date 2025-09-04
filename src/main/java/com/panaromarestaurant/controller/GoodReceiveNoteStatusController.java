package com.panaromarestaurant.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;

import com.panaromarestaurant.model.GoodReceiveNoteStatus;
import com.panaromarestaurant.repository.GoodReceiveNoteStatusDao;

import java.util.List;

// REST controller to handle HTTP requests for GRN statuses
@RestController
public class GoodReceiveNoteStatusController {

    // Inject the GoodReceiveNoteStatusDao
    @Autowired
    private GoodReceiveNoteStatusDao goodReceiveNoteStatusDao;

    // Endpoint to retrieve all GRN status data
    // Example URL: /goodreceivenotestatus/alldata
    @GetMapping(value = "/goodreceivenotestatus/alldata", produces = "application/json")
    public List<GoodReceiveNoteStatus> findAllData() {
        return goodReceiveNoteStatusDao.findAll(); // Return all GRN statuses as JSON
    }
}
