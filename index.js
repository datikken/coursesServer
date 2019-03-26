const express = require('express')
const Joi = require('joi')

const app = express();
app.use(express.json())

const courses = [
    { id: 1, name: 'course-1'},
    { id: 2, name: 'course-2'},
    { id: 3, name: 'course-3'}
];

app.get('/', (req, res) => {
    res.send('Hello world!!!')
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) res.status(404).send('The course doesn"t exists')
    res.send(course)
})


app.post('/api/courses', (req, res) => {
    //Validation
    const {error} = validateCourse(req.body)
    if(error) {
        //Bad request
        res.status(400).send(error.details[0].message)
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course)
    res.send(course)
})


app.put('/api/courses/:id', (req, res) => {
    //Lookup the course
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) res.status(404).send('This course is not found')

    //Validate
    const {error} = validateCourse(req.body)
    if(error) {
        //Bad request
        res.status(400).send(error.details[0].message)
        return;
    }

    course.name = req.body.name
    res.send(course)
})

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema)
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))

    const index = courses.indexOf(course)
    courses.splice(index, 1)
    res.send(courses)

})
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App is listening on ${port}`))