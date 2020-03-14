const Owner = require("../models/owner.model.js");

// Create and Save a new Owner
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Owner
  const owner = new Owner({
    name: req.body.name,
    uuid: req.body.uuid,
    surName: req.body.surName,
    age: req.body.age
  });

  // Save Owner in the database
  Owner.create(owner, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Owner."
      });
    else res.send(data);
  });
};

// Retrieve all Owners from the database.
    exports.findAll = (req, res) => {
        Owner.getAll((err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving owner."
            });
          else res.send(data);
        });
    };



// Find a single Owner with a uuid
exports.findOne = (req, res) => {
  Owner.findById(req.params.uuid, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Owner with id ${req.params.uuid}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Owner with id " + req.params.petId
          });
        }
      } else res.send(data);
    });
};

// Update a Owner identified by the uuid in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Owner.updateById(
    req.params.uuid,
    new Owner(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Owner with id ${req.params.uuid}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Owner with id " + req.params.uuid
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Owner with the specified uuid in the request
exports.delete = (req, res) => {
  console.log("delete");
    Owner.remove(req.params.uuid, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Owner with id ${req.params.uuid}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Owner with id " + req.params.uuid
            });
          }
        } else res.send({ message: `Owner was deleted successfully!` });
      });
};

// Delete all Owners from the database.
exports.deleteAll = (req, res) => {
    Owner.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all owner."
          });
        else res.send({ message: `All Owners were deleted successfully!` });
      });
};