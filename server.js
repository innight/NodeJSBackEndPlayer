const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
import cors from "cors";
import routes from "./routes/soccerRoutes";

const app = express();

//The urlencoded method within body-parser tells body-parser to extract data
//from the <form> element and add them to the body property in the request object.
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//connect mongoose
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(
  "mongodb+srv://jsemedo:Password01@cluster0-lj9mw.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

//Defining your schema
var Schema = mongoose.Schema;

var quoteSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  quote: String,
});

//Creating a model
var Quote = mongoose.model("Quote", quoteSchema);

app.listen(3000, function () {
  console.log("listening on 3000");
});

//CORS SETUP
app.use(cors());
routes(app);

app.get("/", (req, res) => {
  Quote.find({}, function (err, data) {
    if (err) throw err;
    res.render("index", { quotes: data });
  });
});

app.post("/quotes", (req, res) => {
  var quote = new Quote(req.body);
  quote.save(function (err) {
    if (err) return handleError(err);
    console.log("saved to database");
    res.redirect("/");
  });
});
