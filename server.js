require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const path = require("path");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// (async () => {
// 	const response = await openai.createCompletion({
// 	  model: "text-davinci-003",
// 	  prompt: "Create an outline for an essay about Nikola Tesla and his contributions to technology:",
// 	  temperature: 0.9,
// 	  max_tokens: 150,
// 	  top_p: 1,
// 	  frequency_penalty: 0.0,
// 	  presence_penalty: 0.6,
// 	  stop:["Human:"," AI:"]
// 	});
	
// 	console.log(response.data)
// })();

io.on('connection', (socket) => {
	socket.on('request_input', async (question) => {

		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: question,
			temperature: 0.9,
			max_tokens: 150,
			top_p: 1,
			frequency_penalty: 0.0,
			presence_penalty: 0.6,
			stop:["Human:"," AI:"]
		  });
		  
		   console.log(response.data)
		   io.emit('response_output', { answer: response.data.choices[0].text, question: question});

	});
  });


app.use('/',function(req, res, next){
res.render('index')
})

server.listen(port, function(){
	console.log('APP RUNING ON ', port)
})