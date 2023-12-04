import { useState, useEffect } from "react"; 
import ClientViewList from "../components/ClientViewList";
import { useParams } from 'react-router-dom';
import { getAllServices } from "../api/ServicesAPI";
import { getClientById } from "../api/clientsAPI";
import { socket } from "../socket";

export default function Services_clientview({}) {
    const params = useParams();
    const [client, setClient] = useState({});
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [scanResult, setScanResult] = useState(false);
    const [reloadpageplease, setreloadpageplease] = useState(0);


    const handleOk = () => {
        setScanResult();
        setreloadpageplease(reloadpageplease + 1);
    };

    const handleSearch = async (searchTerm) => {
        setFilteredServices(services.filter((x) =>
        x.name.toLowerCase().includes(searchTerm.toLowerCase())));
    };

    useEffect(() => {
        async function fetchServices() {
            const res = await getAllServices(params.id);
            const client = await getClientById(params.id);
            setClient(client.data);
            setFilteredServices(res.data.services);
            setServices(res.data.services);
        }
        function onConnect() {
            setIsConnected(true);
          }
          function onDisconnect() {
            setIsConnected(false);
          }
          function onScanned(value) {
            setScanResult(() => value);
          }
          socket.on('connect', onConnect);
          socket.on('disconnect', onDisconnect);
          socket.on('toggled active', onScanned);

          fetchServices();

          return () => {
            if (socket.isConnected) {socket.disconnect()};

            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('toggled active', onScanned);
          };
        
    }, [reloadpageplease]);

    services.sort(x => x.active? -1 : 1);
    return <div><ClientViewList
    client={client}
    onOk={handleOk}
    isConnected={ isConnected }
    scanResult={ scanResult }
    data={services}
    filteredServices={filteredServices}
    onSearch={handleSearch}
    /> </div>
};