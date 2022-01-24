import React from "react";
import {
    List, ListItem, ListItemIcon, ListItemText, Box
} from '@material-ui/core';
import {Inbox} from '@material-ui/icons';

const ManageVolunteers = () => {
    return (
        <div style={styles.page}>
            <div>
                Create account
            </div>
            <div>
                Manage account
            </div>
            <div>
                Delete account
            </div>
        </div>
    )
}

const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems:"center",
        width: "100%",
        height: "100%",
        borderStyle: "solid",
    },
    list : {

    },
}

export default ManageVolunteers;
