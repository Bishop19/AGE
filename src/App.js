import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>API Gateway Picker</div>
    </ThemeProvider>
  );
};

export default App;
