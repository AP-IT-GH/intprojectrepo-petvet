const PetData = require("../models/petData.model.js");

// Create and Save a new PetData
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a PetData
  const petData = new PetData({
    date: req.body.date,
    frontRight: req.body.frontRight,
    frontLeft: req.body.frontLeft,
    backRight: req.body.backRight,
    backLeft: req.body.backLeft,
    temperature: req.body.temperature,
    petId: req.body.petId
  });

  // Save PetData in the database
  PetData.create(petData, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the PetData."
      });
    else res.send(data);
  });
};

// Retrieve all PetDatas from the database.
    exports.findAll = (req, res) => {
        PetData.getAll((err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving petData."
            });
          else res.send(data);
        });
    };


// Find a single PetData with a dataId
exports.findOne = (req, res) => {
    PetData.findById(req.params.dataId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found PetData with id ${req.params.dataId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving PetData with id " + req.params.dataId
            });
          }
        } else res.send(data);
      });
};

// Find all PetData with a petId
exports.findByPetId = (req, res) => {
  PetData.findBypetId(req.params.petId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found PetData with petId ${req.params.petId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving PetData with petId " + req.params.petId
          });
        }
      } else res.send(data);
    });
};

// Update a PetData identified by the dataId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  PetData.updateById(
    req.params.dataId,
    new PetData(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found PetData with id ${req.params.dataId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating PetData with id " + req.params.dataId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a PetData with the specified dataId in the request
exports.delete = (req, res) => {
  console.log("delete");
    PetData.remove(req.params.dataId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found PetData with id ${req.params.dataId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete PetData with id " + req.params.dataId
            });
          }
        } else res.send({ message: `PetData was deleted successfully!` });
      });
};

// Delete all PetDatas from the database.
exports.deleteAll = (req, res) => {
    PetData.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all petData."
          });
        else res.send({ message: `All PetDatas were deleted successfully!` });
      });
};