/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/Home.css";
import { useEffect } from "react";
const Home = () => {

  return (
    <header className="header">
      <main className="home">
        <div className="right">
          <h1>User Details</h1>
          <section className="outlet">
            <Outlet />
          </section>
        </div>
        <div className="about">
         <Link  to="https://funny-truffle-75736f.netlify.app/" target="_blank"> About The Developer </Link>
        </div>
      </main>
    </header>
  );
};

export default Home;
