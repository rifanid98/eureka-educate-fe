import axios from "axios";
import { useState } from "react";

axios.defaults.headers['Content-Type'] ='application/json; charset=utf-8';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

const Category = () => {
  const [items, setitems] = useState([]);
  const [item, setitem] = useState(null);
  const [state, setstate] = useState(false);

  const preCreate = () => {
    setstate("create");
    setitem({
      name: "",
      description: ""
    })
  }

  const getItems = async () => {
    try {
      setstate("get");
      setitem(null);
      const myitems = await axios.get("http://localhost:5000/categories");
      setitems(myitems.data.data);
      console.log(myitems.data.data)
    } catch (error) {
      console.log(error, "<<< getItems()")
    }
  }

  const saveItem = async (e) => {
    try {
      setstate("create");
      e.preventDefault();
      await axios.post("http://localhost:5000/categories", item);
      getItems();
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message.info + ". \nrequired: " + error.response.data.message.required);
      }
      console.log(error, "<<< saveItem()")
    }
  }

  const deleteItem = async () => {
    try {
      setstate("delete");
      await axios.delete("http://localhost:5000/categories/" + item.id);
      getItems();
      setitem(null);
    } catch (error) {
      console.log(error, "<<< deleteItem()")
    }
  }

  const updateItem = async () => {
    try {
      setstate("update");
      const itemId = Number(item.id);
      delete item.created_at;
      delete item.updated_at;
      delete item.id;
      await axios.patch("http://localhost:5000/categories/" + itemId, item);
      getItems();
      setitem(null);
    } catch (error) {
      console.log(error, "<<< deleteItem()")
    }
  }

  const handleChange = (field, value) => {
    setitem({
      ...item,
      [`${field}`]: value
    });
  }
  
  return (
    <>
      <ul>
        {items.length > 0 && items.map(item => {
          return <li 
          key={item.id}
          onClick={() => {setitem(item); setstate("update")}}
          style={{cursor: "pointer"}}>{item.name}</li>
        })}
      </ul>

      {items.length > 0 ? <p>Click item!</p> : null}

      <button onClick={() => preCreate()}>Create</button>
      <button onClick={() => getItems()}>Read</button>
      {item ? (
        <>
          <button onClick={() => updateItem()}>Update</button>
          <button onClick={() => deleteItem()}>Delete</button>
        </>
      ) : null}

      {(item && (
        state === "update" ||
        state === "delete"
      )) ? (
        <form action="">
          <br/>
          <label htmlFor="name">Name : </label> <br/>
          <input type="text" name="name" value={item.name} maxLength={10} required={true} onChange={(e) => handleChange("name", e.target.value)}/> <br/>
          <label htmlFor="description">Description : </label> <br/>
          <input type="text" name="description" value={item.description} required={true} onChange={(e) => handleChange("description", e.target.value)}/> <br/>
        </form>
      ) : null}

      {(state === "create" && item) ? (
        <form action="" onSubmit={(e) => saveItem(e)}>
          <br/>
          <label htmlFor="name">Name : </label> <br/>
          <input type="text" name="name" value={item.name} maxLength={10} required={true} onChange={(e) => handleChange("name", e.target.value)}/> <br/>
          <label htmlFor="description">Description : </label> <br/>
          <input type="text" name="description" value={item.description} required={true} onChange={(e) => handleChange("description", e.target.value)}/> <br/>
          <button 
          // onClick={(e) => saveItem(e)}
          >Save</button>
        </form>
      ) : null}
    </>
  )
}

export default Category;