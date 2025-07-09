const express = require('express')
const router = express.Router();
const connection = require('../DB/dbconnection')


router.get('/', async(req,res)=>{
        
   const result = await connection.query(`SELECT * FROM public.staff ORDER BY user_id ASC`);
   res.json({data : result.rows})
})

module.exports = router;