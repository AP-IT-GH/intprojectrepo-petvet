module.exports = app => {
    const vet = require("../controllers/vet.controller.js");
  
    // Create a new Vet
    app.post("/vet", vet.create);
  
    // Retrieve all Vets
    app.get("/vet", vet.findAll);
  
    // Retrieve a single Vet with uuid
    app.get("/vet/:uuid", vet.findOne);
  
    // Update a Vet with uuid
    app.put("/vet/:uuid", vet.update);
  
    // Delete a Vet with uuid
    app.delete("/vet/:uuid", vet.delete);
  
    // Create a new Vet
    app.delete("/vet", vet.deleteAll);
  };