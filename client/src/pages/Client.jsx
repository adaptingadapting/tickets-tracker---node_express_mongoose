import { useState, useEffect } from "react";
import ClientList from "../components/ClientList";
import { getAllClients, createClient, updateClient, deleteClient } from "../api/clientsAPI";
import { getAllDServices, createDService, updateDService, deleteDService } from "../api/defaultServicesAPI";
import { getServiceById, toggleActive } from "../api/ServicesAPI";
import { getHistory } from "../api/historyAPI";
import { socket } from "../socket";


export default function Client({}) {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [defaultServices, setDefaultServices] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [history, setHistory] = useState([]);


    useEffect(() => {
        async function fetchClients() {
            const res = await getAllClients();
            setClients(res.data);
            setFilteredClients(res.data);
            const ds = await getAllDServices();
            setDefaultServices(ds.data);
            const hs = await getHistory();
            setHistory(hs.data.reverse());
        }
        fetchClients();
    }, []);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
          }
          function onDisconnect() {
            setIsConnected(false);
          }
          socket.on('connect', onConnect);
          socket.on('disconnect', onDisconnect);

          return () => {
            if (socket.isConnected) {socket.disconnect()};

            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
          };
    },[]);

    const handleSuccesfulScan = async (result) => {
        const res = JSON.parse(result);
        try {
        const servicedata = await getServiceById(res.clientid, res["service"].id);
        const service = servicedata.data;
        if (!service)
        {
            throw("El cliente o el servicio no existen")
        }
        if (!service.active)
        {
            setTimeout(1);
            socket.emit("scanner issue", [res.clientid, service.id]);
            throw("Servicio no activo");
        }
        else {
        // mientras espero confirmacion lo apago para evitar abuso
        await toggleActive(res.clientid, res["service"].id);
        return(`${res.name} ha consumido ${service.name}`);
        }
        }
        catch(err) { 
            throw("Ha ocurrido un error en la operación"); }
      };


    const handleDSCreate = async (service) => {
        const res = await createDService(service);
        setDefaultServices([...defaultServices, res.data]);
    };

    const handleDSUpdate = async (service) => {
        const res = await updateDService(service._id, service);
        const updatedDS = defaultServices.map(x => x._id == service._id ? res.data : x);
        setDefaultServices(updatedDS);
    };

    const handleDSDelete = async (id) => {
        await deleteDService(id);
        const updatedDS = defaultServices.filter(x => x._id != id);
        setDefaultServices(updatedDS);
    };

    const handleCreate = async (client, searchTerm) => {
        const res = await createClient(client);
        setClients([...clients, res.data]);
        if (res.data.name.toLowerCase().includes(searchTerm.toLowerCase()))
            setFilteredClients([...filteredClients, res.data]);
    };

    const handleUpdate = async (item) => {
        const res = await updateClient(item.id, item);
        const updatedData = clients.map(client => client._id === item.id ? res.data : client);
        const updatedDataf = filteredClients.map(client => client._id === item.id ? res.data : client);
        setFilteredClients(updatedDataf);
        setClients(updatedData);
    };

    const handleDelete = async (id) => {
        await deleteClient(id);
        const updatedClientList = clients.filter(client => client._id != id);
        const updatedFClientList = filteredClients.filter(client => client._id != id);
        setClients(updatedClientList);
        setFilteredClients(updatedFClientList);
    };

    const handleSearch = async (searchTerm) => {
        setFilteredClients(clients.filter((x) =>
        x.name.toLowerCase().includes(searchTerm.toLowerCase())));
    };

    return (
      <div>
        <ClientList
        name="Cliente"
        data={clients}
        history={history}
        defaultServices={defaultServices}
        filteredClients={filteredClients}
        onDefaultServiceUpdate={handleDSUpdate}
        onDefaultServiceDelete={handleDSDelete}
        onDefaultServiceCreate={handleDSCreate}
        onSuccesfulScan={handleSuccesfulScan}
        onCreate={handleCreate}
        onSearch={handleSearch}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        />
      </div>  
    );
}; 

