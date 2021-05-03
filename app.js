const express = require('express');
const config = require('config');
const Joi = require('joi');
const app = express();

//CONFIGURACION DE ENTORNOS
console.log('Aplicacion: ' + config.get('nombre'));
console.log('BD Server: ' + config.get('configDB.host'));




app.use(express.json());

const usuarios = [
    { id: 1, nombre: 'Mariana' },
    { id: 2, nombre: 'Briyimar' },
    { id: 3, nombre: 'Victoria' },
    { id: 4, nombre: 'Andersson' },
    { id: 5, nombre: 'Juan' },
    { id: 6, nombre: 'Paul' }

];



app.get('/', (req, res) => {
    res.send('Hola cliente, ya te mandaremos los datos');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()

    });

    const { error, value } = schema.validate({ nombre: req.body.nombre });
    if (!error) {
        const usuario = {
            ok: true,
            id: usuarios.length + 1,
            nombre: value.nombre
        };

        usuarios.push(usuario);
        res.send(usuario);
    } else {
        res.status(400).send(error.message);
    }

});


app.put('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) res.status(400).send('El usuario no fue encontrado');

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const { error, value } = schema.validate({ nombre: req.body.nombre });
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});



app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) res.status(400).send('El usuario no fue encontrado');

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });



    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port} `);
});