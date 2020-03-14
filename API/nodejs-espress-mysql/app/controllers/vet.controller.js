const Vet = require("../models/vet.model.js");

// Create and Save a new Vet
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vet
  const vet = new Vet({
    name: req.body.name,
    uuid: req.body.uuid,
    surName: req.body.surName
  });

  // Save Vet in the database
  Vet.create(vet, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Vet."
      });
    else res.send(data);
  });
};

// Retrieve all Vets from the database.
    exports.findAll = (req, res) => {
        Vet.getAll((err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving vet."
            });
          else res.send(data);
        });
    };



// Find a single Vet with a uuid
exports.findOne = (req, res) => {
  Vet.findById(req.params.uuid, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Vet with id ${req.params.uuid}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Vet with id " + req.params.petId
          });
        }
      } else res.send(data);
    });
};

// Update a Vet identified by the uuid in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Vet.updateById(
    req.params.uuid,
    new Vet(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Vet with id ${req.params.uuid}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Vet with id " + req.params.uuid
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Vet with the specified uuid in the request
exports.delete = (req, res) => {
  console.log("delete");
    Vet.remove(req.params.uuid, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Vet with id ${req.params.uuid}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Vet with id " + req.params.uuid
            });
          }
        } else res.send({ message: `Vet was deleted successfully!` });
      });
};

// Delete all Vets from the database.
exports.deleteAll = (req, res) => {
    Vet.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all vet."
          });
        else res.send({ message: `All Vets were deleted successfully!` });
      });
};