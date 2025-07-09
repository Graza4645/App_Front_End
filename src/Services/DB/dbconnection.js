
const {Pool} = require('pg')

const connection = new Pool(
    {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'kolkata260@G',
  database: 'places',
    }
)

connection.connect()
.then(()=>{console.log('Data Base Connected ......')})
.catch((err)=>{console.error('Filed to connect with Date Base : ', err)})

module.exports = connection;
