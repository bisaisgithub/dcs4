import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default async function usersHandler (req, res){

  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      const checkNameExist = await CDCSUsers7.find({
        name: req.body.name, 
        // email: req.body.email
      }, {name: 1}
      )
      // console.log('checkNameExist', checkNameExist.length)
      // res.json({success: true, data: checkUserExist})
      if (checkNameExist.length > 0) {
        res.json({success: false, message: 'exist_name'})
      } else {
        // const checkEmailExist = await CDCSUsers7.find({
        //   email: req.body.email, 
        //   // email: req.body.email
        // }, {name: 1}
        // )
        // // console.log('checkEmailExist', checkEmailExist.length)
        // if (checkEmailExist.length > 0) {
        //   res.json({success: false, message: 'exist_email'})
        // } else {
          // res.json({success: true, message: 'not exist'})
          const hash = bcrypt.hashSync(req.body.password, 10);
          req.body.password = hash;
          const note = await CDCSUsers7.create(req.body);
          res.json({ success: true, data: note });
        // }
      }

      // try {
      //   const hash = bcrypt.hashSync(req.body.password, 10);
      //   req.body.password = hash;
      //   const note = await CDCSUsers7.create(req.body);

      //   res.status(201).json({ success: true, data: note });
      // } catch (error) {
      //   res.json({ success: false, error: `post error: ${error}` });
      // }
      // res.json({ success: false, message: "no-token" });
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (verified.id === 'registration') {
        const checkNameExist = await CDCSUsers7.find({
          name: req.body.name, 
          // email: req.body.email
        }, {name: 1}
        )
        // console.log('checkNameExist', checkNameExist.length)
        // res.json({success: true, data: checkUserExist})
        if (checkNameExist.length > 0) {
          res.json({success: false, message: 'exist_name'})
        } else {
          // const checkEmailExist = await CDCSUsers7.find({
          //   email: req.body.email, 
          //   // email: req.body.email
          // }, {name: 1}
          // )
          // // console.log('checkEmailExist', checkEmailExist.length)
          // if (checkEmailExist.length > 0) {
          //   res.json({success: false, message: 'exist_email'})
          // } else {
            // res.json({success: true, message: 'not exist'})
            const hash = bcrypt.hashSync(req.body.password, 10);
            req.body.password = hash;
            const note = await CDCSUsers7.create(req.body);
            res.json({ success: true, data: note });
          // }
        }
      } else {
        // console.log('token ok')
        
        // console.log("verified.id:", verified);
        const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
        // console.log("obj:", obj);
        if (obj.type === 'Admin' || obj.type === 'Receptionist' || obj.type === '_Patient') {
          const { method } = req;
          if (method === "GET") {
            // console.log('req.method', req.method)
            const items_per_page = req.query.itemsPerPage || 10;
            const page = req.query.page || 1;
            const skip = (page-1) * items_per_page;
            let count;
            switch (obj.type) {
              case "Admin":
                  count = await CDCSUsers7.countDocuments();
                  const userGetAdmin = await CDCSUsers7.find(
                    {},
                    {
                      name: 1,
                      email: 1,
                      type: 1,
                      dob: 1,
                      allergen: 1,
                      created_by: 1,
                      status: 1,
                    }
                  )
                    .skip(skip)
                    .limit(items_per_page)
                    .populate("created_by", "name")
                    .sort({ type: -1, name: 1 });
                  // console.log('user:', user);
                  // const username = await CDCSUsers7.findOne({_id: })
                  res.json({ sucess: true, data: userGetAdmin, pagination:{count, pageCount: count/items_per_page} });
                break;
              case "Receptionist":
                  count = await CDCSUsers7.countDocuments();
                  const user = await CDCSUsers7.find(
                    { 
                      type: { $ne: "Admin" } 
                    },
                    {
                      name: 1,
                      email: 1,
                      type: 1,
                      dob: 1,
                      allergen: 1,
                      created_by: 1,
                      status: 1,
                    }
                  )
                    .skip(skip)
                    .limit(items_per_page)
                    .populate("created_by", "name")
                    .sort({ type: -1, name: 1 });
                  res.json({ sucess: true, data: user, pagination:{count, pageCount: count/items_per_page} });
                break;
              default:
                console.log("user get default not admin or receptionist");
                res.json({ success: false, message: "no permission" });
            }
          } else if (method === "POST") {
            if (req.body.post === 1) { 
              // console.log('req.body.data', req.body.data.name)
              let query = {}
              // console.log('req.body', req.body)
              if (req.body.data.name !== '') {
                query = {...query, 
                  name: new RegExp(`.*${req.body.data.name}.*`,'i')
                }
              }
              if (req.body.data.status !== '') {
                query = {...query,
                  status: req.body.data.status
                      // {$regex: `.*${req.body.data.search.status}.*`, $options: 'i'} ,
                }
              }
              if (req.body.data.type !== '') {
                query = {...query,
                  type: req.body.data.type
                      // {$regex: `.*${req.body.data.search.status}.*`, $options: 'i'} ,
                }
              } 
              // console.log('query', query)
              const items_per_page = req.query.itemsPerPage || 10;
              const page = req.query.page || 1;
              const skip = (page-1) * items_per_page;
              let count;
              // const count = await CDCSSupplier.countDocuments(query);
              // const response = await CDCSSupplier.find(query)
              switch (obj.type) {
                case "Admin":
                    // query = {...query, 
                    //   type: { $ne: "Admin" }
                    // }
                    count = await CDCSUsers7.countDocuments(query);
                    const userAdmin = await CDCSUsers7.find(query,
                      {
                        name: 1,
                        email: 1,
                        type: 1,
                        dob: 1,
                        allergen: 1,
                        created_by: 1,
                        status: 1,
                      }
                    )
                      .skip(skip)
                      .limit(items_per_page)
                      .populate("created_by", "name")
                      .sort({ type: -1, name: 1 });
                    // console.log('user:', user);
                    // const username = await CDCSUsers7.findOne({_id: })
                    res.json({ sucess: true, data: userAdmin, pagination:{count, pageCount: count/items_per_page}  });
                  break;
                case "Receptionist":
                    query = {...query, 
                        type: { $ne: "Admin" }
                    }
                    count = await CDCSUsers7.countDocuments(query);
                    const user = await CDCSUsers7.find(query,
                      {
                        name: 1,
                        email: 1,
                        type: 1,
                        dob: 1,
                        allergen: 1,
                        created_by: 1,
                        status: 1,
                      }
                    )
                    .skip(skip)
                    .limit(items_per_page)
                    .populate("created_by", "name")
                    .sort({ type: -1, name: 1 });
                    res.json({ sucess: true, data: user });
                  break;
                default:
                  console.log("user get default not admin or receptionist");
                  res.json({ success: false, message: "no permission" });
              }
            } else if(req.body.post === 20){
                const users = await CDCSUsers7.find(
                  {
                    $or:[{type: "_Patient"},{type:"Dentist"}]
                  },
                  {
                    name: 1,
                    type: 1,
                  }
                )
                  .sort({ name: 1 });
                // console.log('user:', user);
                // const username = await CDCSUsers7.findOne({_id: })
                res.json({ sucess: true, users });
            }
            else if(req.body.post === 30){
              // console.log('post 30')
              // console.log("post is 30:", req.body);
              const checkNameExist = await CDCSUsers7.find({
                name: req.body.name, 
                // email: req.body.email
              }, {name: 1}
              )
              // console.log('checkNameExist', checkNameExist.length)
              // res.json({success: true, data: checkUserExist})
              if (checkNameExist.length > 0) {
                res.json({success: false, message: 'exist_name'})
              } else {
                const checkEmailExist = await CDCSUsers7.find({
                  email: req.body.email, 
                  // email: req.body.email
                }, {name: 1}
                )
                // console.log('checkEmailExist', checkEmailExist.length)
                if (checkEmailExist.length > 0) {
                  res.json({success: false, message: 'exist_email'})
                } else {
                  // res.json({success: true, message: 'not exist'})
                  const hash = bcrypt.hashSync(req.body.password, 10);
                  req.body.password = hash;
                  const note = await CDCSUsers7.create(req.body);
                  res.json({ success: true, data: note });
                }
              }
              // } else {
              //   res.json({ success: false, message: 'u crte nt a/r' });
              // }
                
            }else{
              res.json({ success: false, message: "post_x" });
            }
          } else {
            res.json({ success: false, message: "mthd_x" });
            // res.end();
          }
        } else {
          res.json({ success: false, message: 'obj t nt a/r '+ obj.type })
          // res.json({ success: false, message: 'obj t nt a/r' })
        }
      }
    }
  } catch (error) {
    console.log("catch users index:", error);
    res.json({success: false, message: 'check admin console'})
    // res.end();
    // removeCookies("cdcsjwt", { req, res });
    // return { redirect: { destination: "/cdcs/login" } };
  }
};
