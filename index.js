const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const PORT = 8000;

const app = http.createServer(async (req, res) => {
  const requestMethod = req.method;
  const requestUrl = req.url;

  if (requestUrl === '/api/v1/tasks') {

    const jsonPath = path.resolve('./data.json');
    const jsonFile = await fs.readFile(jsonPath, 'utf-8');
    
    if (requestMethod === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.write(jsonFile);
    }

    if (requestMethod === 'POST') {
      req.on('data', (data) => {
        const newTask = JSON.parse(data);
        const arr = JSON.parse(jsonFile);

        arr.push(newTask);
        const newFile = JSON.stringify(arr);

        fs.writeFile(jsonPath, newFile, 'utf-8');
      })
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(201);
    }

    if (requestMethod === 'PUT') {
      req.on('data', (data) => {
        const parsedData = JSON.parse(data);
        const arr = JSON.parse(jsonFile);
        
        arr.map((item) => {
          if (parsedData.id === item.id) {
            item.status = true
          }
        })

        fs.writeFile(jsonPath, JSON.stringify(arr), 'utf-8');
      })
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
    }

    if (requestMethod === 'DELETE') {
      req.on ('data', (data) => {
        const parsedData = JSON.parse(data);
        const arr = JSON.parse(jsonFile);
        const newArr = arr;

        console.log(newArr)
        arr.map((item) => {
          if (parsedData.id === item.id) {
            newArr.splice(item.id - 1, 1);
          }
        })

        fs.writeFile(jsonPath, JSON.stringify(newArr), 'utf-8');
      })
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(204);
    }
  } else {
    res.writeHead(503);
  }

  res.end();
});

app.listen(PORT);

console.log('Servidor corriendo al 100');