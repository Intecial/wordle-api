const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express()


const words = []

const pages = [
    {
        address: "https://www.thefreedictionary.com/5-letter-words.htm"
    },
    {
        address: "https://www.thefreedictionary.com/5-letter-words-2.htm"
    }
]

app.use( express.json())

pages.forEach((page) => {
    axios.get(page.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('li', html).each( function() {
                const word = $(this).text().toLowerCase()

                if(word.length === 5){
                    words.push({
                        word,
                    })
                }
            })
        })
})

app.get('/all-word', (req, res) => {
    res.status(200).send(res.json(words))
})

app.get('/word', (req, res) => {
    const index = Math.floor(Math.random() * words.length);

    res.status(200).send(res.json(words[index]))
})

app.post('/exist', (req, res) =>{
    const { guess } = req.body;
    let results = { exist: false }
    for(let i = 0; i < words.length; i++){
        if(words[i].word === guess){
            results.exist = true
        }
    }
    res.status(200).send(res.json(results))
})

app.post('/solve', (req, res) => {
    const { guess } = req.body;
    const { key } = req.body;

    let results = []
    

    for(let i = 0; i < 5; i++){
        if(guess[i] === key[i]){
            obj = {
                index: i,
                letter: guess[i],
                color: "green"
            }
            
        }
        else if (key.includes(guess[i])){
            obj = {
                index: i,
                letter: guess[i],
                color: "yellow"
            }
        }
        else {
            obj = {
                index: i,
                letter: guess[i],
                color: "gray"
            }
        }
        results.push(obj)
    }
    res.status(200).send(res.json(results))

})

app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`))