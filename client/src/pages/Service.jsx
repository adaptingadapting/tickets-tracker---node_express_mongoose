import { useState, useEffect } from "react";
import ServiceList from "../components/ServiceList";
import { useParams } from 'react-router-dom';
import { getAllServices, createService, updateService, deleteService, toggleActive } from "../api/ServicesAPI";
import { getAllDServices } from "../api/defaultServicesAPI";
import { getClientById } from "../api/clientsAPI";

export default function Service() {
    const params = useParams();
    const [client, setClient] = useState({});
    const [services, setServices] = useState([]);
    const [defaultServices, setDefaultServices] = useState([]);
    const [selectedList, setSelectedList] = useState(new Map());
    const [updated, setUpdated] = useState(0);

    useEffect(() => {
        async function fetchServices() {
            const res = await getAllServices(params.id);
            const client = await getClientById(params.id);
            const ds = await getAllDServices();
            setDefaultServices(ds.data);
            setClient(client.data);
            setServices(res.data.services);
        }
        fetchServices();
    }, [updated]);

    const handleAddToDsList = (item) => {
        setSelectedList( map => new Map(map.set(item._id, !map.get(item._id) ? [item] : [...map.get(item._id), item] )));
      };

  const handleRemoveFromList = (item) => {
    const updatedlist = selectedList.map(x => x ? x[0]._id == item._id ? "" : x : "");
    setSelectedList(updatedlist);
  }

    const handleCreate = async (userid, service) => {
        const res = await createService(userid, service);
        setServices([...services, res.data]);
    };

    
    const handleBulksCreate = (userid) => {
        const serviceslist = [];
        for (const z of defaultServices){
           if (selectedList.get(z._id)) {
             for (const x of selectedList.get(z._id)) {
              const res = createService(userid, x);
              serviceslist.push(res.data);
            }
          }
        }
        setSelectedList(new Map());
        return serviceslist;
      }

      const handleBulkCreate = (userid) => {
        const res = handleBulksCreate(userid);
        setServices([...services, res])
        setUpdated(updated + 1);
      }

    const handleUpdate = async (serviceid, item) => {
        const res = await updateService(serviceid, item);
        const updatedData = services.map(service => service._id === serviceid ? res.data : service);
        setServices(updatedData);
    };

    const handleDelete = async (serviceid) => {
        await deleteService(serviceid);
        const updatedServiceList = services.filter(service => service._id != serviceid);
        setServices(updatedServiceList);
    };

    const handleToggle = async (serviceid) => {
        const updatedItem = await toggleActive(serviceid);
        const updatedData = services.map(service => service._id === serviceid ? updatedItem.data : service);
        setServices(updatedData);

    };

    return (
      <div>
        <ServiceList
        name={client.name}
        data={services}
        selectedList={selectedList}
        defaultServices={defaultServices}
        onCreate={handleCreate}
        onDsAdd={handleAddToDsList}
        onDsDelete={handleRemoveFromList}
        onBulkCreate={handleBulkCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onActiveToggle={handleToggle}
        />
      </div>  
    );
}; 

