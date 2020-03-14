const sql = require("./db.js");


// constructor
const Vet = function(vet) {
    this.name = vet.name;
    this.surName = vet.surName;
    this.uuid = vet.uuid;
};

Vet.create = (newVet, result) => {
    sql.query("INSERT INTO vet SET ?", newVet, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created vet: ", { uuid: res.insertId, ...newVet });
      result(null, { uuid: res.insertId, ...newVet });
    });
};

    Vet.findById = (uuid, result) => {
    sql.query("SELECT * FROM vet WHERE uuid = ?", uuid, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found vet: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Vet with the id
      result({ kind: "not_found" }, null);
    });
  };

  Vet.getAll = result => {
    sql.query("SELECT * FROM vet", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("vet: ", res);
      result(null, res);
    });
  };

  Vet.updateById = (uuid, vet, result) => {
    sql.query(
      "UPDATE vet SET name = ?, surName = ? WHERE uuid = ?",
      [vet.name, vet.surName, uuid],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Vet with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated vet: ", { uuid: uuid, ...vet });
        result(null, { uuid: uuid, ...vet });
      }
    );
  };

  Vet.remove = (uuid, result) => {
    sql.query("DELETE FROM vet WHERE uuid = ?", uuid, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Vet with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted vet with id: ", uuid);
      result(null, res);
    });
  };

  Vet.removeAll = result => {
    sql.query("DELETE FROM vet", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} vet`);
      result(null, res);
    });
  };

  module.exports = Vet;