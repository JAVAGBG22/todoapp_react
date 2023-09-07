import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./App.css";

function App() {
  // det här löser så vi kan ladda i en tom array utan problem, precis det som Tobias sa på lektionen (tror jag :D)
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("Todos")) || []
  );
  // spara input i state, init värde är tom sträng
  const [inputValue, setInputValue] = useState("");

  // det här går bra att göra inline också men lite mer cleant att göra en metod
  // och kalla på den i onChange på input fältet
  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  // spara nya todos i vårt todo array state
  // istället för spread ...todos så använder vi en callback funktion i vår setTodos för prevState
  // react kommer att ge oss värdet för prevState när det uppdaterar statet. Det kommer internt från setState metoden.
  // den här syntaxen är att föredra få den ger oss pålitliga uppdateringar av state när vi använder ett gammalt state för att få ett nytt
  // som vi gör med todos, vi vill ha alla gamla todos och också den nya todon
  // om vi använder syntaxen i första expemlet (OldApp) och du gör flera anrop på att uppdatera state så kan du få "stale state" (gammalt state innan det uppdateras)
  // och det kan leda till en del error.
  // den här syntaxen ser till att vi faktiskgt får korrekt state när funktionen anropas.
  const saveTodo = () => {
    setTodos((prevState) => [
      ...prevState,
      {
        text: inputValue,
        id: uuidv4(),
      },
    ]);

    // clear input
    setInputValue("");
  };

  // samma som förut, använder metoden filter() för att filtrera bort den vi klickat på
  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  // vi behöver inte hålla på och trixa med useRef()
  // däremot kan vi inte byta plats på den här useEffecten och den under
  // I React 17 gick det bra att göra så
  // det finns två problem med demon i React 17, dels så tar jag bort strict mode vilket i React 18 är default och dels så handlar det om att batching i React har förändrats från 17 till 18
  // strict mode är numera default i React 18 och nej vi bör nog inte ta bort det. När react körs i strict mode så kör React vissa funktioner två gånger för
  // att vi som utvecklare ska kunna upptäcka problem i vår kod. I React 17 så tystades den andra körningen ner helt och hållet och vi såg den inte...
  // vi ska prata mer om strict mode

  // andra problemet är batching.
  // batching är Reacts sätt att gruppera multiple state uppdateringar i re-rendera componenten endast en gång för bättre performance.
  // det gör ingen skillnad för små appar men för större appar så kan det göra stor skillnad för performance
  // React genomförde batching även i innan React 18 men endast för browser events
  // i React 18 genomför React automatiskt batching vilket resulterar i bättre performance när det kommer till större appar
  // ibland vill vi inte att det ska ske automatiskt och det finns sätt vi kan förhindra det på som är tillhandahållna av React
  // vi ska prata mer om det här också!

  useEffect(() => {
    localStorage.setItem("Todos", JSON.stringify(todos));
  }, [todos]);

  // mycket mer cleant
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("Todos"));
    if (data) {
      setTodos(data);
    }
  }, []);

  return (
    <div className="App">
      <div>
        <input
          autoFocus
          value={inputValue}
          type="text"
          placeholder="Type todo..."
          onChange={inputHandler}
        />
        <button onClick={saveTodo}>Add ToDo</button>
      </div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <p>{todo.text}</p>
          <button onClick={() => deleteTodo(todo.id)}>DELETE</button>
        </div>
      ))}
    </div>
  );
}

export default App;
