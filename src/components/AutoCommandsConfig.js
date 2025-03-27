import React from "react";
import { addStyles, EditableMathField } from "react-mathquill";
addStyles();

export const mathquillConfig = {
  autoCommands:
    "sqrt alpha beta gamma theta pi phi sigma tau infinity partial delta",
  autoOperatorNames: "sin cos tan log ln exp",
};
