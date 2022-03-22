const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(bodyParser.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(cors(corsOptions));


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})

/** EXAMPLE */
app.post('/', async (req, res) => {
  res.json({ msg: 'Ok' });
});
/** EXAMPLE */

app.post('/acquire', async (req, res) => {

  if (!req.body.id){
    res.status(400).send('Bad Request');
    return;
  }

  let redisResult = await getTkRedis(req.body.id);

  if (redisResult) {
    res.status(200).send({ msg: 'Já Possui Licença Ativa!' });
    return;
  }

  redisResult = await setTkRedis(req.body.id, 15, true);

  res.json({ msg: 'Adicionado 1 minuto!' });
});


app.post('/renew', async (req, res) => {

  if (!req.body.id){
    res.status(400).send('Bad Request');
    return;
  }

  let redisResult = await getTkRedis(req.body.id);
  
  redisResult = JSON.parse(redisResult);

  if (!redisResult){
    res.status(200).send({ msg: 'Não Possui Sessão!' });
    return;
  }

  if (redisResult.pedidos == 2){
    res.status(200).send({ msg: 'Não é possível renovar a linceça!'});
    return
  }

  redisResult = await setTkRedis(req.body.id, 15, false);

  if (!redisResult){
    res.status(500).send('Internal Server Error');
    return;
  }

  res.json({ msg: 'Renovado por mais 1 minuto!' });
});



app.post('/release', async (req, res) => {

  if (!req.body.id){
    res.status(400).send('Bad Request');
    return;
  }

  let redisResult = await detTkRedis(req.body.id);

  if (redisResult == 1){
    res.status(200).send({ msg: 'Licença liberada!' });
    return;
  } else {
    res.status(200).send({ msg: 'Não possui licença para liberar!' });
    return;
  }
});


app.post('/getAll', async (req, res) => {

  let redisResult = await getAllTkRedis();

  console.log();

  if (redisResult.length === 0){
    res.status(200).send({  });
    return;
  }

  let result;
  let arrayResult = [];

  for (const element of redisResult) {
    result = await getTkRedis(element);
    result = JSON.parse(result);
    
    arrayResult.push({ [element]: result.validade });
  }

  res.status(200).send( arrayResult );
});
























/** SET Redis @param {chave, valor} */
async function setTkRedis(key, validade, novo) {
  const redis = require('redis');
  const util = require("util");
  const moment = require('moment-timezone');

  const client = redis.createClient({
    host: 'redis',
    port: 6379
  });

  const set = util.promisify(client.set).bind(client);

  client.on('error', err => {
    console.log('Error ' + err);
  });
  
  let validoAte = moment().tz('America/Sao_Paulo').add(validade, 'seconds').format('HH:mm:ss');
  
  let value = {'validade' : validoAte, 'pedidos' : 1};
  
  if (!novo){
    value = {'validade' : validoAte, 'pedidos' : 2};
  }

  //chave, valor, expira em, 60 seg
  return set(key, JSON.stringify(value), 'EX', validade)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return null;
    })
    .finally(() => {
      client.quit();
    });
}
/** SET Redis @param {chave, valor} */


/** GET Redis @param {chave} */
async function getTkRedis(key) {
  const redis = require('redis');
  const util = require("util");

  const client = redis.createClient({
    host: 'redis',
    port: 6379
  });

  const get = util.promisify(client.get).bind(client);

  client.on('error', err => {
    console.log('Error ' + err);
  });

  return get(key)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return null;
    })
    .finally(() => {
      client.quit();
    });
}
/** GET Redis @param {chave} */


/** DEL Redis @param {chave} */
async function detTkRedis(key) {
  const redis = require('redis');
  const util = require("util");

  const client = redis.createClient({
    host: 'redis',
    port: 6379
  });

  const del = util.promisify(client.del).bind(client);

  client.on('error', err => {
    console.log('Error ' + err);
  });

  return del(key)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return null;
    })
    .finally(() => {
      client.quit();
    });
}
/** DEL Redis @param {chave} */


/** GET ALL TK Redis */
async function getAllTkRedis() {
  const redis = require('redis');
  const util = require("util");

  const client = redis.createClient({
    host: 'redis',
    port: 6379
  });

  const keys = util.promisify(client.keys).bind(client);

  client.on('error', err => {
    console.log('Error ' + err);
  });

  return keys('*')
    .then((response) => {
      console.log(response)
      return response;
    })
    .catch((err) => {
      return null;
    })
    .finally(() => {
      client.quit();
    });
}
/** GET ALL TK Redis */