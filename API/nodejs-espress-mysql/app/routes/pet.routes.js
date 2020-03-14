module.exports = app => {
    const pet = require("../controllers/pet.controller.js");
  
    // Create a new Pet
    app.post("/pet", pet.create);
  
    // Retrieve all Pets
    app.get("/pet", pet.findAll);
  
    // Retrieve a single Pet with petId
    app.get("/pet/:petId", pet.findOne);

    //Retrieve all Pets from owner
    app.get("/pet/owner/:uuid", pet.findAllFromOwner);

    //Retrieve all Pets from vet
    app.get("/pet/vet/:uuid", pet.findAllFromVet);
  
    // Update a Pet with petId
    app.put("/pet/:petId", pet.update);
  
    // Delete a Pet with petId
    app.delete("/pet/:petId", pet.delete);
  
    // Create a new Pet
    app.delete("/pet", pet.deleteAll);
  };