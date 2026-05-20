import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddMovie from "../Components/addMovie";

export default function Backoffice() {
  return (
    <div>
      <h1>Backoffice</h1>
      <AddMovie />
    </div>
  );
}
