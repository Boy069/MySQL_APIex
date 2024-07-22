const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

//Mysql Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tsu_db",
  port: "3306",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database =", err);
    return;
  }
  console.log("MySQL successfully connecting!!");
});

// CREATE Routes
app.post("/create", async (req, res) => {
  const { name, status, num } = req.body;

  try {
    connection.query(
      "INSERT INTO user_tsu(name, status, num) VALUES(?, ?, ?)",
      [name, status, num],
      (err, results, fields) => {
        if (err) {
          console.log("Error while inserting auser into the database", err);
          return res.status(400).send();
        }
        return res
          .status(200)
          .json({ message: "New user_tsu successfully created!!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// READ
app.get("/read", async (req, res) => {
  try {
    connection.query("SELECT * FROM user_tsu", (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// READ single users from db
app.get("/read/single/:name", async (req, res) => {
  const name = req.params.name;

  try {
    connection.query(
      "SELECT * FROM user_tsu WHERE name = ?",
      [name],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        return res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// UPDATE data
app.patch("/update/:name", async (req, res) => {
  const name = req.params.name;
  const newStatus = req.body.newStatus;

  try {
    connection.query(
      "UPDATE user_tsu SET status = ? WHERE name = ?",
      [newStatus, name],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        return res
          .status(200)
          .json({ message: "User Status update successfully!!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// DELETE date
app.delete("/delete/:name", async (req, res) => {
  const name = req.params.name;

  try {
    connection.query(
      "DELETE FROM user_tsu WHERE name = ?",
      [name],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "No user with name!" });
        }
        return res
          .status(200)
          .json({ message: "User Name delete successfully!!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
