const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for MMM-Sensibo");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_SENSIBO_DATA") {
            this.fetchSensiboData(payload.apiKey);
        }
    },

    fetchSensiboData: function (apiKey) {
        const url = `https://home.sensibo.com/api/v2/users/me/pods?apiKey=${apiKey}&fields=room,pod,acState`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    this.sendSocketNotification("SENSIBO_DATA", data.result);
                } else {
                    console.error("MMM-Sensibo: Failed to fetch data");
                }
            })
            .catch(error => {
                console.error("MMM-Sensibo: Error fetching data", error);
            });
    }
});
