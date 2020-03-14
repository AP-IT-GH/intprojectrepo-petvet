const sql = require("./db.js");


// constructor
const PetData = function(petData) {
    this.date = petData.date;
    this.frontRight = petData.frontRight;
    this.frontLeft = petData.frontLeft;
    this.backRight = petData.backRight;
    this.backLeft = petData.backLeft;
    this.temperature = petData.temperature;
    this.petId = petData.petId;
};

PetData.create = (newPetData, result) => {
    sql.query("INSERT INTO petData SET ?", newPetData, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created petData: ", { dataId: res.insertId, ...newPetData });
      result(null, { dataId: res.insertId, ...newPetData });
    });
};

    PetData.findById = (dataId, result) => {
    sql.query(`SELECT * FROM petData WHERE dataId = ${dataId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found petData: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found PetData with the id
      result({ kind: "not_found" }, null);
    });
  };

  PetData.findBypetId = (petId, result) => {
    sql.query("SELECT * FROM petData WHERE petId = ?", petId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found petData: ", res);
        result(null, res);
        return;
      }
  
      // not found PetData with the petId
      result({ kind: "not_found" }, null);
    });
  };

  PetData.getAll = result => {
    sql.query("SELECT * FROM petData", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("petData: ", res);
      result(null, res);
    });
  };

  PetData.updateById = (dataId, petData, result) => {
    sql.query(
      "UPDATE petData SET date = ?, frontRight = ?, frontLeft = ?, backRight = ?, backLeft = ?, temperature = ? WHERE dataId = ?",
      [petData.date, petData.frontRight, petData.frontLeft, petData.backRight, petData.backRight, petData.temperature, dataId],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found PetData with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated petData: ", { dataId: dataId, ...petData });
        result(null, { dataId: dataId, ...petData });
      }
    );
  };

  PetData.remove = (dataId, result) => {
    sql.query("DELETE FROM petData WHERE dataId = ?", dataId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found PetData with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted petData with id: ", dataId);
      result(null, res);
    });
  };

  PetData.removeAll = result => {
    sql.query("DELETE FROM petData", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} petData`);
      result(null, res);
    });
  };

  module.exports = PetData;