const mongoose = require("mongoose");

const EmailCodeCDCSSchema = new mongoose.Schema(
  {
    email: String,
    code: String,
    generated_times: Number
  },
  { timestamps: true }
);

let EmailCodeCDCS;

try {
  EmailCodeCDCS = mongoose.model("EmailCodeCDCS");
}catch(err){
  EmailCodeCDCS = mongoose.model('EmailCodeCDCS', EmailCodeCDCSSchema);
}

module.exports =
  // mongoose.models.EmailCodeCDCS || mongoose.model("EmailCodeCDCS", EmailCodeCDCSSchema);
  EmailCodeCDCS;