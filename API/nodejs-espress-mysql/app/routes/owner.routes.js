module.exports = app => {
    const owner = require("../controllers/owner.controller.js");
  
    // Create a new Vet
    app.post("/owner", owner.create);
  
    // Retrieve all Vets
    app.get("/owner", owner.findAll);
  
    // Retrieve a single Vet with ownerId
    app.get("/owner/:uuid", owner.findOne);
  
    // Update a Vet with ownerId
    app.put("/owner/:uuid", owner.update);
  
    // Delete a Vet with ownerId
    app.delete("/owner/:uuid", owner.delete);
  
    // Create a new VetS
    app.delete("/owner", owner.deleteAll);
  };