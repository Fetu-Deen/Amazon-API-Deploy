//This is a pure express based backend with no firebase functions
//For deploying backend using firebase we need to upgrade to the next plan, which requires a Credit Card...so this option is better
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total; //query.total implies /payment/create?total, total is the query parameter: Retrieve total from query parameters
  if (total > 0) {
    // Create a payment intent using Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "USD",
    });
    // console.log(paymentIntent);
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    res.status(403).json({
      message:
        "The total payment should be greater than 0, please add some products to your cart",
    });
  }
});

app.listen(5000, (err) => {
  if (err) throw err;
  console.log("Amazon Server Running on PORT: 5000, http://localhost:5000");
});

//Now we completed out API/backend set up with our node/locally...There is no relation with firebase in this case
//N.B If u use ut backend in this way, u can only deploy it through Firebase, since u are using the functions from firebase.