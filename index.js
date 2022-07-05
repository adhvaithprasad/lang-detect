
const cors = require('cors')
function detect(abs_path){
    const langDetector = require('language-detect')
  const map = require('language-map')

 if (map[langDetector.filename(abs_path)] === undefined){
   return "plaintext"
 }
  else{
  return map[langDetector.filename(abs_path)].aceMode  
  }
  
  
}

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(cors());


var admin = require("firebase-admin");
var serviceAccount = require("./krios.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://krios-studio-default-rtdb.firebaseio.com/"
});
var db = admin.database();
var ref = db.ref("jira");
ref.on('value', (snapshot) => {
  const data = snapshot.val();

});
var ref1 = db.ref("file-detect");
ref1.on('child_added', (snapshot) => {
  const data = snapshot.val();
  ref1.child(snapshot.key).set({
    "file": data,
    "lang": detect(__dirname + '/'+data.file),
  })
});


app.use(bodyParser.urlencoded({ extended: true })); 

// A RESTFul GET API
app.get("/", (req, res) => {
 
  res.send("lang-detect-server");
  
});







// Starting up the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});