import React, { PureComponent } from "react";
import { Button } from "@material-ui/core";

class Index extends PureComponent {
    render() {
        return (
            <div>
                <Button variant="contained" color="primary">
                    hello mui
                </Button>
            </div>
        );
    }
}

export default Index;
