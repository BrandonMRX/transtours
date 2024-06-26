/*import React from "react";

const AppContext = React.createContext();

export default AppContext;
*/
import React, { useState, createContext } from "react";

const ExerciseContext = createContext([{}, () => {}]);

const ExerciseProvider = (props) => {
  const [state, setState] = useState(0);
  //{ exerciseCount: 0, workoutCount: 0 }

  return (
    <ExerciseContext.Provider value={[state, setState]}>
      {props.children}
    </ExerciseContext.Provider>
  );
};

export { ExerciseContext, ExerciseProvider };