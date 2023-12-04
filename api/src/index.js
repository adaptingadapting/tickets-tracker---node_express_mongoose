const express = require('express');
const cors = require('cors');
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const {
    History, Service, Client, DefaultService
} = require("../models/APIModel");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {origin: "*"}});

mongoose.connect("mongodb://127.0.0.1:27017/test")
    .then(() => {console.log("connected to the db")})
    .catch(() => {console.log("hubo un error conectandose a la db")});


app.use(express.json());
app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on("scanner issue", (arr) => {
        console.log("Scanner issue with id:", arr[0]);
        io.emit("toggled active", [arr[0], false, arr[1]]);
    });
  });

app.get("/api/history", (req, res) => {

    History
        .find()
        .then(x => res.send(x))
        .catch(x => res.send(x))
});

app.get("/api/defaultservices", (req, res) => {

    DefaultService
        .find()
        .then((x) => res.send(x))
        .catch(x => res.send(x))

});

app.get("/api/clients", (req, res) => {
    
    Client
        .find()
        .select("-services")
        .then(x => res.send(x))
        .catch((x) => {
            res.send(x);
        });
});

app.post("/api/defaultservices", (req, res) => {
    const ds = new DefaultService({
        name: req.body.name
    });

    ds
        .save()
        .then(x => res.send(x))
        .catch(x => res.status(500).send(x));
});

app.post("/api/clients/:id/services", (req, res) => {

    const service = new Service({
        name: req.body.name,
        Client: req.params.id
    });

    Client
        .findByIdAndUpdate(req.params.id, {
            $push: {
                services: service
            },
            $inc: {
                aproducts: 1,
                tproducts: 1
            }
        })
        .then()
        .catch(x => res.send(x))

    service
        .save()
        .then(x => res.send(x))
        .catch(x => res.status(500).send(x));
});

app.post("/api/clients", (req, res) => {

    const client = new Client({
        name: req.body.name
    });

    client
        .save()
        .then(x => res.send(x))
        .catch(x => res.status(500).send(x));

});

app.get("/api/clients/:id", (req, res) => {

    Client
        .findById(req.params.id)
        .select("-services")
        .then(x => res.send(x))
        .catch(x => res.send(x))
});

app.get("/api/clients/:id/services", (req, res) => {

    Client
        .findById(req.params.id)
        .select("services")
        .populate("services")
        .then(x => res.send(x))
        .catch(x => res.send(x))
});

app.get("/api/services/:pid", (req, res) => {

    Service
        .findById(req.params.pid)
        .select("-services")
        .then(x => res.send(x))
        .catch(x => res.send(x))

});

app.put("/api/defaultservices/:id", (req, res) => {

    DefaultService
        .findByIdAndUpdate(req.params.id, {
            name: req.body.name
        },
        { new: true}
        )
        .then(x => res.send(x))
        .catch(x => res.send(x))      
});

app.put("/api/clients/:id", (req, res) => {
    
    Client
        .findByIdAndUpdate(req.params.id, {
            name: req.body.name
        },
        { new: true}
        )
        .then((x) => res.send(x))
        .catch(x => res.send(x))       
});

app.put("/api/services/:pid", (req, res) => {
        
    Service
        .findByIdAndUpdate(req.params.pid, {
            name: req.body.name
        },
        { new: true}
        )
        .then((x) => res.send(x))
        .catch(x => res.send(x))      
});

app.put("/api/services/:pid/toggleActive",  async (req, res) => {
    
    const service = await Service.findById(req.params.pid);
    
    Service.findByIdAndUpdate(req.params.pid, {
        active : !service.active,
    },
    { new: true} 
    )
    .then(x => {
        Client
            .findByIdAndUpdate(x.Client, {
                 $inc : {
                     aproducts: x.active ? 1 : -1 
                    }
                }
            )
            .then(z => {
                new History({message: `${z.name} ha ${x.active ? "activado" : "usado"} ${x.name}`})
                .save()
                .then()
                .catch(y => { res.send(y) })
                }
            )
            .catch(z =>  { res.send(z) })
        io.emit('toggled active', [x.Client._id, x.name] );
        res.send(x)}
        )
    .catch(x =>  { console.log(x), res.send(x)})
});

app.delete("/api/clients/:id", (req, res) => {

    Client.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).send())
        .catch((x) => res.send(x))

});

app.delete("/api/services/:pid", (req, res) => {

    Service.findByIdAndDelete(req.params.pid)
        .then(x => {
            Client
                .findByIdAndUpdate(x.Client, { $inc : { tproducts: -1, aproducts: x.active ? -1 : 0 }})
                .then()
                .catch(z => res.status(500).send)
            res.status(204).send()
        })
        .catch(x => res.send(x))

});

app.delete("/api/defaultservices/:id", (req, res) => {

    DefaultService.findByIdAndDelete(req.params.id)
        .then(x => res.status(204).send())
        .catch(x => res.send(x))
});

const port = process.env.PORT || 5100;
server.listen(port, () => console.log(`listening on port ${port}`));
