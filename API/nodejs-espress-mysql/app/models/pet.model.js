const sql = require("./db.js");


// constructor
const Pet = function(pet) {
    this.uuid = pet.uuid;
    this.name = pet.name;
    this.vet_uuid = pet.vet_uuid;
};

Pet.create = (newPet, result) => {
    sql.query("INSERT INTO pet SET ?", newPet, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created pet: ", { petId: res.insertId, ...newPet });
      result(null, { petId: res.insertId, ...newPet });
    });
};

    Pet.findById = (petId, result) => {
    sql.query(`SELECT * FROM pet WHERE petId = ${petId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found pet: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Pet with the id
      result({ kind: "not_found" }, null);
    });
  };

  Pet.FindAllByOwneruuid = (uuid, result) =>{
    sql.query("SELECT * FROM pet WHERE uuid = ?", uuid, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found pet: ", res);
        result(null, res);
        return;
      }

      // not found Pet with the uuid
      result({ kind: "not_found" }, null);
    })
  }

  Pet.findAllByVetuuid = (uuid, result) =>{
    sql.query("SELECT * FROM pet WHERE vet_uuid = ?", uuid, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found pet: ", res);
        result(null, res);
        return;
      }

      // not found Pet with the vet_uuid
      result({ kind: "not_found" }, null);
    })
  }

  Pet.getAll = result => {
    sql.query("SELECT * FROM pet", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("pet: ", res);
      result(null, res);
    });
  };

  Pet.updateById = (petId, pet, result) => {
    sql.query(
      "UPDATE pet SET name = ?, vet_uuid = ? WHERE petId = ?",
      [pet.name, pet.vet_uuid, petId],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Pet with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated pet: ", { petId: petId, ...pet });
        result(null, { petId: petId, ...pet });
      }
    );
  };

  Pet.remove = (petId, result) => {
    sql.query("DELETE FROM pet WHERE petId = ?", petId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Pet with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted pet with id: ", petId);
      result(null, res);
    });
  };

  Pet.removeAll = result => {
    sql.query("DELETE FROM pet", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} pet`);
      result(null, res);
    });
  };

  module.exports = Pet;