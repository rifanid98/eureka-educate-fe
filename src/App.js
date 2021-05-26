import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Category from "./components/category";
import Question from "./components/question";
import SubCategory from "./components/subcategory";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/category">Category</Link>
            </li>
            <li>
              <Link to="/subcategory">SubCategory</Link>
            </li>
            <li>
              <Link to="/question">Question</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/category">
            <Category />
          </Route>
          <Route path="/subcategory">
            <SubCategory />
          </Route>
          <Route path="/question">
            <Question />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
