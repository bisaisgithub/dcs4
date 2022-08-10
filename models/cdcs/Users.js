const mongoose = require("mongoose");


const UsersCDCSSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      maxlength: [40, "Title cannot be more than 40 characters"],
    },
    name: {
      type: String,
      unique: true,
      required: [true, "Please add a name"],
      maxlength: [40, "Title cannot be more than 40 characters"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    type: String,
    dob: Date,
    allergen: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'UsersCDCS'
    },
    mobile: String,
    gender: String,
    status: String,
  },
  { timestamps: true }
);

let UsersCDCS;

try {
  UsersCDCS = mongoose.model("UsersCDCS");
}catch(err){
  UsersCDCS = mongoose.model('UsersCDCS', UsersCDCSSchema);
}

module.exports =
  // mongoose.models.UsersCDCS || mongoose.model("UsersCDCS", UsersCDCSSchema);
  UsersCDCS;
