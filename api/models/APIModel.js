const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ClientSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tproducts: {
      type: Number,
      default: 0
    },
    aproducts: {
      type: Number,
      default: 0
    },
     services: [{
      type: mongoose.Schema.ObjectId,
      ref: "Service"
     }]
    });

    const ServiceSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        Client: {
            type: mongoose.Schema.ObjectId,
            ref: "Client"
        }
    });

    const DSSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
    });


const History = mongoose.model("History", HistorySchema);
const Client = mongoose.model("Client", ClientSchema);
const Service = mongoose.model("Service", ServiceSchema);
const DefaultService = mongoose.model("DefaultService", DSSchema);

module.exports = {
    History: History,
    Client: Client,
    Service: Service,
    DefaultService: DefaultService
};