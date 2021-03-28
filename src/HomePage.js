import React from "react";
import { Button } from "@chakra-ui/react"
import {Link } from "react-router-dom";


function HomePage() {

    return(
        <div>
            <h1>Home Page</h1>
            <Link to="/form2">
              <Button disableElevation colorScheme="blue">
                Register
              </Button>
            </Link>
        </div>
    );
}

export default HomePage;