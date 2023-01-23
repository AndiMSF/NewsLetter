const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
const { json } = require('body-parser')

const app = express()

// static folder

app.use(express.static('public'))
// untuk mengambil data dari inputan user
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/signup.html')
})

app.post('/',function(req,res){
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    // data yang akan dikirimkan ke API Mailchimp

    const data = {
        members : [ 
            {
                email_address : email,
                status : 'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    // data nya sudah di paketin
    const jsonData = JSON.stringify(data)

    const url = 'https://us10.api.mailchimp.com/3.0/lists/07a6ab56ea'

    const options = {
        method: 'POST',
        auth:'andi_m_s_fadhil:b90b616cf6311af32b85fddab8a4fb47-us10'
    }

    const request = https.request(url,options,function(response){

        if(response.statusCode === 200)
        {
            res.sendFile(__dirname+'/success.html')
        } else
        {
            res.sendFile(__dirname+'/failure.html')
        }


        response.on('data', function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()



})

app.post('/failure',function(req,res){
    res.redirect('/')
})

app.listen(process.env.PORT || 3000,function(){
    console.log('Server berjalan di port 3000')
})


// API Key
// b90b616cf6311af32b85fddab8a4fb47-us10

// List Id
// 07a6ab56ea