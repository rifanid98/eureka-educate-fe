import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.headers['Content-Type'] ='application/json; charset=utf-8';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

const Question = () => {
  const [items, setitems] = useState([]);
  const [item, setitem] = useState(null);
  const [state, setstate] = useState(false);
  const [questiontype, setquestiontype] = useState("pg");
  const [categories, setcategories] = useState(null);
  const [subcategories, setsubcategories] = useState(null);

  useEffect(() => {
    console.log(categories, "<<< CATEGORIES");
  })

  const preparedData = async () => {
    try {
      const myCategories = await axios.get("http://localhost:5000/categories");
      const mySubCategories = await axios.get("http://localhost:5000/subcategories");
      setcategories(myCategories.data.data)
      setsubcategories(mySubCategories.data.data)
    } catch (error) {
      console.log(error, "<<< preparedData()")
    }
  }

  const preCreate = async () => {
    await preparedData();
    setstate("create");
    setitem({
      question: "",
      answer_a: "",
      answer_b: "",
      answer_c: "",
      answer_d: "",
      correct_answer_pg: "a",
      correct_answer_essay: "",
      category_id: 0,
      sub_category_id: 0,
    })
  }

  const getItems = async () => {
    try {
      setstate("get");
      setitem(null);
      const myitems = await axios.get("http://localhost:5000/questions");
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
      await axios.post("http://localhost:5000/questions", item);
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
      await axios.delete("http://localhost:5000/questions/" + item.id);
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
      let tempItem = {...item};

      if (item.correct_answer_pg) {
        delete tempItem.id;
        delete tempItem.created_at;
        delete tempItem.updated_at;
        delete tempItem.correct_answer_essay;
        tempItem.correct_answer_pg = tempItem.correct_answer_pg.toLowerCase();
      } else {
        delete tempItem.id;
        delete tempItem.answer_a;
        delete tempItem.answer_b;
        delete tempItem.answer_c;
        delete tempItem.answer_d;
        delete tempItem.created_at;
        delete tempItem.updated_at;
        delete tempItem.correct_answer_pg;
      }

      if (!item.image) {
        delete tempItem.image;
      }

      await axios.patch("http://localhost:5000/questions/" + itemId, tempItem);
      getItems();
      setitem(null);
    } catch (error) {
      console.log(error, "<<< updateItem()")
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
          style={{cursor: "pointer"}}>{item.question}</li>
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
        item.correct_answer_pg ? (
          <form action="">
            <br/>
            <label htmlFor="question">Question : </label> <br/>
            <input type="text" name="question" value={item.question} maxLength={10} required={true} onChange={(e) => handleChange("question", e.target.value)}/> <br/>
            <label htmlFor="answer_a">Answer A : </label> <br/>
            <input type="text" name="answer_a" value={item.answer_a} maxLength={10} required={true} onChange={(e) => handleChange("answer_a", e.target.value)}/> <br/>
            <label htmlFor="answer_b">Answer B : </label> <br/>
            <input type="text" name="answer_b" value={item.answer_b} maxLength={10} required={true} onChange={(e) => handleChange("answer_b", e.target.value)}/> <br/>
            <label htmlFor="answer_c">Answer C : </label> <br/>
            <input type="text" name="answer_c" value={item.answer_c} maxLength={10} required={true} onChange={(e) => handleChange("answer_c", e.target.value)}/> <br/>
            <label htmlFor="answer_d">Answer D : </label> <br/>
            <input type="text" name="answer_d" value={item.answer_d} maxLength={10} required={true} onChange={(e) => handleChange("answer_d", e.target.value)}/> <br/>
            <label htmlFor="correct_answer_pg">Correct Answer : </label> <br/>
            <select name="correct_answer_pg" id="" value={item.correct_answer_pg} onChange={(e) => handleChange("correct_answer_pg", e.target.value)}>
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </form>
        ) : (
          <form action="">
            <br/>
            <label htmlFor="question">Question : </label> <br/>
            <input type="text" name="question" value={item.question} maxLength={10} required={true} onChange={(e) => handleChange("question", e.target.value)}/> <br/>
            <label htmlFor="answer">Answer : </label> <br/>
            <input type="text" name="answer" value={item.correct_answer_essay} required={true} onChange={(e) => handleChange("correct_answer_essay", e.target.value)}/> <br/>
          </form>
        )
      ) : null}

      {(state === "create" && item) ? (
        <form action="" onSubmit={(e) => saveItem(e)}>
          <br/>
          <label htmlFor="question">Question Type: </label> <br/>
          <select name="correct_answer_pg" id="" value={questiontype} onChange={(e) => setquestiontype(e.target.value)}>
            <option value="pg">PG</option>
            <option value="essay">ESSAY</option>
          </select> <br/>
          <label htmlFor="question">Category: </label> <br/>
          {(categories && categories.length > 0) ? categories.forEach(category => {
                return <p>{category.name}</p>
          }) : null}
          <select name="correct_answer_pg" id="" value={questiontype} onChange={(e) => setquestiontype(e.target.value)}>
            {(categories && categories.length > 0) ? categories.forEach(category => {
                return <option key={category.id} value={category.id}>{category.name}</option>  
            }) : null}
          </select> <br/>
          <label htmlFor="question">Sub Category: </label> <br/>
          <select name="correct_answer_pg" id="" value={questiontype} onChange={(e) => setquestiontype(e.target.value)}>
            <option value="pg">PG</option>
            <option value="essay">ESSAY</option>
          </select> <br/> <br/>
          <label htmlFor="question">Question : </label> <br/>
          <input type="text" name="question" value={item.question} maxLength={10} required={true} onChange={(e) => handleChange("question", e.target.value)}/> <br/>
          {questiontype && questiontype === "pg" ? (
            <>
              <label htmlFor="answer_a">Answer A : </label> <br/>
              <input type="text" name="answer_a" value={item.answer_a} maxLength={10} required={true} onChange={(e) => handleChange("answer_a", e.target.value)}/> <br/>
              <label htmlFor="answer_b">Answer B : </label> <br/>
              <input type="text" name="answer_b" value={item.answer_b} maxLength={10} required={true} onChange={(e) => handleChange("answer_b", e.target.value)}/> <br/>
              <label htmlFor="answer_c">Answer C : </label> <br/>
              <input type="text" name="answer_c" value={item.answer_c} maxLength={10} required={true} onChange={(e) => handleChange("answer_c", e.target.value)}/> <br/>
              <label htmlFor="answer_d">Answer D : </label> <br/>
              <input type="text" name="answer_d" value={item.answer_d} maxLength={10} required={true} onChange={(e) => handleChange("answer_d", e.target.value)}/> <br/>
              <label htmlFor="correct_answer_pg">Correct Answer : </label> <br/>
              <select name="correct_answer_pg" id="" value={item.correct_answer_pg} onChange={(e) => handleChange("correct_answer_pg", e.target.value)}>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </>
          ) : (
            <>
              <label htmlFor="answer">Answer : </label> <br/>
              <input type="text" name="answer" value={item.correct_answer_essay} maxLength={10} required={true} onChange={(e) => handleChange("correct_answer_essay", e.target.value)}/> <br/>
            </>
          )}
          <button>Save</button>
        </form>
      ) : null}
    </>
  )
}

export default Question;