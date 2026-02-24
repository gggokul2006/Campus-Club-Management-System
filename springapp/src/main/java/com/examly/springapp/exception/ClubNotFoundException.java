package com.examly.springapp.exception;

public class ClubNotFoundException extends RuntimeException {

    
    public ClubNotFoundException() {
        super("Club not found");
    }

   
    public ClubNotFoundException(String message) {
        super(message);
    }
}
