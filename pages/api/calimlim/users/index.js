import bcrypt from "bcrypt";
import UsersCDCS from "../../../../models/cdcs/UsersCDCS";
import dbConnect from "../../../../utils/dbConnect";

export default async function usersHandler (req, res){
  try {
    await dbConnect();
    const token = false;
    if (!token) {
      if (req.method === "GET") {
      
      }else if (req.method === "POST") {
        if (req.body.postType === 'registerUser') {
          const checkNameExist = await UsersCDCS.find({
                name: req.body.data.name, 
              }, {name: 1}
            );
          if (checkNameExist.length > 0) {
            res.json({success: false, message: 'exist_name'})
          } else {
              const hash = bcrypt.hashSync(req.body.data.password, 10);
              req.body.data.password = hash;
              req.body.data.history = [{created_updated_using: 'Portal'}];
              const note = await UsersCDCS.create(req.body.data);
              res.json({ success: true, data: note });
            // }
          }
        } else {
          res.json({message: 'users !token post postType invalid'})
        }
      }
      else {
        res.json({message: 'users !token post method invalid'});
      }
    } else {
      
    }
    
  } catch (error) {
    console.log('error', error)
    res.json({message: 'users catch error'});
  }
};
