const NodeHelper = require("node_helper");
const https = require("https");

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

        https.get(url, (response) => {
            let data = "";

            // Accumulate data chunks
            response.on("data", (chunk) => {
                data += chunk;
            });

            // Parse JSON once the response ends
            response.on("end", () => {
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.status === "success") {
                        this.sendSocketNotification("SENSIBO_DATA", parsedData.result);
                    } else {
                        console.error("MMM-Sensibo: Failed to fetch data");
                    }
                } catch (error) {
                    console.error("MMM-Sensibo: Error parsing data", error);
                }
            });
        }).on("error", (error) => {
            console.error("MMM-Sensibo: Error fetching data", error);
        });
    }
});
