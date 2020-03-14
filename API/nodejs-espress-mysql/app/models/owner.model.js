const sql = require("./db.js");


// constructor
const Owner = function(owner) {
    this.name = owner.name;
    this.age = owner.age;
    this.surName = owner.surName;
    this.uuid = owner.uuid;
};

Owner.create = (newOwner, result) => {
    sql.query("INSERT INTO owner SET ?", newOwner, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created owner: ", { uuid: res.insertId, ...newOwner });
      result(null, { uuid: res.insertId, ...newOwner });
    });
};

    Owner.findById = (uuid, result) => {
    sql.query("SELECT * FROM owner WHERE uuid = ?", uuid, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found owner: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Owner with the id
      result({ kind: "not_found" }, null);
    });
  };

  Owner.getAll = result => {
    sql.query("SELECT * FROM owner", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("owner: ", res);
      result(null, res);
    });
  };

  Owner.updateById = (uuid, owner, result) => {
    sql.query(
      "UPDATE owner SET name = ?, surName = ?, age = ? WHERE uuid = ?",
      [owner.name, owner.surName, owner.age, uuid],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Owner with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated owner: ", { uuid: uuid, ...owner });
        result(null, { uuid: uuid, ...owner });
      }
    );
  };

  Owner.remove = (uuid, result) => {
    sql.query("DELETE FROM owner WHERE uuid = ?", uuid, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Owner with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted owner with id: ", uuid);
      result(null, res);
    });
  };

  Owner.removeAll = result => {
    sql.query("DELETE FROM owner", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} owner`);
      result(null, res);
    });
  };

  module.exports = Owner;