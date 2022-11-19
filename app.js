

let express = require('express');
let app = express();
/// for reading value form .env 
let dotenv = require('dotenv');
dotenv.config()
// for logging purposes
let morgan = require('morgan');
let fs = require('fs');
let port = process.env.PORT || 9800;
let cors = require('cors');
let mongo = require('mongodb');
let bodyparser= require('body-parser')
let MongoClient = mongo.MongoClient;
let mongoUrl = "mongodb+srv://aniket:aniket2505@cluster0.q8dlbjn.mongodb.net/flipkart?retryWrites=true&w=majority";
let db;



// middleware
app.use(morgan('short',{stream:fs.createWriteStream('./app.logs')}))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cors());

app.get('/',(req,res) => {
    res.send('This is From Express App code')
})





app.get("/ALLdata",(req,res)=>{
    let query ={};
    let Id = Number(req.query.Id);
    let TypeId = Number(req.query.TypeId);
    let categoryId = Number(req.query.categoryId);
    let lprice= Number(req.query.lprice);
    let hprice = Number(req.query.hprice);
    let ratingId = Number(req.query.ratingId);
    let starrating= Number(req.query.starrating);
    if(categoryId){
        query={
            "category_id":categoryId,
            $and:[{price:{$gt:lprice,$lt:hprice}}],
        }
    } else if(ratingId){
        query={
            $and:[{category_id:ratingId},{rating:starrating}]
        }
     }else if(Id){
        query={ "id":Id  }
     }else if(TypeId){
        query={ "category_id":TypeId  }
     }
    db.collection('Alldata').find(query).toArray((err,result)=>{
     if(err) throw err;
     res.send(result)
    })
 });
// app.get("/fashion",(req,res)=>{
//     let query ={};
//     let Id = Number(req.query.Id);
//     let categoryId = Number(req.query.categoryId);
//     let ratingId = Number(req.query.ratingId);
//     let lrating= Number(req.query.lrating);
//     let hrating = Number(req.query.hrating);
//     let lprice= Number(req.query.lprice);
//     let hprice = Number(req.query.hprice);
//     if(categoryId){
//         query={
//             "category_id":categoryId,
//             $and:[{price:{$gt:lprice,$lt:hprice}}]
//         }
//     }else if(ratingId){
//         query={
//             "category_id":ratingId,
//             $and:[{rating:{$gt:lrating,$lt:hrating}}]
//         }
//      }else if(Id){
//         query={ "id":Id  }
//      }
//     db.collection('fashion').find(query).toArray((err,result)=>{
//      if(err) throw err;
//      res.send(result)
//     })
//  });
// app.get("/Electronic",(req,res)=>{
//     let query ={};
//     let Id = Number(req.query.Id);
//     let categoryId = Number(req.query.categoryId);
//     let ratingId = Number(req.query.ratingId);
//     let lrating= Number(req.query.lrating);
//     let hrating = Number(req.query.hrating);
//     let lprice= Number(req.query.lprice);
//     let hprice = Number(req.query.hprice);
//     if(categoryId){
//         query={
//             "category_id":categoryId,
//             $and:[{price:{$gt:lprice,$lt:hprice}}]
//         }
//     }else if(ratingId){
//         query={
//             "category_id":ratingId,
//             $and:[{rating:{$gt:lrating,$lt:hrating}}]
//         }
//      }else if(Id){
//         query={ "id":Id  }
//      }
//     db.collection('Electronic').find(query).toArray((err,result)=>{
//      if(err) throw err;
//      res.send(result)
//     })
//  });
// app.get("/beauty",(req,res)=>{
//     let query ={};
//     let Id = Number(req.query.Id);
//     let categoryId = Number(req.query.categoryId);
//     let ratingId = Number(req.query.ratingId);
//     let lrating= Number(req.query.lrating);
//     let hrating = Number(req.query.hrating);
//     let lprice= Number(req.query.lprice);
//     let hprice = Number(req.query.hprice);
//     if(categoryId){
//         query={
//             "category_id":categoryId,
//             $and:[{price:{$gt:lprice,$lt:hprice}}]
//         }
//     }else if(ratingId){
//         query={
//             "category_id":ratingId,
//             $and:[{rating:{$gt:lrating,$lt:hrating}}]
//         }
//      }else if(Id){
//         query={ "id":Id  }
//      }
//     db.collection('beauty').find(query).toArray((err,result)=>{
//      if(err) throw err;
//      res.send(result)
//     })
//  });
    
  app.post('/placeorder',(req,res) =>{
        console.log(req.body);
        db.collection('order').insertMany(req.body,(err,result)=>{
            if(err) throw err;
            res.send('order placed')
        })
        res.send('ok')
  })
 
  app.get('/order',(req,res) => {
    let email = req.query.email
    let query = {};
    if(email){
    // query=[email:email}
    query={email}
    }
    db.collection('order').find(query).toArray((err,result) =>{
    if(err) throw err;
    res.send(result)
    })
})
app.put('/updateorder/:id',(req,res)=>{
    let oid = Number(req.params.id);
    db.collection('order').updateMany(
        {orderId:oid},
        {
            $set:{
                "status":req.body.status,
                "bank_name":req.body.bank_name,
                "date":req.body.date
            }
        },(err,result)=>{
            if(err) throw err,
            res.send('order updated')
        }
    )
})

app.delete('/deleteorder/:id',(req,res)=>{
    let _id=mongo.ObjectId(req.param.id);
    db.collection('order').deleteOne({_id:"id"},(err,result)=>{
        if(err) throw err;
        res.send('order delete')
    })
})
//connection with mongo
MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log(`Error while connecting`);
     db= client.db('flipkart')
    app.listen(port,() => {
        console.log(`Listing to port ${port}`)
})
})



// app.get("/mobile",(req,res)=>{
//     let query ={};
//     let ratingId = Number(req.query.categoryId);
//     let lrating= Number(req.query.lrating);
//     let hrating = Number(req.query.hrating);
//    if(ratingId){
//         query={
//             "category_id":ratingId,
//             $and:[{rating:{$gt:lrating,$lt:hrating}}]
//         }
//      }
//     db.collection('mobile').find(query).toArray((err,result)=>{
//      if(err) throw err;
//      res.send(result)
//     })
//  });